// PNW Angler Field Guide - Service Worker
// Cache-first with background update (stale-while-revalidate)

const VERSION = 'v2.9.6';
const CACHE_NAME = `pnw-angler-${VERSION}`;

// Assets to cache on install (the app shell)
const PRECACHE_URLS = [
  './',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-192-maskable.png',
  './icons/icon-512-maskable.png',
  './icons/apple-touch-icon.png',
  './icons/favicon-32.png',
  './icons/logo-header-256.png',
];

// Google Fonts URLs that the app uses
const FONT_URLS = [
  'https://fonts.googleapis.com/css2?family=Bebas+Neue&family=JetBrains+Mono:wght@400;700&family=Inter:wght@400;500;600;700;800&display=swap',
];

// APIs that must always go to network (never cached, never returned stale)
const NETWORK_ONLY_HOSTS = [
  'api.open-meteo.com',
  'api.tidesandcurrents.noaa.gov',
  'embeds.beehiiv.com',
  'data.wa.gov',
  'pnwfg-stocking.yab-account.workers.dev',
];

// ============ INSTALL ============
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Caching app shell');
      // Cache local assets (required)
      return cache.addAll(PRECACHE_URLS).then(() => {
        // Try to cache fonts but don't fail install if blocked
        return Promise.allSettled(
          FONT_URLS.map((url) =>
            fetch(url, { mode: 'no-cors' })
              .then((res) => cache.put(url, res))
              .catch(() => console.log('[SW] Font cache skipped:', url))
          )
        );
      });
    }).then(() => self.skipWaiting())
  );
});

// ============ ACTIVATE ============
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name.startsWith('pnw-angler-') && name !== CACHE_NAME)
          .map((name) => {
            console.log('[SW] Removing old cache:', name);
            return caches.delete(name);
          })
      );
    }).then(() => self.clients.claim())
  );
});

// ============ FETCH (stale-while-revalidate) ============
self.addEventListener('fetch', (event) => {
  // Only handle GET requests
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // Skip network-only hosts (live data APIs)
  if (NETWORK_ONLY_HOSTS.some(h => url.hostname === h)) return;

  // Skip cross-origin requests that aren't fonts
  const isOrigin = url.origin === self.location.origin;
  const isFont =
    url.hostname === 'fonts.googleapis.com' ||
    url.hostname === 'fonts.gstatic.com';

  if (!isOrigin && !isFont) return;

  // Page loads always use the app shell stored at './' so a request for
  // /index.html (which Cloudflare Pages redirects to /) never hits a redirect.
  const isNavigation = event.request.mode === 'navigate';
  const cacheKey = isNavigation && isOrigin ? './' : event.request;

  event.respondWith(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.match(cacheKey).then((cachedResponse) => {
        const fetchPromise = fetch(event.request)
          .then((networkResponse) => {
            // Update cache with fresh response (never store a redirected one)
            if (networkResponse && networkResponse.status === 200 && !networkResponse.redirected) {
              cache.put(cacheKey, networkResponse.clone());
            }
            return cleanResponse(networkResponse);
          })
          .catch(() => {
            // Network failed; fall back to cached version (if any)
            return cleanResponse(cachedResponse);
          });

        // Return cached immediately if available, else wait for network
        return cachedResponse ? cleanResponse(cachedResponse) : fetchPromise;
      });
    })
  );
});

// Safari refuses to load a page from a service worker response that went
// through a redirect. Rebuild any such response as a plain one.
function cleanResponse(response) {
  if (!response || !response.redirected) return response;
  return response.blob().then((body) => new Response(body, {
    status: response.status,
    statusText: response.statusText,
    headers: response.headers,
  }));
}

// ============ MESSAGES (for manual update prompts) ============
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
