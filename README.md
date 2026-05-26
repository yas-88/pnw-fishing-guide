# PNW Angler Field Guide · PWA

Pacific Northwest fishing field guide by Yassir Baza (YAB Official). Installable to phone home screen, works offline, live weather conditions, tide data, newsletter signup. No app store.

**Version 2.2** · adds tides, 7-day forecast, newsletter.

## What's new in v2.2
- **NOAA tide data** for coastal locations (Westport, Newport, Neah Bay, Astoria). Next 4 high/low tides with times and heights.
- **7-day forecast grid** with daily bite scores. Best days highlighted in green.
- **Newsletter signup** wired for Beehiiv. Fallback queue stores signups locally until Beehiiv is configured.

## v2.1 features (already in)
- Live weather (Open-Meteo, no API key) on the "Right Now" tab
- 9 pre-set PNW locations + "use my location" via geolocation
- Bite score calculated from real-time pressure, wind, and sky conditions
- Best fishing windows calculated from actual sunrise/sunset for the day
- Updated icons using the PNW Fishing Guide brand seal
- Logo mark in the app header
- Auto-refresh every 15 minutes while open

## Newsletter setup (Beehiiv)

The newsletter form is live in the app but needs your Beehiiv embed to actually send signups. Until that's set, emails are saved locally in the user's browser so you can pull them out later.

### Step-by-step

1. **Create Beehiiv account** at beehiiv.com. Free plan covers up to 2,500 subscribers, no time limit.
2. **Set publication name** (e.g. "PNW Fishing Monthly" by YAB Official). Pick a subdomain like `yab.beehiiv.com` or `pnwfishing.beehiiv.com`.
3. **Create the subscribe form:**
   - Dashboard → Audience → Subscribe forms → New form
   - Style it however you want (Beehiiv's builder gives you full control)
   - Beehiiv updated their form builder on April 30, 2026; the new draft/publish workflow means you click Publish before the embed becomes live
4. **Click Embed** on the form. Copy the iframe code Beehiiv gives you. It looks like:
   ```html
   <iframe src="https://embeds.beehiiv.com/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
           data-test-id="beehiiv-embed"
           width="100%" height="320" frameborder="0" scrolling="no"
           style="border-radius: 8px; background: transparent;"></iframe>
   ```
5. **Open `index.html`** in your editor.
6. **Find the `<!-- BEEHIIV IFRAME EMBED -->` block** (inside the `.newsletter-box` div).
7. **Replace the HTML comment with your iframe.** The native form auto-hides when an iframe is present.
8. **Update the archive URL** in the script:
   ```js
   const BEEHIIV_ARCHIVE_URL = 'https://yab.beehiiv.com';  // <-- your URL
   ```
9. **Bump the service worker version** in `service-worker.js`:
   ```js
   const VERSION = 'v2.2.1';  // increment
   ```
10. **Deploy.** Users will see the update banner the next time they open the app.

### Exporting locally-queued signups

If subscribers signed up before Beehiiv was configured, their emails are saved in browser localStorage. To pull them out:

1. Open the app in Chrome desktop
2. DevTools (F12) → Console tab
3. Type `exportNewsletterQueue()` and press Enter
4. Console shows a CSV you can copy/paste into Beehiiv's bulk import (Audience → Subscribers → Import)
5. After importing, run `clearNewsletterQueue()` to clear the local store

**Note:** localStorage is per-device and per-browser. Anyone signing up on their own phone has emails stored only on that phone. Get Beehiiv configured before any meaningful launch push.

## Live data sources

| Data | Source | API Key Required | Cost |
|---|---|---|---|
| Weather (current + 7-day) | Open-Meteo | No | Free, unlimited |
| Tides (coastal only) | NOAA CO-OPS | No | Free, unlimited |
| Newsletter | Beehiiv | No (uses embed endpoint) | Free up to 2,500 subs |

All three work directly from the browser. No backend server needed.

## File structure

```
pnw-angler/
├── index.html              Main app (single page, all data inline)
├── manifest.json           PWA metadata
├── service-worker.js       Offline caching
├── icons/
│   ├── icon-192.png        Standard 192px
│   ├── icon-512.png        Standard 512px (used on splash screens)
│   ├── icon-192-maskable.png   Android adaptive icon
│   ├── icon-512-maskable.png   Android adaptive icon
│   ├── apple-touch-icon.png    iOS home screen 180px
│   └── favicon-32.png      Browser tab
└── README.md               This file
```

## Deployment

### CodeSandbox (fastest test path)
1. Create a new Static site (HTML/CSS/JS) sandbox at codesandbox.io
2. Drag the entire `pnw-angler` folder into the file tree
3. CodeSandbox auto-serves over HTTPS (this is required for the service worker)
4. Click the preview URL on your phone, then "Add to Home Screen"

### GitHub Pages
1. Create a new public repo (e.g. `pnw-angler`)
2. Push all files to the root of the `main` branch
3. Repo Settings → Pages → Source: `Deploy from branch` → `main` → `/ (root)` → Save
4. Wait 1-2 minutes; site goes live at `https://<username>.github.io/pnw-angler/`
5. Visit on phone, "Add to Home Screen"

### Cloudflare Pages (production setup)
1. Push to GitHub first (same as above)
2. Cloudflare dashboard → Workers & Pages → Create → Pages → Connect to Git
3. Select the repo, leave build settings empty (it's a static site)
4. Deploy. Free SSL, custom domain support, edge CDN
5. Add your custom domain under the Pages project settings
6. Cloudflare auto-issues SSL cert in ~5 minutes

## Testing locally

The service worker requires HTTPS or `localhost`. To test from your machine:

```bash
cd pnw-angler
python3 -m http.server 8000
# Open http://localhost:8000 in Chrome
# DevTools → Application → Service Workers (verify "activated and running")
```

`file://` URLs do not work. The browser will silently block the service worker.

## Updating the app

When you change `index.html` or any data:

1. Bump the version in `service-worker.js`:
   ```js
   const VERSION = 'v2.0.1';   // Increment this
   ```
2. Commit and push. Users will see a green "New version available" banner the next time they open the app.

The old cache is deleted automatically when the new service worker activates.

## What works offline

After the first visit:
- All HTML, CSS, JS, fonts, and icons load with zero signal
- Species search, region filters, tab switching all work
- All weather infographics, knot diagrams, and rig diagrams render

What does not work offline (and isn't designed to):
- The static "Right Now" snapshot uses placeholder values, not live weather
- External links to WDFW.gov, ODFW, and font CDN updates need signal

## Browser support

| Feature | iOS Safari | Android Chrome | Desktop Chrome | Firefox |
|---|---|---|---|---|
| Install to home screen | ✓ (Share → Add to HS) | ✓ (auto prompt) | ✓ (URL bar icon) | ✓ |
| Offline | ✓ | ✓ | ✓ | ✓ |
| Install banner | Manual | ✓ Automatic | ✓ Automatic | Manual |
| Push notifications | Not used | Not used | Not used | Not used |

## License + attribution

Your guide. No tracking, no analytics, no third-party calls except Google Fonts.
Fishing data is directional. Verify all regulations at wdfw.wa.gov and myodfw.com before fishing.
