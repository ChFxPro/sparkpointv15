// Link previews for BackPorch link blocks: the pure parts, shared by the
// `porch-unfurl` edge function (Deno) and the local dev server's demo fetcher
// (vite.config.mts). No runtime APIs here, so both can import it.

export interface LinkPreview {
  url: string; // the final URL after redirects
  title?: string;
  description?: string;
  site?: string;
  image?: string; // absolute URL of the page's preview image, if any
}

const ENTITIES: Record<string, string> = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
  nbsp: ' ',
  rsquo: '’',
  lsquo: '‘',
  rdquo: '”',
  ldquo: '“',
  mdash: '—',
  ndash: '–',
  hellip: '…',
};

export function decodeEntities(s: string): string {
  return s.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (m, code: string) => {
    if (code[0] === '#') {
      const n = code[1].toLowerCase() === 'x' ? parseInt(code.slice(2), 16) : parseInt(code.slice(1), 10);
      return Number.isFinite(n) && n > 0 && n < 0x110000 ? String.fromCodePoint(n) : m;
    }
    return ENTITIES[code.toLowerCase()] ?? m;
  });
}

const clean = (s: string | undefined, max: number) =>
  s ? decodeEntities(s).replace(/\s+/g, ' ').trim().slice(0, max) || undefined : undefined;

/** Reads Open Graph / Twitter / plain tags from the <head> of an HTML page. */
export function parsePreview(html: string, pageUrl: string): LinkPreview {
  const head = html.slice(0, 300_000);
  const metas = new Map<string, string>();
  for (const tag of head.match(/<meta\b[^>]*>/gi) ?? []) {
    const attr = (name: string) =>
      new RegExp(`\\b${name}\\s*=\\s*("([^"]*)"|'([^']*)'|([^\\s>]+))`, 'i').exec(tag);
    const key = attr('property') ?? attr('name');
    const content = attr('content');
    if (!key || !content) continue;
    const k = (key[2] ?? key[3] ?? key[4] ?? '').toLowerCase();
    const v = content[2] ?? content[3] ?? content[4] ?? '';
    if (k && v && !metas.has(k)) metas.set(k, v);
  }
  const titleTag = /<title[^>]*>([\s\S]*?)<\/title>/i.exec(head)?.[1];
  const pick = (...keys: string[]) => keys.map((k) => metas.get(k)).find(Boolean);

  let image: string | undefined;
  const rawImage = pick('og:image:secure_url', 'og:image', 'og:image:url', 'twitter:image', 'twitter:image:src');
  if (rawImage) {
    try {
      const u = new URL(decodeEntities(rawImage.trim()), pageUrl);
      if (u.protocol === 'https:') image = u.toString();
    } catch {
      /* ignore a malformed image URL */
    }
  }

  let site = clean(pick('og:site_name', 'application-name'), 80);
  if (!site) {
    try {
      site = new URL(pageUrl).hostname.replace(/^www\./, '');
    } catch {
      /* leave empty */
    }
  }

  return {
    url: pageUrl,
    title: clean(pick('og:title', 'twitter:title') ?? titleTag, 120),
    description: clean(pick('og:description', 'twitter:description', 'description'), 300),
    site,
    image,
  };
}

/** IPv4 ranges a public link must never reach. */
function isPrivateV4(a: number, b: number, c: number): boolean {
  return (
    a === 0 ||
    a === 10 ||
    a === 127 ||
    (a === 100 && b >= 64 && b <= 127) || // carrier-grade NAT
    (a === 169 && b === 254) || // link-local, cloud metadata
    (a === 172 && b >= 16 && b <= 31) ||
    (a === 192 && b === 168) ||
    (a === 192 && b === 0 && (c === 0 || c === 2)) || // IETF protocol assignments, TEST-NET-1
    (a === 198 && (b === 18 || b === 19)) || // benchmarking
    (a === 198 && b === 51 && c === 100) || // TEST-NET-2
    (a === 203 && b === 0 && c === 113) || // TEST-NET-3
    a >= 224 // multicast, reserved, broadcast
  );
}

function parseV4(s: string): number[] | null {
  const m = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/.exec(s);
  if (!m) return null;
  const parts = m.slice(1).map(Number);
  return parts.every((n) => n <= 255) ? parts : null;
}

