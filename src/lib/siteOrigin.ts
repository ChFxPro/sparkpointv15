const DEFAULT_SITE_ORIGIN = 'https://chfxpro.github.io/sparkpointv15';
const SITE_ORIGIN = (import.meta.env.VITE_SITE_ORIGIN ?? DEFAULT_SITE_ORIGIN).replace(/\/+$/, '');

export function canonicalUrl(path: string) {
  if (path === '/' || path === '') {
    return `${SITE_ORIGIN}/`;
  }

  return `${SITE_ORIGIN}${path.startsWith('/') ? path : `/${path}`}`;
}
