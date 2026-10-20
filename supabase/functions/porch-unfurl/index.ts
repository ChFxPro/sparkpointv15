// Link previews for the BackPorch editor (/internal/backporch).
//
// When an editor pastes a link, the editor asks this function for that page's own
// preview (title, description, site name, image). Browsers can't read other sites'
// pages directly, so a server has to fetch them. Two calls:
//   POST {"url": "https://..."}    -> {"preview": {url, title, description, site, image}}
//   POST {"image": "https://..."}  -> the image bytes, so the editor can resize them
//                                     and store a copy in our own `porch-media` bucket.
// The public site then shows our copy, never the other site's image, so visitors
// make no third-party requests (the site promises no tracking).
//
// Guard rails, because this fetches URLs on someone's say-so:
//   - Only BackPorch editors (the same `is_porch_editor()` check as writing posts).
//   - https only, no credentials or odd ports, and every hostname is resolved and
//     refused if it points at a private, loopback, link-local, or metadata address.
//     Redirects are followed by hand (at most 4) and each hop is checked again.
//   - 8-second timeout; pages read up to 1 MB, images up to 8 MB, images must be images.
//
// Secrets: none beyond SUPABASE_URL and SUPABASE_ANON_KEY, provided by Supabase.
import { acceptableUrl, isPrivateAddress, parsePreview } from "./parse.ts";

const ALLOWED_ORIGINS = new Set([
  "https://yoursparkpoint.org",
  "https://www.yoursparkpoint.org",
  "http://localhost:3000",
]);
const PAGE_BYTES = 1024 * 1024;
const IMAGE_BYTES = 8 * 1024 * 1024;

function cors(req: Request): Record<string, string> {
  const origin = req.headers.get("Origin") ?? "";
  return {
    "Access-Control-Allow-Origin": ALLOWED_ORIGINS.has(origin) ? origin : "https://yoursparkpoint.org",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, apikey, Authorization, x-client-info",
    Vary: "Origin",
  };
}

const json = (req: Request, status: number, body: unknown) =>
  new Response(JSON.stringify(body), { status, headers: { ...cors(req), "Content-Type": "application/json" } });

async function isEditor(authHeader: string): Promise<boolean> {
  const url = Deno.env.get("SUPABASE_URL");
  const anon = Deno.env.get("SUPABASE_ANON_KEY");
  if (!url || !anon) return false;
  const res = await fetch(`${url}/rest/v1/rpc/is_porch_editor`, {
    method: "POST",
    headers: { apikey: anon, Authorization: authHeader, "Content-Type": "application/json" },
    body: "{}",
    signal: AbortSignal.timeout(5000),
  });
  return res.ok && (await res.json()) === true;
}

async function hostIsPublic(host: string): Promise<boolean> {
  const bare = host.replace(/^\[|\]$/g, "");
  if (/^[\d.]+$/.test(bare) || bare.includes(":")) return !isPrivateAddress(bare);
  const found: string[] = [];
  for (const type of ["A", "AAAA"] as const) {
    try {
      found.push(...(await Deno.resolveDns(bare, type)));
    } catch {
      /* no records of this type */
    }
  }
  return found.length > 0 && found.every((ip) => !isPrivateAddress(ip));
}

/** Fetch with redirects followed by hand, each hop checked; body capped at `max` bytes. */
async function safeFetch(start: string, accept: string, max: number): Promise<{ url: string; type: string; body: Uint8Array }> {
  let current = start;
  for (let hop = 0; hop < 5; hop++) {
    const u = acceptableUrl(current);
    if (!u || !(await hostIsPublic(u.hostname))) throw new Error("That address can't be previewed.");
    const res = await fetch(u, {
      redirect: "manual",
      headers: { Accept: accept, "User-Agent": "SparkPointBackPorch/1.0 (+https://yoursparkpoint.org/backporch)" },
      signal: AbortSignal.timeout(8000),
    });
    if (res.status >= 300 && res.status < 400) {
      const next = res.headers.get("Location");
      await res.body?.cancel();
      if (!next) throw new Error("That page redirects nowhere.");
      current = new URL(next, u).toString();
      continue;
    }
    if (!res.ok) {
      await res.body?.cancel();
      throw new Error(`That page answered ${res.status}.`);
    }
    const reader = res.body?.getReader();
    const chunks: Uint8Array[] = [];
    let size = 0;
    while (reader) {
      const { value, done } = await reader.read();
      if (done) break;
      size += value.length;
      if (size > max) {
        await reader.cancel();
        if (accept.startsWith("image")) throw new Error("That image is too large.");
        break; // a long page: the head is all we need
      }
      chunks.push(value);
    }
    const body = new Uint8Array(Math.min(size, max));
    let at = 0;
    for (const c of chunks) {
      body.set(c.subarray(0, body.length - at), at);
      at += c.length;
      if (at >= body.length) break;
    }
    return { url: u.toString(), type: res.headers.get("Content-Type") ?? "", body };
  }
  throw new Error("Too many redirects.");
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: cors(req) });
  if (req.method !== "POST") return json(req, 405, { error: "method not allowed" });

  const auth = req.headers.get("Authorization") ?? "";
  if (!auth.startsWith("Bearer ")) return json(req, 401, { error: "sign in first" });
  try {
    if (!(await isEditor(auth))) return json(req, 403, { error: "not a BackPorch editor" });
  } catch {
    return json(req, 503, { error: "could not check access" });
  }

  let input: { url?: unknown; image?: unknown };
  try {
    input = await req.json();
  } catch {
    return json(req, 400, { error: "send JSON" });
  }

  try {
    if (typeof input.image === "string") {
      const got = await safeFetch(input.image, "image/*", IMAGE_BYTES);
      const type = got.type.split(";")[0].trim().toLowerCase();
      if (!/^image\/(jpeg|png|webp|gif|avif)$/.test(type)) return json(req, 415, { error: "That isn't an image." });
      // A fresh ArrayBuffer copy: newer Deno types reject Uint8Array<ArrayBufferLike> as a body.
      return new Response(new Uint8Array(got.body).buffer as ArrayBuffer, { headers: { ...cors(req), "Content-Type": type, "Cache-Control": "no-store" } });
    }
    if (typeof input.url === "string") {
      const got = await safeFetch(input.url, "text/html,application/xhtml+xml", PAGE_BYTES);
      if (!/html/i.test(got.type)) return json(req, 200, { preview: { url: got.url, site: new URL(got.url).hostname } });
      const html = new TextDecoder().decode(got.body);
      return json(req, 200, { preview: parsePreview(html, got.url) });
    }
    return json(req, 400, { error: "send a url or an image" });
  } catch (err) {
    return json(req, 422, { error: err instanceof Error ? err.message : "Could not fetch that." });
  }
});
