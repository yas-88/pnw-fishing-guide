# PNW Fishing Guide – Session Notes

## Session: 2026-06-03 (continued)

### Status: Stocking Report — Partially Working
- Worker is live and returning real WDFW data ✅
- "Show All WA" button works and renders 50 records ✅
- Default SW Washington filtered view still shows "Loading..." indefinitely ❌
- Water and Date columns show `—` (field name mismatch) ❌
- Version display in header still shows v2.5 (cosmetic only) ❌

### What's Working
- `pnwfg-stocking.yab-account.workers.dev` returns live WDFW data
- Species rendering correctly: Cutthroat, Coho, Rainbow, Chinook, Kokanee, Steelhead, Tiger Trout
- SW v2.6 is active with correct NETWORK_ONLY_HOSTS
- Cloudflare Cache Rule: `No-cache service worker` — URI Path equals `/service-worker.js`, Browser TTL 1 second, Bypass cache ✅
- Syntax error (stray `}` at line 4072) fixed ✅

### Next Session: Three fixes needed

**Fix 1 — Default view not loading (priority)**
`fetchStockingReport()` is being called but the SW-filtered view isn't rendering on page load. Need to check `toggleStockingScope()` and the initial call logic in `index.html`. The "Show All WA" path works, so the filtered path has a bug.

**Fix 2 — Field name mismatch**
`renderStockingTable()` is likely looking for `location` and `date_stocked` but actual API fields are `release_location` and `release_start_date`. Need to update the render function to use correct field names.

**Fix 3 — Version display**
Change `v2.5` to `v2.6` in `index.html` header string (cosmetic).

### Infrastructure
- Worker: `pnwfg-stocking.yab-account.workers.dev`
- Cache Rule: "No-cache service worker" active on safjob.com
- SW version: v2.6 (confirmed active in incognito)
- Cloudflare Pages: auto-deploys from GitHub main

### Pending (Tier 2)
- Newsletter title mismatch: "The Monthly Letter" in HTML vs "The Field Report" in Beehiiv
- Regulation quick-reference
- Hatchery vs. wild indicators
- Server-side date/county filtering for stocking API
