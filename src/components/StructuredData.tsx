import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router';
import { CONTACT_INFO } from '../data/contactInfo';
import { STORIES_DATA } from '../data/stories';
import { canonicalUrl } from '../lib/siteOrigin';

const SITE_NAME = 'SparkPoint';

const ROUTE_LABELS: Record<string, string> = {
  '/': 'Home',
  '/about': 'About',
  '/mission': 'Mission',
  '/impact': 'Impact',
  '/get-involved': 'Get Involved',
  '/programs': 'Programs',
  '/community-connectors': 'Community Connectors',
  '/stories': 'Stories',
  '/events': 'Events',
  '/sponsors': 'Sponsors',
  '/resilience-hub': 'Resilience Hub',
  '/press': 'Newsroom',
  '/intake': 'Contact SparkPoint',
  '/trust': 'Trust & Accountability',
  '/privacy': 'Privacy Policy',
  '/community-champions/helene-one-year': 'When a Community Shows Up',
  '/stories/community-champions/helene-anniversary': 'When a Community Shows Up',
};

const ROUTE_DESCRIPTIONS: Record<string, string> = {
  '/': 'SparkPoint builds connection-driven community resilience in Transylvania County and Western North Carolina.',
  '/about': 'Learn SparkPoint’s history, leadership, and connection-centered approach to community well-being.',
  '/mission': 'SparkPoint’s mission, purpose, and listen-learn-lead framework for community resilience.',
  '/impact': 'SparkPoint impact highlights, outcomes, and momentum across 2025 community initiatives.',
  '/get-involved': 'Volunteer, donate, or partner with SparkPoint to strengthen community resilience.',
  '/programs': 'Programs that turn listening into coordinated action for communities, volunteers, and partners.',
  '/community-connectors': 'Community Connectors helps trusted local leaders connect neighbors to information, resources, care, and preparedness across Transylvania County.',
  '/stories': 'Community stories and lived experiences from across Transylvania County.',
  '/events': 'Upcoming SparkPoint convenings, workshops, and community gatherings across Western North Carolina.',
  '/sponsors': 'Sponsor SparkPoint and support collaborative resilience initiatives across Western North Carolina.',
  '/resilience-hub': 'Preparedness, connection, and coordinated support through the SparkPoint Resilience Hub.',
  '/press': 'The SparkPoint Newsroom — press releases, media assets, newsletters, organizational background, and media contact information in one place.',
  '/intake': 'Contact SparkPoint to volunteer, partner, or connect with the team.',
  '/trust': 'Transparency, accessibility, and accountability commitments for SparkPoint.',
  '/privacy': 'SparkPoint privacy policy and responsible information practices.',
  '/community-champions/helene-one-year': 'A SparkPoint tribute story honoring community volunteers one year after Helene.',
  '/stories/community-champions/helene-anniversary': 'A SparkPoint tribute story honoring community volunteers one year after Helene.',
};

