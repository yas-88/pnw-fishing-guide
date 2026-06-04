PNW Fishing Guide – Session Notes
Session: 2026-06-03 (completed)
Stocking Report — COMPLETE ✅

Cloudflare Worker pnwfg-stocking.yab-account.workers.dev live and returning WDFW data
fetchStockingReport() now called on page load
Field names corrected: release_location, release_start_date, species_type, number_released
Water, Species, Count, Date all rendering correctly
SW Washington filtered view loads on page load
"Show All WA" toggle works
Data auto-refreshes hourly via Worker cache

Session: 2026-06-04 (completed)
Newsletter Title — COMPLETE ✅

HTML already showed "The Field Report" — mismatch was already resolved, no change needed

Regulation Quick-Reference — COMPLETE ✅

All 30 species: limit: replaced with regs: { limit, size, gear, waUrl, orUrl }
Species render updated: Regs row shows limit, min size, gear restrictions, WA Regs ↗ / OR Regs ↗ links
WDFW URL: wdfw.wa.gov/fishing/regulations (universal)
ODFW URLs: species-specific myodfw.com/fishing/species/[slug] where available
22 spot cards updated with regsUrl + optional regsNote
Spot render updated to show "Regs ↗" link at bottom of each card

Hatchery vs. Wild Indicators — COMPLETE ✅

12 species updated with retention: and retentionNote: fields

Hatchery only: Rainbow Trout, Steelhead, Spring Chinook, Fall Chinook, Coho (fresh + salt), Chinook (salt)
Wild C&R: Cutthroat, Sockeye, Kokanee, Pink Salmon, White Sturgeon


Header tag: 🏷 HATCHERY ONLY (amber) or 🐟 WILD · C&R (green) visible without expanding card
Regs row: retention note with left-border callout — clipped adipose fin guidance, barbless requirement
CSS: .mini-tag.hatchery, .mini-tag.wild, .mini-tag.wild-cr

Infrastructure

Worker: pnwfg-stocking.yab-account.workers.dev
Cache Rule: "No-cache service worker" active on safjob.com
SW version: v2.6
Cloudflare Pages: auto-deploys from GitHub main

TIER STATUS

Tier 1: COMPLETE ✅
Tier 2: COMPLETE ✅
Tier 3 (next): Trip log, tide calendar, offline maps

Pending / Next Session

Server-side date/county filtering for stocking API (deferred — JS-side filtering working fine)
Thicken spots section content
Tier 3 planning
