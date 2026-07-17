import rawPressContent from './pressReleases.json';

export type PressBodyBlock =
  | { type: 'paragraph'; text: string }
  | { type: 'quote'; quoteId: string };

export interface PressQuote {
  id: string;
  text: string;
  attribution: string;
  role?: string;
}

export interface PressMediaAsset {
  id: string;
  src: string;
  title: string;
  caption: string;
  alt: string;
  credit?: string;
  usageNote?: string;
  conceptualRendering?: boolean;
  fileType: string;
  width: number;
  height: number;
}

export interface PressEvent {
  title: string;
  date: string;
  dateLabel: string;
  timeLabel: string;
  venue: string;
  streetAddress: string;
  locality: string;
  region: string;
  postalCode: string;
  url?: string;
}

export interface PressRelease {
  title: string;
  slug: string;
  subtitle?: string;
  summary: string;
  datePublished: string;
  dateModified?: string;
  location?: string;
  category?: string;
  featured?: boolean;
  showOnMediaPage?: boolean;
  releaseStatus: string;
  heroImageId: string;
  socialImageId?: string;
  mediaKitFile?: string;
  mediaContact: {
    name: string;
    title?: string;
    organization: string;
    email?: string;
    phone?: string;
  };
  body: PressBodyBlock[];
  quotes?: PressQuote[];
  event?: PressEvent;
  images: PressMediaAsset[];
  partnershipHistory?: Array<{
    year: string;
    title: string;
    description: string;
    imageId: string;
  }>;
  relatedLinks?: Array<{
    title: string;
    href: string;
    description?: string;
  }>;
  seo?: {
    title?: string;
    description?: string;
    canonical?: string;
  };
}

interface PressContent {
  portal: {
    title: string;
    introduction: string;
    boilerplate: string;
  };
  releases: PressRelease[];
}

const pressAssetModules = import.meta.glob('../assets/press/**/*.{webp,png,jpg,jpeg}', {
  eager: true,
  import: 'default',
  query: '?url',
}) as Record<string, string>;

export const PRESS_CONTENT = rawPressContent as PressContent;

function validatePressContent(content: PressContent) {
  const slugs = new Set<string>();

  content.releases.forEach((release) => {
    const requiredFields = ['title', 'slug', 'datePublished', 'summary', 'heroImageId'] as const;
    requiredFields.forEach((field) => {
      if (!release[field]) {
        throw new Error(`Press release "${release.slug || 'unknown'}" is missing ${field}.`);
      }
    });

    if (slugs.has(release.slug)) {
      throw new Error(`Duplicate press release slug: ${release.slug}`);
    }
    slugs.add(release.slug);

    if (!release.body?.length) {
      throw new Error(`Press release "${release.slug}" requires at least one body block.`);
    }

    if (!release.mediaContact?.name || !release.mediaContact?.organization) {
      throw new Error(`Press release "${release.slug}" requires a configured media contact.`);
    }

    const imageIds = new Set(release.images.map((asset) => asset.id));
    if (!imageIds.has(release.heroImageId)) {
      throw new Error(`Press release "${release.slug}" heroImageId does not match an image.`);
    }

    release.images.forEach((asset) => {
      const moduleKey = `../${asset.src.replace(/^src\//, '')}`;
      if (!pressAssetModules[moduleKey]) {
        throw new Error(`Press asset not found for "${release.slug}": ${asset.src}`);
      }
    });
  });
}

validatePressContent(PRESS_CONTENT);

export const PRESS_RELEASES = [...PRESS_CONTENT.releases].sort(
  (a, b) => Date.parse(b.datePublished) - Date.parse(a.datePublished)
);

export const MEDIA_PAGE_PRESS_RELEASES = PRESS_RELEASES.filter(
  (release) => release.showOnMediaPage
);

export function getPressRelease(slug?: string) {
  return PRESS_RELEASES.find((release) => release.slug === slug);
}

export function getPressAssetUrl(asset: PressMediaAsset) {
  const moduleKey = `../${asset.src.replace(/^src\//, '')}`;
  return pressAssetModules[moduleKey];
}

export function getPressAsset(release: PressRelease, assetId: string) {
  return release.images.find((asset) => asset.id === assetId);
}

export function formatPressDate(date: string) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${date}T00:00:00Z`));
}

export function pressDownloadUrl(release: PressRelease) {
  if (!release.mediaKitFile) return undefined;
  return `${import.meta.env.BASE_URL}downloads/press/${release.mediaKitFile}`;
}

export function pressReleasePlainText(release: PressRelease) {
  const quoteMap = new Map((release.quotes ?? []).map((quote) => [quote.id, quote]));
  const body = release.body
    .map((block) => {
      if (block.type === 'paragraph') return block.text;
      const quote = quoteMap.get(block.quoteId);
      if (!quote) return '';
      return `“${quote.text}”\n— ${quote.attribution}${quote.role ? `, ${quote.role}` : ''}`;
    })
    .filter(Boolean)
    .join('\n\n');

  const event = release.event
    ? `\n\n${release.event.title}\n${release.event.dateLabel}\n${release.event.timeLabel}\n${release.event.venue}\n${release.event.streetAddress}\n${release.event.locality}, ${release.event.region} ${release.event.postalCode}${release.event.url ? `\nEvent page: ${release.event.url}` : ''}`
    : '';

  return `${release.releaseStatus}\n\n${release.title}${release.subtitle ? `\n${release.subtitle}` : ''}\n\n${formatPressDate(release.datePublished)}\n\n${release.location ? `${release.location} — ` : ''}${body}${event}`;
}
