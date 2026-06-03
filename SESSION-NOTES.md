PNW Angler Field Guide · Session Notes

Session 3 · June 3, 2026
What was accomplished

Diagnosed stocking report never calling fetchStockingReport() on page load -- fixed
Added 8-second AbortController timeout to fetch
Added console.error to catch block for debugging
Added data.wa.gov to NETWORK_ONLY_HOSTS in service-worker.js
Bumped service worker to v2.5
Purged Cloudflare CDN cache

Root cause identified (not yet fixed)
The stocking fetch never reaches data.wa.gov. Network tab shows zero requests to that domain. The service worker intercepts and drops the call before it leaves the browser. Despite adding data.wa.gov to NETWORK_ONLY_HOSTS, the old cached service worker persists because Cloudflare minifies and caches the SW file with a long TTL. Browser never receives the updated service-worker.js.
What broke and was reverted
Added auto-reload on SW update (setTimeout applyUpdate 2000ms) -- caused reload loop, broke weather and conditions loading. REVERTED. App rolled back to last stable Cloudflare deployment.
Current state

Stocking section shows "Loading stocking data..." -- fetch never fires
All other features working: weather, forecast, seasonal, species, spots, rigs, knots, tips
Service worker version: v2.5 in repo but old cached version still serving in browser

Next session plan
Build a Cloudflare Worker proxy for the stocking API:

Create new Worker in Cloudflare dashboard (can reuse the beehiiv-subscribe worker pattern)
Worker fetches data.wa.gov/resource/6fex-3r7d.json and returns response with CORS headers
Update fetchStockingReport() in index.html to call the Worker URL instead of data.wa.gov directly
This bypasses the service worker cache entirely since the call goes through our own CF Worker infrastructure

Tier 2 remaining

Stocking report live data (blocked -- needs CF Worker proxy, ~15 min task next session)
Regulation quick-reference by species/water (static data, no API needed)
Hatchery vs wild indicator on spot cards

Tier 3 (not started)

Trip log
Tide calendar
Offline maps


Session 2 · (prior session)
What was accomplished

30 AI-generated species illustrations added to /Images/, all wired with img: field and .species-photo CSS
Seasonal content: seasonalData JS object keyed by month, renderSeasonalContent() called on load
Bite score fix: warm water warning appended when air temp >= 75F
Stocking report HTML card added to Right Now tab
fetchStockingReport() wired to WDFW API (data.wa.gov, dataset 6fex-3r7d)
renderStockingTable() and toggleStockingScope() implemented

Current state at end of session

Stocking API call hanging/failing -- left for Session 3 to debug


Session 1 · (prior session)
What was accomplished

Tier 1 complete: species guide, spots, rigs, hooks, knots, tips
Live weather via Open-Meteo (no API key)
Tide data via NOAA CO-OPS for coastal locations
7-day forecast with bite scores
Newsletter via Beehiiv (Cloudflare Worker proxy at beehiiv-subscribe.yab-account.workers.dev)
PWA setup: service worker, manifest, installable
Deployed to pnwfg.safjob.com via Cloudflare Pages + GitHub auto-deploy

Infrastructure

Hosting: Cloudflare Pages
Repo: github.com/yas-88/pnw-fishing-guide
Custom subdomain: pnwfg.safjob.com (under safjob.com business domain)
Newsletter: Beehiiv publication ID 22ef3a8f-1d87-4664-b624-5cab2db4ca26
Beehiiv Worker: beehiiv-subscribe.yab-account.workers.dev
