const DEFAULT_SITE_ORIGIN = 'https://www.yoursparkpoint.org';

function resolveSiteOrigin() {
  if (import.meta.env.VITE_SITE_ORIGIN) {
    return import.meta.env.VITE_SITE_ORIGIN;
  }

  if (typeof window !== 'undefined' && window.location?.origin) {
    return window.location.origin;
  }

  return DEFAULT_SITE_ORIGIN;
}

const SITE_ORIGIN = resolveSiteOrigin().replace(/\/+$/, '');

export function canonicalUrl(path: string) {
  if (path === '/' || path === '') {
    return `${SITE_ORIGIN}/`;
  }

  return `${SITE_ORIGIN}${path.startsWith('/') ? path : `/${path}`}`;
}
