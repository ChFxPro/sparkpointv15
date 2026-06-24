import { Helmet } from 'react-helmet-async';
import { useEffect } from 'react';
import { canonicalUrl } from '../lib/siteOrigin';

const SITE_NAME = 'SparkPoint';
const DEFAULT_OG_IMAGE_PATH = '/og/default.jpg';
const DEFAULT_OG_IMAGE_ALT = 'SparkPoint community members collaborating in Western North Carolina.';

type PageType = 'website' | 'article';

type JsonLdPayload = Record<string, unknown>;

interface SEOHeadProps {
  title: string;
  description: string;
  path: string;
  canonicalPath?: string;
  type?: PageType;
  image?: string;
  imageAlt?: string;
  noindex?: boolean;
  keywords?: string[];
  publishedTime?: string;
  modifiedTime?: string;
  jsonLd?: JsonLdPayload | JsonLdPayload[];
}

function toAbsoluteUrl(urlOrPath: string) {
  if (/^https?:\/\//i.test(urlOrPath)) {
    return urlOrPath;
  }

  return canonicalUrl(urlOrPath);
}

function normalizeDescription(description: string) {
  const cleaned = description.replace(/\s+/g, ' ').trim();
  const maxLength = 160;
  const minLength = 150;

  if (cleaned.length > maxLength) {
    const trimmed = cleaned.slice(0, 157);
    const safeBoundary = trimmed.lastIndexOf(' ');
    return `${(safeBoundary > 120 ? trimmed.slice(0, safeBoundary) : trimmed).trim()}...`;
  }

  if (cleaned.length >= minLength) {
    return cleaned;
  }

  const fallbackTail = 'SparkPoint serves Transylvania County and Western North Carolina.';
  const available = maxLength - cleaned.length;
  if (available <= 2) {
    return cleaned;
  }

  let extra = '';
  for (const word of fallbackTail.split(' ')) {
    const candidate = extra.length > 0 ? `${extra} ${word}` : word;
    if (` ${candidate}`.length > available) {
      break;
    }
    extra = candidate;
  }

  return extra ? `${cleaned} ${extra}` : cleaned;
}

export function SEOHead({
  title,
  description,
  path,
  canonicalPath,
  type = 'website',
  image = DEFAULT_OG_IMAGE_PATH,
  imageAlt = DEFAULT_OG_IMAGE_ALT,
  noindex = false,
  keywords,
  publishedTime,
  modifiedTime,
  jsonLd,
}: SEOHeadProps) {
  const canonical = canonicalUrl(canonicalPath ?? path);
  const normalizedDescription = normalizeDescription(description);
  const absoluteImage = toAbsoluteUrl(image);
  const robots = noindex ? 'noindex, nofollow' : 'index, follow';
  const ldJsonItems = Array.isArray(jsonLd) ? jsonLd : jsonLd ? [jsonLd] : [];

  useEffect(() => {
    document.title = title;

    const setMeta = (selector: string, attribute: 'content' | 'href', value: string) => {
      let element = document.head.querySelector(selector) as HTMLMetaElement | HTMLLinkElement | null;

      if (!element) {
        if (selector.startsWith('link')) {
          element = document.createElement('link');
          element.setAttribute('rel', 'canonical');
        } else {
          element = document.createElement('meta');
          const nameMatch = selector.match(/name="([^"]+)"/);
          const propertyMatch = selector.match(/property="([^"]+)"/);
          if (nameMatch) element.setAttribute('name', nameMatch[1]);
          if (propertyMatch) element.setAttribute('property', propertyMatch[1]);
        }

        document.head.appendChild(element);
      }

      element.setAttribute(attribute, value);
    };

    setMeta('meta[name="description"]', 'content', normalizedDescription);
    setMeta('meta[name="robots"]', 'content', robots);
    setMeta('link[rel="canonical"]', 'href', canonical);
    setMeta('meta[property="og:type"]', 'content', type);
    setMeta('meta[property="og:title"]', 'content', title);
    setMeta('meta[property="og:description"]', 'content', normalizedDescription);
    setMeta('meta[property="og:url"]', 'content', canonical);
    setMeta('meta[property="og:image"]', 'content', absoluteImage);
    setMeta('meta[property="og:image:alt"]', 'content', imageAlt);
    setMeta('meta[name="twitter:title"]', 'content', title);
    setMeta('meta[name="twitter:description"]', 'content', normalizedDescription);
    setMeta('meta[name="twitter:image"]', 'content', absoluteImage);
    setMeta('meta[name="twitter:image:alt"]', 'content', imageAlt);
  }, [absoluteImage, canonical, imageAlt, normalizedDescription, robots, title, type]);

  return (
    <Helmet prioritizeSeoTags>
      <title>{title}</title>
      <meta name="description" content={normalizedDescription} />
      <meta name="robots" content={robots} />
      <meta name="author" content={SITE_NAME} />
      {keywords && keywords.length > 0 ? (
        <meta name="keywords" content={keywords.join(', ')} />
      ) : null}
      <link rel="canonical" href={canonical} />

      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="en_US" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={normalizedDescription} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={absoluteImage} />
      <meta property="og:image:alt" content={imageAlt} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={normalizedDescription} />
      <meta name="twitter:image" content={absoluteImage} />
      <meta name="twitter:image:alt" content={imageAlt} />

      {type === 'article' && publishedTime ? (
        <meta property="article:published_time" content={publishedTime} />
      ) : null}
      {type === 'article' && modifiedTime ? (
        <meta property="article:modified_time" content={modifiedTime} />
      ) : null}

      {ldJsonItems.map((entry, index) => (
        <script key={`seo-json-ld-${index}`} type="application/ld+json">
          {JSON.stringify(entry)}
        </script>
      ))}
    </Helmet>
  );
}
