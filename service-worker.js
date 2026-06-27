// PNW Angler Field Guide - Service Worker
// Cache-first with background update (stale-while-revalidate)

const VERSION = 'v2.9';
const CACHE_NAME = `pnw-angler-${VERSION}`;

// Assets to cache on install (the app shell)
const PRECACHE_URLS = [
  './',
  './index.html',
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

  event.respondWith(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.match(event.request).then((cachedResponse) => {
        const fetchPromise = fetch(event.request)
          .then((networkResponse) => {
            // Update cache with fresh response
            if (networkResponse && networkResponse.status === 200) {
              cache.put(event.request, networkResponse.clone());
            }
            return networkResponse;
          })
          .catch(() => {
            // Network failed; cached version (if any) was already served below
            return cachedResponse;
          });

        // Return cached immediately if available, else wait for network
        return cachedResponse || fetchPromise;
      });
    })
  );
});

// ============ MESSAGES (for manual update prompts) ============
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
