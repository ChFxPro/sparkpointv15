import { Download, FileText, Image, Mail } from 'lucide-react';
import { Link } from 'react-router';
import { MediaAssetCard } from '../../components/press/MediaAssetCard';
import { PressReleaseCard } from '../../components/press/PressReleaseCard';
import { Button } from '../../components/ui/button';
import { SEOHead } from '../../components/SEOHead';
import {
  PRESS_CONTENT,
  PRESS_RELEASES,
  getPressAsset,
  pressDownloadUrl,
} from '../../data/pressReleases';

export function PressPortalPage() {
  const featuredRelease = PRESS_RELEASES.find((release) => release.featured) ?? PRESS_RELEASES[0];
  const archiveReleases = PRESS_RELEASES.filter((release) => release.slug !== featuredRelease?.slug);
  const mediaContact = featuredRelease?.mediaContact;
  const featuredPromo = featuredRelease?.socialImageId
    ? getPressAsset(featuredRelease, featuredRelease.socialImageId)
    : undefined;
  const mediaKitUrl = featuredRelease ? pressDownloadUrl(featuredRelease) : undefined;

  return (
    <div className="min-h-screen bg-[#FCFCFD]">
      <SEOHead
        title="Press & Media | SparkPoint"
        description="Official SparkPoint press releases, publication-ready media assets, organizational background, and media contact information for Transylvania County coverage."
        path="/press"
      />

      <section className="px-6 pb-16 pt-32 md:pb-20 md:pt-40">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-[#1A1A1A] md:text-6xl">
            {PRESS_CONTENT.portal.title}
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-gray-600 md:text-xl">
            {PRESS_CONTENT.portal.introduction}
          </p>
        </div>
      </section>

      {featuredRelease ? (
        <section className="px-6 pb-20" aria-labelledby="featured-release-heading">
          <div className="mx-auto max-w-6xl">
            <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="mb-2 text-sm font-bold uppercase tracking-[0.16em] text-[#E03694]">
                  Featured release
                </p>
                <h2 id="featured-release-heading" className="text-3xl font-bold text-[#1A1A1A]">
                  Latest from SparkPoint
                </h2>
              </div>
              {mediaKitUrl ? (
                <Button asChild variant="outline" className="rounded-full px-6">
                  <a href={mediaKitUrl} download={featuredRelease.mediaKitFile}>
                    <Download aria-hidden="true" /> Download media kit
                  </a>
                </Button>
              ) : null}
            </div>
            <PressReleaseCard release={featuredRelease} featured />
          </div>
        </section>
      ) : null}

      <section className="border-y border-gray-100 bg-white px-6 py-20" aria-labelledby="press-archive-heading">
        <div className="mx-auto max-w-6xl">
          <h2 id="press-archive-heading" className="text-3xl font-bold text-[#1A1A1A] md:text-4xl">
            Press release archive
          </h2>
          <p className="mt-3 max-w-2xl leading-7 text-gray-600">
            Official releases are listed by publication date. New entries are added here automatically.
          </p>
          {archiveReleases.length > 0 ? (
            <div className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {archiveReleases.map((release) => (
                <PressReleaseCard key={release.slug} release={release} />
              ))}
            </div>
          ) : (
            <p className="mt-10 rounded-2xl border border-dashed border-gray-200 bg-[#FCFCFD] p-8 text-gray-600">
              Additional SparkPoint releases will appear here as they are published.
            </p>
          )}
        </div>
      </section>

      <section className="px-6 py-20" aria-labelledby="media-resources-heading">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr]">
            <div>
              <h2 id="media-resources-heading" className="text-3xl font-bold text-[#1A1A1A] md:text-4xl">
                Media resources
              </h2>
              <p className="mt-4 max-w-2xl leading-7 text-gray-600">
                Download approved materials or use the links below for organizational context. Only currently available resources are listed.
              </p>
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <a
                  href={`${import.meta.env.BASE_URL}logo.png`}
                  download="SparkPoint-logo.png"
                  className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm outline-none transition-colors hover:border-[#E03694]/40 focus-visible:ring-2 focus-visible:ring-[#E03694]"
                >
                  <Image className="text-[#E03694]" aria-hidden="true" />
                  <h3 className="mt-4 font-bold text-[#1A1A1A]">SparkPoint logo</h3>
                  <p className="mt-2 text-sm leading-6 text-gray-500">PNG brand mark for approved editorial use.</p>
                </a>
                <a
                  href={`${import.meta.env.BASE_URL}logo-wordmark.webp`}
                  download="SparkPoint-wordmark.webp"
                  className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm outline-none transition-colors hover:border-[#E03694]/40 focus-visible:ring-2 focus-visible:ring-[#E03694]"
                >
                  <FileText className="text-[#9E509F]" aria-hidden="true" />
                  <h3 className="mt-4 font-bold text-[#1A1A1A]">SparkPoint wordmark</h3>
                  <p className="mt-2 text-sm leading-6 text-gray-500">WebP horizontal wordmark for approved editorial use.</p>
                </a>
                <Link
                  to="/about"
                  className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm outline-none transition-colors hover:border-[#E03694]/40 focus-visible:ring-2 focus-visible:ring-[#E03694]"
                >
                  <FileText className="text-[#FDB515]" aria-hidden="true" />
                  <h3 className="mt-4 font-bold text-[#1A1A1A]">Organization background</h3>
                  <p className="mt-2 text-sm leading-6 text-gray-500">Mission, history, leadership, and current work.</p>
                </Link>
                {mediaKitUrl && featuredRelease ? (
                  <a
                    href={mediaKitUrl}
                    download={featuredRelease.mediaKitFile}
                    className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm outline-none transition-colors hover:border-[#E03694]/40 focus-visible:ring-2 focus-visible:ring-[#E03694]"
                  >
                    <Download className="text-[#F15F48]" aria-hidden="true" />
                    <h3 className="mt-4 font-bold text-[#1A1A1A]">Latest release media kit</h3>
                    <p className="mt-2 text-sm leading-6 text-gray-500">Release copy, images, captions, background, and contact details.</p>
                  </a>
                ) : null}
              </div>
            </div>

            <div className="space-y-6">
              <aside className="rounded-3xl bg-[#1A1A1A] p-8 text-white md:p-10" aria-labelledby="press-contact-heading">
                <Mail className="text-[#FDB515]" aria-hidden="true" />
                <h2 id="press-contact-heading" className="mt-5 text-2xl font-bold">Media contact</h2>
                {mediaContact ? (
                  <div className="mt-5 leading-7 text-white/80">
                    <p className="font-bold text-white">{mediaContact.name}</p>
                    {mediaContact.title ? <p>{mediaContact.title}</p> : null}
                    <p>{mediaContact.organization}</p>
                    {mediaContact.email ? (
                      <a className="mt-4 inline-block font-semibold text-[#FDB515] hover:underline" href={`mailto:${mediaContact.email}`}>
                        {mediaContact.email}
                      </a>
                    ) : null}
                  </div>
                ) : null}
              </aside>

              <aside className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm md:p-10" aria-labelledby="boilerplate-heading">
                <h2 id="boilerplate-heading" className="text-2xl font-bold text-[#1A1A1A]">About SparkPoint</h2>
                <p className="mt-5 leading-7 text-gray-600">{PRESS_CONTENT.portal.boilerplate}</p>
              </aside>
            </div>
          </div>

          {featuredPromo ? (
            <div className="mt-16">
              <h2 className="mb-7 text-3xl font-bold text-[#1A1A1A]">Latest release asset</h2>
              <div className="max-w-3xl">
                <MediaAssetCard asset={featuredPromo} />
              </div>
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}
