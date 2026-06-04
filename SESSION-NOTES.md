# PNW Fishing Guide – Session Notes

## Session: 2026-06-03

### Completed
- Fixed pre-existing syntax error: stray `}` at line 4072 (`showUpdateBanner` function) — was masked by old SW cache, broke once SW was cleared
- Built and deployed `pnwfg-stocking` Cloudflare Worker at `pnwfg-stocking.yab-account.workers.dev`
  - Proxies WDFW dataset `6fex-3r7d`, sorted by `release_start_date DESC` (not `date_stocked` — that column doesn't exist)
  - Returns JSON with CORS headers, 1hr cache
  - Confirmed returning live data in Worker preview
- Updated `fetchStockingReport()` in `index.html` line 3299 to point at Worker URL instead of `data.wa.gov`
- Added `pnwfg-stocking.yab-account.workers.dev` to `NETWORK_ONLY_HOSTS` in `service-worker.js`
- Bumped VERSION to `v2.6` in `service-worker.js`
- Purged Cloudflare edge cache via safjob.com → Caching → Configuration → Purge Everything

### Still Blocked
- Stocking section still shows "Loading..." — SW cache activation problem
- Fix is architecturally correct; Worker returns data, URL is right, NETWORK_ONLY_HOSTS is updated
- Browsers (Chrome, Edge, incognito) all holding onto old SW despite purge, unregister attempts, and tab closes
- Root cause: `service-worker.js` has a 4-hour Browser Cache TTL set in Cloudflare — browsers won't re-fetch it until TTL expires

### Next Session: Fix SW cache activation
Two options, pick one:
1. **Preferred:** Add `Cache-Control: no-store` header to `service-worker.js` specifically via a Cloudflare Cache Rule so it's never cached at the edge or browser
2. **Alternative:** Add `self.skipWaiting()` call directly inside the `activate` event handler for more aggressive takeover

### Pending (Tier 2)
- Newsletter title mismatch: "The Monthly Letter" in HTML vs "The Field Report" in Beehiiv
- Regulation quick-reference
- Hatchery vs. wild indicators
- Server-side date/county filtering for stocking API
- Bump version display in `index.html` header from v2.5 to v2.6