function titleizeSegment(segment: string) {
  return segment
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function getStoryCategoryLabel(categoryId: string) {
  return STORIES_DATA.find((category) => category.id === categoryId)?.title;
}

function getStoryArticleLabel(categoryId: string, slug: string) {
  const category = STORIES_DATA.find((item) => item.id === categoryId);
  return category?.articles.find((article) => article.slug === slug)?.title;
}

function resolvePageLabel(pathname: string) {
  if (ROUTE_LABELS[pathname]) {
    return ROUTE_LABELS[pathname];
  }

  const segments = pathname.split('/').filter(Boolean);
  if (segments[0] === 'stories' && segments[1]) {
    if (segments[2]) {
      return getStoryArticleLabel(segments[1], segments[2]) ?? titleizeSegment(segments[2]);
    }

    return getStoryCategoryLabel(segments[1]) ?? titleizeSegment(segments[1]);
  }

  if (segments.length > 0) {
    return titleizeSegment(segments[segments.length - 1]);
  }

  return 'Home';
}

function resolvePageDescription(pathname: string) {
  if (ROUTE_DESCRIPTIONS[pathname]) {
    return ROUTE_DESCRIPTIONS[pathname];
  }

  if (pathname.startsWith('/stories/')) {
    return 'Community stories from SparkPoint that document resilience, connection, and collaboration in Western North Carolina.';
  }

  if (pathname.startsWith('/press/')) {
    return 'Official SparkPoint press release and publication-ready media resources for Transylvania County coverage.';
  }

  return 'SparkPoint fosters community well-being rooted in connection.';
}

function buildBreadcrumbs(pathname: string) {
  const crumbs = [
    {
      name: 'Home',
      url: canonicalUrl('/'),
    },
  ];

  if (pathname === '/') {
    return crumbs;
  }

  const segments = pathname.split('/').filter(Boolean);

  segments.forEach((segment, index) => {
    const crumbPath = `/${segments.slice(0, index + 1).join('/')}`;
    let label = ROUTE_LABELS[crumbPath];

    if (!label && segments[0] === 'stories' && index === 1) {
      label = getStoryCategoryLabel(segment);
    }

    if (!label && segments[0] === 'stories' && index === 2 && segments[1]) {
      label = getStoryArticleLabel(segments[1], segment);
    }

    crumbs.push({
      name: label ?? titleizeSegment(segment),
      url: canonicalUrl(crumbPath),
    });
  });

  return crumbs;
}

export function StructuredData() {
  const { pathname } = useLocation();
  const safePath = pathname || '/';
  const pageUrl = canonicalUrl(safePath);
  const pageLabel = resolvePageLabel(safePath);
  const pageDescription = resolvePageDescription(safePath);
  const breadcrumbs = buildBreadcrumbs(safePath);

  const organizationId = CONTACT_INFO.organizationSchemaId;
  const websiteId = CONTACT_INFO.websiteSchemaId;
  const breadcrumbId = `${pageUrl}#breadcrumb`;

  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': ['Organization', 'NGO'],
        '@id': organizationId,
        name: CONTACT_INFO.organizationName,
        url: canonicalUrl('/'),
        logo: canonicalUrl('/logo.png'),
        description:
          'SparkPoint fosters community well-being rooted in connection by strengthening collaboration, shared learning, and resilience in Western North Carolina.',
        slogan: 'SparkPoint fosters community well-being rooted in connection.',
        email: CONTACT_INFO.email,
        foundingDate: '2020',
        nonprofitStatus: 'Nonprofit501c3',
        address: {
          '@type': 'PostalAddress',
          ...CONTACT_INFO.postalAddress,
        },
        areaServed: [
          {
            '@type': 'AdministrativeArea',
            name: 'Transylvania County, North Carolina',
          },
          {
            '@type': 'AdministrativeArea',
            name: 'Western North Carolina',
          },
        ],
        sameAs: [
          'https://www.facebook.com/yoursparkpoint',
          'https://www.instagram.com/yoursparkpoint',
          'https://www.youtube.com/@sparkpoint2023',
          'https://www.tiktok.com/@sparkysparkpoint',
        ],
        knowsAbout: [
          'Community connection',
          'Community resilience',
          'Cross-sector collaboration',
          'Community storytelling',
          'Volunteer engagement',
        ],
      },
      {
        '@type': 'WebSite',
        '@id': websiteId,
        url: canonicalUrl('/'),
        name: SITE_NAME,
        description: 'SparkPoint community resilience and connection hub for Western North Carolina.',
        inLanguage: 'en-US',
        publisher: {
          '@id': organizationId,
        },
      },
      {
        '@type': 'WebPage',
        '@id': `${pageUrl}#webpage`,
        url: pageUrl,
        name: pageLabel,
        description: pageDescription,
        isPartOf: {
          '@id': websiteId,
        },
        about: {
          '@id': organizationId,
        },
        breadcrumb: {
          '@id': breadcrumbId,
        },
        inLanguage: 'en-US',
      },
      {
        '@type': 'BreadcrumbList',
        '@id': breadcrumbId,
        itemListElement: breadcrumbs.map((crumb, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: crumb.name,
          item: crumb.url,
        })),
      },
    ],
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
}
