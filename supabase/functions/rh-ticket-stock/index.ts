// Public, read-only proxy for the 2026 Rural Health Convening ticket stock.
//
// Why this exists: the ticket store (secure.yoursparkpoint.org, a Squarespace
// Commerce site) embeds its live inventory count in the product page's HTML,
// but Squarespace does not send CORS headers that allow yoursparkpoint.org to
// fetch it directly from the browser. This function fetches it server-side
// (no CORS restriction applies to server-to-server requests) and re-serves
// just the number, with permissive CORS, so the event page can show a live
// remaining-seats count.
//
// The general-registration pool for this event is capped at 150 seats in the
// Squarespace product's inventory (a separate 50-seat allocation for sponsors
// and simulator-partner orgs is handled outside this store product entirely,
// so it is never reflected in this number).

const SOURCE_URL =
  "https://secure.yoursparkpoint.org/store/p/2026-rural-health-convening";
const GENERAL_REGISTRATION_TOTAL = 150;
const UPSTREAM_TIMEOUT_MS = 5000;
const CACHE_TTL_MS = 2 * 60 * 1000;

const CORS_HEADERS: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, apikey, Authorization",
};

type CacheEntry = { remaining: number; checkedAt: string };

// Module-scope cache: persists across warm invocations of the same isolate,
// resets on cold start. A soft optimization, not a correctness requirement —
// this endpoint is cheap enough to hit on every request if the cache misses.
let cache: CacheEntry | null = null;
let cacheExpiresAt = 0;

async function fetchRemainingSeats(): Promise<number> {
  const res = await fetch(SOURCE_URL, {
    headers: {
      "User-Agent": "Mozilla/5.0 (compatible; SparkPointTicketStock/1.0)",
    },
    signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
  });

  if (!res.ok) {
    throw new Error(`Upstream responded ${res.status}`);
  }

  const html = await res.text();
  const match = html.match(/"stock":\{[^}]*\}/);
  if (!match) {
    throw new Error("Stock field not found in upstream page");
  }

  const stock = JSON.parse(match[0].slice('"stock":'.length));
  if (typeof stock.quantity !== "number" || stock.quantity < 0) {
    throw new Error("Stock field had an unexpected shape");
  }

  return stock.quantity;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: CORS_HEADERS });
  }

  try {
    const now = Date.now();
    if (!cache || now > cacheExpiresAt) {
      const remaining = await fetchRemainingSeats();
      cache = { remaining, checkedAt: new Date().toISOString() };
      cacheExpiresAt = now + CACHE_TTL_MS;
    }

    return new Response(
      JSON.stringify({
        remaining: cache.remaining,
        total: GENERAL_REGISTRATION_TOTAL,
        checkedAt: cache.checkedAt,
      }),
      {
        headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    console.error("rh-ticket-stock error:", error);
    return new Response(JSON.stringify({ error: "unavailable" }), {
      status: 503,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });
  }
});
