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

/**
 * True for addresses a public link must never point at: loopback, private
 * ranges, link-local (cloud metadata lives at 169.254.169.254), carrier-grade
 * NAT, multicast, and their IPv6 equivalents. Used on every resolved address,
 * at every redirect hop, so a link can't be used to reach internal systems.
 */
export function isPrivateAddress(ip: string): boolean {
  const v4 = ip.replace(/^::ffff:/i, '');
  const m = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/.exec(v4);
  if (m) {
    const [a, b] = [Number(m[1]), Number(m[2])];
    return (
      a === 0 ||
      a === 10 ||
      a === 127 ||
      (a === 100 && b >= 64 && b <= 127) ||
      (a === 169 && b === 254) ||
      (a === 172 && b >= 16 && b <= 31) ||
      (a === 192 && b === 168) ||
      (a === 198 && (b === 18 || b === 19)) ||
      a >= 224
    );
  }
  const v6 = ip.toLowerCase();
  return (
    v6 === '::' ||
    v6 === '::1' ||
    v6.startsWith('fc') ||
    v6.startsWith('fd') ||
    v6.startsWith('fe8') ||
    v6.startsWith('fe9') ||
    v6.startsWith('fea') ||
    v6.startsWith('feb') ||
    v6.startsWith('ff')
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