/** An IPv6 address as its 16 bytes, or null if it isn't one. Handles ::, a dotted IPv4 tail, and a %zone. */
export function parseV6(input: string): number[] | null {
  let s = input.toLowerCase().replace(/%.*$/, '');
  let tail: number[] = [];
  const dotted = /^(.*:)(\d{1,3}(?:\.\d{1,3}){3})$/.exec(s);
  if (dotted) {
    const v4 = parseV4(dotted[2]);
    if (!v4) return null;
    tail = v4;
    s = dotted[1].endsWith('::') ? dotted[1] : dotted[1].slice(0, -1);
  }
  const halves = s.split('::');
  if (halves.length > 2) return null;
  const groups = (h: string) => (h === '' ? [] : h.split(':'));
  const head = groups(halves[0]);
  const rest = halves.length === 2 ? groups(halves[1]) : [];
  const total = 8 - tail.length / 2;
  if (halves.length === 1 && head.length !== total) return null;
  if (head.length + rest.length > total) return null;
  const words = [...head, ...Array(total - head.length - rest.length).fill('0'), ...rest];
  const bytes: number[] = [];
  for (const w of words) {
    if (!/^[0-9a-f]{1,4}$/.test(w)) return null;
    const n = parseInt(w, 16);
    bytes.push(n >> 8, n & 0xff);
  }
  return [...bytes, ...tail];
}

/**
 * True for addresses a public link must never point at: loopback, private
 * ranges, link-local (cloud metadata lives at 169.254.169.254), carrier-grade
 * NAT, multicast, and their IPv6 equivalents, including IPv4 hidden inside IPv6
 * (mapped ::ffff:x:y, compatible ::x:y, NAT64 64:ff9b::/96, 6to4 2002::/16).
 * Anything that doesn't parse counts as private. Used on every resolved address,
 * at every redirect hop, so a link can't be used to reach internal systems.
 */
export function isPrivateAddress(ip: string): boolean {
  const v4 = parseV4(ip);
  if (v4) return isPrivateV4(v4[0], v4[1], v4[2]);
  const b = parseV6(ip);
  if (!b) return true;
  const zero = (from: number, to: number) => b.slice(from, to).every((x) => x === 0);
  // ::ffff:0:0/96, IPv4-mapped: judge the IPv4 inside.
  if (zero(0, 10) && b[10] === 0xff && b[11] === 0xff) return isPrivateV4(b[12], b[13], b[14]);
  // ::/96: unspecified, loopback, and deprecated IPv4-compatible addresses. Never public.
  if (zero(0, 12)) return true;
  // 64:ff9b::/96, NAT64: judge the IPv4 inside. 64:ff9b:1::/48 is local-use NAT64.
  if (b[0] === 0x00 && b[1] === 0x64 && b[2] === 0xff && b[3] === 0x9b) {
    return zero(4, 12) ? isPrivateV4(b[12], b[13], b[14]) : true;
  }
  // 2002::/16, 6to4: judge the IPv4 in bytes 2–5.
  if (b[0] === 0x20 && b[1] === 0x02) return isPrivateV4(b[2], b[3], b[4]);
  // 2001::/32 Teredo (hides an IPv4) and 2001:db8::/32 documentation.
  if (b[0] === 0x20 && b[1] === 0x01 && ((b[2] === 0 && b[3] === 0) || (b[2] === 0x0d && b[3] === 0xb8))) return true;
  return (
    (b[0] & 0xfe) === 0xfc || // fc00::/7 unique local
    (b[0] === 0xfe && (b[1] & 0xc0) === 0x80) || // fe80::/10 link-local
    (b[0] === 0xfe && (b[1] & 0xc0) === 0xc0) || // fec0::/10 site-local (deprecated)
    b[0] === 0xff // ff00::/8 multicast
  );
}

/** Only plain https URLs on ordinary hostnames (no credentials, no odd ports). */
export function acceptableUrl(raw: string): URL | null {
  let u: URL;
  try {
    u = new URL(raw);
  } catch {
    return null;
  }
  if (u.protocol !== 'https:' || u.username || u.password) return null;
  if (u.port && u.port !== '443') return null;
  const host = u.hostname.toLowerCase();
  if (host === 'localhost' || host.endsWith('.localhost') || host.endsWith('.local') || host.endsWith('.internal')) return null;
  if (/^[\d.]+$/.test(host) && isPrivateAddress(host)) return null;
  if (host.startsWith('[') && isPrivateAddress(host.slice(1, -1))) return null;
  return u;
}
