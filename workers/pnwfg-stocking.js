// pnwfg-stocking Cloudflare Worker
// Proxies the WDFW Fish Plants dataset (data.wa.gov 6fex-3r7d) for the PNW Angler Field Guide.
//   GET /            -> 50 most recent plants statewide
//   GET /?q=klineline -> up to 100 most recent plants whose release_location contains the text
// Deploy: Cloudflare dashboard > Workers & Pages > pnwfg-stocking > Edit code > paste > Deploy.

const DATASET = 'https://data.wa.gov/resource/6fex-3r7d.json';
const CORS = { 'Access-Control-Allow-Origin': '*' };

export default {
  async fetch(request) {
    const url = new URL(request.url);
    // Keep only letters, numbers, spaces, and a few name characters; cap length.
    const q = (url.searchParams.get('q') || '')
      .replace(/[^\p{L}\p{N} .'\-()]/gu, '')
      .trim()
      .slice(0, 60);

    const params = new URLSearchParams({
      $order: 'release_start_date DESC',
      $limit: q ? '100' : '50',
    });
    if (q) {
      const safe = q.toUpperCase().replace(/'/g, "''");
      params.set('$where', `upper(release_location) like '%${safe}%'`);
    }

    try {
      const response = await fetch(`${DATASET}?${params}`, {
        headers: { Accept: 'application/json' },
      });
      if (!response.ok) throw new Error(`WDFW ${response.status}`);
      const data = await response.json();
      return new Response(JSON.stringify(data), {
        status: 200,
        headers: {
          ...CORS,
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=3600',
        },
      });
    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), {
        status: 500,
        headers: { ...CORS, 'Content-Type': 'application/json' },
      });
    }
  },
};
