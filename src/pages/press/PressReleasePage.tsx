import { useEffect } from 'react';
import { ArrowLeft, Calendar, Download, ExternalLink, Mail, MapPin, Printer } from 'lucide-react';
import { Link, useParams } from 'react-router';
import { CopyButton } from '../../components/press/CopyButton';
import { MediaAssetCard } from '../../components/press/MediaAssetCard';
import { Button } from '../../components/ui/button';
import { SEOHead } from '../../components/SEOHead';
import { CONTACT_INFO } from '../../data/contactInfo';
import {
  PRESS_CONTENT,
  formatPressDate,
  getPressAsset,
  getPressAssetUrl,
  getPressRelease,
  pressDownloadUrl,
  pressReleasePlainText,
} from '../../data/pressReleases';
import { canonicalUrl } from '../../lib/siteOrigin';
import './press.css';

export function PressReleasePage() {
  const { slug } = useParams();
  const release = getPressRelease(slug);

  useEffect(() => {
    if (!release) return;
    document.body.classList.add('press-release-view');
    return () => document.body.classList.remove('press-release-view');
  }, [release]);

  if (!release) {
    return (
      <div className="min-h-[70vh] bg-[#FCFCFD] px-6 pb-24 pt-36 text-center">
        <SEOHead
          title="Press Release Not Found | SparkPoint"
          description="The requested SparkPoint press release could not be found. Browse the official SparkPoint press archive for current releases and media resources."
          path={`/press/${slug ?? ''}`}
          noindex
        />
        <h1 className="text-4xl font-bold text-[#1A1A1A]">Press release not found</h1>
        <p className="mt-5 text-gray-600">The release may have moved or is no longer available.</p>
        <Button asChild className="mt-8 bg-[#E03694] text-white hover:bg-[#C82C82]">
          <Link to="/press"><ArrowLeft aria-hidden="true" /> Back to Press & Media</Link>
        </Button>
      </div>
    );
  }

  const hero = getPressAsset(release, release.heroImageId);
  const social = getPressAsset(release, release.socialImageId ?? release.heroImageId) ?? hero;
  const releasePath = `/press/${release.slug}`;
  const releaseUrl = canonicalUrl(releasePath);
  const images = release.images.map((asset) => canonicalUrl(getPressAssetUrl(asset)));
  const quoteMap = new Map((release.quotes ?? []).map((quote) => [quote.id, quote]));
  const mediaKitUrl = pressDownloadUrl(release);
  const plainText = pressReleasePlainText(release);
  const eventText = release.event
    ? `${release.event.title}\n${release.event.dateLabel}\n${release.event.timeLabel}\n${release.event.venue}\n${release.event.streetAddress}\n${release.event.locality}, ${release.event.region} ${release.event.postalCode}${release.event.url ? `\nEvent page: ${release.event.url}` : ''}`
    : '';

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: release.title,
    description: release.summary,
    datePublished: release.datePublished,
    ...(release.dateModified ? { dateModified: release.dateModified } : {}),
    image: images,
    author: { '@id': CONTACT_INFO.organizationSchemaId },
    publisher: { '@id': CONTACT_INFO.organizationSchemaId },
    mainEntityOfPage: releaseUrl,
    articleSection: release.category,
    inLanguage: 'en-US',
  };

  const eventSchema = release.event
    ? {
        '@context': 'https://schema.org',
        '@type': 'Event',
        name: release.event.title,
        startDate: `${release.event.date}T17:00:00-04:00`,
        endDate: `${release.event.date}T19:00:00-04:00`,
        eventStatus: 'https://schema.org/EventScheduled',
        eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
        location: {
          '@type': 'Place',
          name: release.event.venue,
          address: {
            '@type': 'PostalAddress',
            streetAddress: release.event.streetAddress,
            addressLocality: release.event.locality,
            addressRegion: release.event.region,
            postalCode: release.event.postalCode,
            addressCountry: 'US',
          },
        },
        organizer: { '@id': CONTACT_INFO.organizationSchemaId },
        ...(release.event.url ? { url: release.event.url } : {}),
        description: release.subtitle ?? release.summary,
        image: social ? [canonicalUrl(getPressAssetUrl(social))] : undefined,
      }
    : undefined;

  return (
    <div className="press-release-page min-h-screen bg-[#FCFCFD]">
      <SEOHead
        title={release.seo?.title ?? `${release.title} | SparkPoint Press`}
        description={release.seo?.description ?? release.summary}
        path={releasePath}
        canonicalUrlOverride={release.seo?.canonical}
        type="article"
        image={social ? getPressAssetUrl(social) : undefined}
        imageAlt={social?.alt}
        imageType="image/webp"
        imageWidth={social?.width}
        imageHeight={social?.height}
        publishedTime={release.datePublished}
        modifiedTime={release.dateModified}
        jsonLd={eventSchema ? [articleSchema, eventSchema] : articleSchema}
      />

      <article>
        <header className="px-6 pb-14 pt-32 md:pb-20 md:pt-40">
          <div className="mx-auto max-w-6xl">
            <nav aria-label="Breadcrumb" className="press-no-print mb-10">
              <Link
                to="/press"
                className="inline-flex items-center gap-2 rounded-sm font-semibold text-gray-500 outline-none transition-colors hover:text-[#E03694] focus-visible:ring-2 focus-visible:ring-[#E03694] focus-visible:ring-offset-4"
              >
                <ArrowLeft size={18} aria-hidden="true" /> Press & Media
              </Link>
            </nav>

            <div className="grid items-center gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:gap-16">
              <div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm font-bold uppercase tracking-[0.14em] text-[#E03694]">
                  <span>{release.releaseStatus}</span>
                  {release.category ? <span className="text-[#9E509F]">{release.category}</span> : null}
                </div>
                <h1 className="mt-6 text-4xl font-bold leading-[1.08] tracking-tight text-[#1A1A1A] md:text-5xl lg:text-6xl">
                  {release.title}
                </h1>
                {release.subtitle ? (
                  <p className="mt-6 max-w-3xl text-xl leading-8 text-gray-600 md:text-2xl md:leading-9">
                    {release.subtitle}
                  </p>
                ) : null}
                <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm font-semibold text-gray-500">
                  <span className="inline-flex items-center gap-2">
                    <Calendar size={17} aria-hidden="true" />
                    <time dateTime={release.datePublished}>{formatPressDate(release.datePublished)}</time>
                  </span>
                  {release.location ? (
                    <span className="inline-flex items-center gap-2">
                      <MapPin size={17} aria-hidden="true" /> {release.location}
                    </span>
                  ) : null}
                </div>
              </div>

              {hero ? (
                <figure className="rounded-3xl bg-[#F7F4EF] p-6 shadow-sm md:p-8">
                  <img
                    src={getPressAssetUrl(hero)}
                    alt={hero.alt}
                    width={hero.width}
                    height={hero.height}
                    className="mx-auto max-h-[36rem] w-full object-contain"
                  />
                  <figcaption className="mt-4 text-sm leading-6 text-gray-500">{hero.caption}</figcaption>
                </figure>
              ) : null}
            </div>
          </div>
        </header>

        <div className="press-no-print sticky top-20 z-30 border-y border-gray-100 bg-white/95 px-6 py-4 backdrop-blur">
          <div className="mx-auto flex max-w-6xl flex-wrap gap-3">
            <CopyButton text={plainText} label="Copy press release" className="rounded-full" />
            <Button type="button" variant="outline" className="rounded-full" onClick={() => window.print()}>
              <Printer aria-hidden="true" /> Print release
            </Button>
            {mediaKitUrl ? (
              <Button asChild className="rounded-full bg-[#E03694] text-white hover:bg-[#C82C82]">
                <a href={mediaKitUrl} download={release.mediaKitFile}>
                  <Download aria-hidden="true" /> Download media kit
                </a>
              </Button>
            ) : null}
          </div>
        </div>

        <section className="px-6 py-16 md:py-20" aria-labelledby="release-body-heading">
          <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[minmax(0,1fr)_19rem] lg:gap-16">
            <div className="max-w-3xl">
              <h2 id="release-body-heading" className="sr-only">Press release</h2>
              <div className="space-y-7 text-lg leading-8 text-gray-700">
                {release.body.map((block, index) => {
                  if (block.type === 'paragraph') {
                    return (
                      <p key={`paragraph-${index}`}>
                        {index === 0 && release.location ? (
                          <strong className="text-[#1A1A1A]">{release.location} — </strong>
                        ) : null}
                        {block.text}
                      </p>
                    );
                  }

                  const quote = quoteMap.get(block.quoteId);
                  if (!quote) return null;

                  return (
                    <blockquote key={quote.id} className="my-10 rounded-r-3xl border-l-4 border-[#E03694] bg-white px-7 py-8 shadow-sm md:px-10">
                      <p className="text-xl font-medium leading-9 text-[#1A1A1A] md:text-2xl md:leading-10">
                        “{quote.text}”
                      </p>
                      <footer className="mt-6 text-base leading-6 text-gray-600">
                        <strong className="text-[#1A1A1A]">{quote.attribution}</strong>
                        {quote.role ? <><br />{quote.role}</> : null}
                      </footer>
                      <div className="press-no-print mt-6">
                        <CopyButton
                          text={`“${quote.text}”\n— ${quote.attribution}${quote.role ? `, ${quote.role}` : ''}`}
                          label="Copy approved quote"
                          className="rounded-full"
                        />
                      </div>
                    </blockquote>
                  );
                })}
              </div>

              {release.event ? (
                <section className="mt-14 overflow-hidden rounded-3xl bg-[#1A1A1A] text-white" aria-labelledby="event-details-heading">
                  <div className="h-2 bg-gradient-to-r from-[#E03694] via-[#FDB515] to-[#F15F48]" />
                  <div className="p-8 md:p-10">
                    <h2 id="event-details-heading" className="text-3xl font-bold">{release.event.title}</h2>
                    <div className="mt-7 grid gap-6 text-lg leading-8 sm:grid-cols-2">
                      <div>
                        <p className="font-bold text-[#FDB515]">Date & time</p>
                        <p className="mt-2">{release.event.dateLabel}<br />{release.event.timeLabel}</p>
                      </div>
                      <div>
                        <p className="font-bold text-[#FDB515]">Location</p>
                        <address className="mt-2 not-italic">
                          {release.event.venue}<br />
                          {release.event.streetAddress}<br />
                          {release.event.locality}, {release.event.region} {release.event.postalCode}
                        </address>
                      </div>
                    </div>
                    <div className="press-no-print mt-7 flex flex-wrap gap-3">
                      <CopyButton
                        text={eventText}
                        label="Copy event details"
                        variant="ghost"
                        className="rounded-full border border-white/30 text-white hover:bg-white/10 hover:text-white"
                      />
                      {release.event.url ? (
                        <Button asChild variant="ghost" className="rounded-full border border-white/30 text-white hover:bg-white/10 hover:text-white">
                          <a href={release.event.url} target="_blank" rel="noreferrer">
                            View Facebook event <ExternalLink aria-hidden="true" />
                          </a>
                        </Button>
                      ) : null}
                    </div>
                  </div>
                </section>
              ) : null}
            </div>

            <aside className="space-y-6 lg:sticky lg:top-44 lg:self-start" aria-label="Release contact and downloads">
              <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                <Mail className="text-[#E03694]" aria-hidden="true" />
                <h2 className="mt-4 text-xl font-bold text-[#1A1A1A]">Media contact</h2>
                <div className="mt-4 leading-7 text-gray-600">
                  <p className="font-bold text-[#1A1A1A]">{release.mediaContact.name}</p>
                  {release.mediaContact.title ? <p>{release.mediaContact.title}</p> : null}
                  <p>{release.mediaContact.organization}</p>
                  {release.mediaContact.email ? (
                    <a className="mt-3 inline-block font-semibold text-[#E03694] hover:underline" href={`mailto:${release.mediaContact.email}`}>
                      {release.mediaContact.email}
                    </a>
                  ) : null}
                </div>
              </div>
              {mediaKitUrl ? (
                <div className="press-no-print rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                  <h2 className="text-xl font-bold text-[#1A1A1A]">Media package</h2>
                  <p className="mt-3 text-sm leading-6 text-gray-600">
                    Includes release copy, original images, captions, usage notes, background, and contact details.
                  </p>
                  <Button asChild className="mt-5 w-full bg-[#E03694] text-white hover:bg-[#C82C82]">
                    <a href={mediaKitUrl} download={release.mediaKitFile}>
                      <Download aria-hidden="true" /> Download ZIP
                    </a>
                  </Button>
                </div>
              ) : null}
            </aside>
          </div>
        </section>

        {release.partnershipHistory?.length ? (
          <section className="border-y border-gray-100 bg-white px-6 py-20" aria-labelledby="partnership-history-heading">
            <div className="mx-auto max-w-6xl">
              <div className="max-w-3xl">
                <h2 id="partnership-history-heading" className="text-3xl font-bold text-[#1A1A1A] md:text-4xl">
                  Three collaborations, one growing commitment
                </h2>
                <p className="mt-4 text-lg leading-8 text-gray-600">
                  The annual coffee collaboration has evolved from celebrating local leadership to investing in a shared place for connection and resilience.
                </p>
              </div>
              <ol className="mt-12 grid gap-8 md:grid-cols-3">
                {release.partnershipHistory.map((item) => {
                  const image = getPressAsset(release, item.imageId);
                  return (
                    <li key={item.year} className="relative border-t-4 border-[#E03694] pt-6">
                      {image ? (
                        <div className="mb-6 flex aspect-[4/3] items-center justify-center rounded-2xl bg-[#F7F4EF] p-5">
                          <img
                            src={getPressAssetUrl(image)}
                            alt={image.alt}
                            width={image.width}
                            height={image.height}
                            loading="lazy"
                            className="h-full w-full object-contain"
                          />
                        </div>
                      ) : null}
                      <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#9E509F]">{item.year}</p>
                      <h3 className="mt-2 text-2xl font-bold text-[#1A1A1A]">{item.title}</h3>
                      <p className="mt-2 leading-7 text-gray-600">{item.description}</p>
                    </li>
                  );
                })}
              </ol>
            </div>
          </section>
        ) : null}

        {release.images.length ? (
          <section className="px-6 py-20" aria-labelledby="media-assets-heading">
            <div className="mx-auto max-w-6xl">
              <h2 id="media-assets-heading" className="text-3xl font-bold text-[#1A1A1A] md:text-4xl">Publication-ready media</h2>
              <p className="mt-4 max-w-3xl text-lg leading-8 text-gray-600">
                Download the original supplied files. Captions and usage notes are included with each asset and in the media kit.
              </p>
              <div className="mt-10 grid gap-8 md:grid-cols-2">
                {release.images.map((asset) => <MediaAssetCard key={asset.id} asset={asset} />)}
              </div>
            </div>
          </section>
        ) : null}

        <section className="border-t border-gray-100 bg-white px-6 py-20" aria-labelledby="about-sparkpoint-heading">
          <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1fr_0.65fr]">
            <div>
              <h2 id="about-sparkpoint-heading" className="text-3xl font-bold text-[#1A1A1A]">About SparkPoint</h2>
              <p className="mt-5 max-w-3xl text-lg leading-8 text-gray-600">{PRESS_CONTENT.portal.boilerplate}</p>
            </div>
            {release.relatedLinks?.length ? (
              <aside>
                <h2 className="text-xl font-bold text-[#1A1A1A]">Related information</h2>
                <div className="mt-5 space-y-4">
                  {release.relatedLinks.map((link) => (
                    <Link
                      key={link.href}
                      to={link.href}
                      className="block rounded-2xl border border-gray-100 p-5 outline-none transition-colors hover:border-[#E03694]/40 focus-visible:ring-2 focus-visible:ring-[#E03694]"
                    >
                      <span className="font-bold text-[#E03694]">{link.title}</span>
                      {link.description ? <span className="mt-2 block text-sm leading-6 text-gray-500">{link.description}</span> : null}
                    </Link>
                  ))}
                </div>
              </aside>
            ) : null}
          </div>
        </section>
      </article>
    </div>
  );
}
