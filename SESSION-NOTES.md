# PNW Fishing Guide – Session Notes

## Session: 2026-06-03 (completed)

### Stocking Report — COMPLETE ✅
- Cloudflare Worker `pnwfg-stocking.yab-account.workers.dev` live and returning WDFW data
- `fetchStockingReport()` now called on page load
- Field names corrected: `release_location`, `release_start_date`, `species_type`, `number_released`
- Water, Species, Count, Date all rendering correctly
- SW Washington filtered view loads on page load
- "Show All WA" toggle works
- Data auto-refreshes hourly via Worker cache

### Infrastructure
- Worker: `pnwfg-stocking.yab-account.workers.dev`
- Cache Rule: "No-cache service worker" active on safjob.com
- SW version: v2.6
- Cloudflare Pages: auto-deploys from GitHub main

### Pending
- Bump version display in `index.html` header from v2.5 to v2.6
- Newsletter title mismatch: "The Monthly Letter" in HTML vs "The Field Report" in Beehiiv
- Regulation quick-reference
- Hatchery vs. wild indicators
- Server-side date/county filtering for stocking API
