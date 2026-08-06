import type { ReactNode } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { ArrowRight, Download, FileText, Image, Mail } from 'lucide-react';
import { Link } from 'react-router';
import { MediaAssetCard } from '../../components/press/MediaAssetCard';
import { PressReleaseCard } from '../../components/press/PressReleaseCard';
import { Button } from '../../components/ui/button';
import { SEOHead } from '../../components/SEOHead';
import { useAccessibility } from '../../context/AccessibilityContext';
import stickyBackground from '../../assets/bckgrounds/brandkit_bkgrnd2.webp';
import {
  PRESS_CONTENT,
  PRESS_RELEASES,
  getPressAsset,
  pressDownloadUrl,
} from '../../data/pressReleases';

const GRADIENT = 'linear-gradient(90deg, #FDB515, #F15F48, #E03694, #9E509F)';

function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="mb-2 text-sm font-bold uppercase tracking-[0.16em] text-[#E03694]">{children}</p>
  );
}

export function PressPortalPage() {
  const featuredRelease = PRESS_RELEASES.find((release) => release.featured) ?? PRESS_RELEASES[0];
  const archiveReleases = PRESS_RELEASES.filter((release) => release.slug !== featuredRelease?.slug);
  const mediaContact = featuredRelease?.mediaContact;
  const featuredPromo = featuredRelease?.socialImageId
    ? getPressAsset(featuredRelease, featuredRelease.socialImageId)
    : undefined;
  const mediaKitUrl = featuredRelease ? pressDownloadUrl(featuredRelease) : undefined;
  const base = import.meta.env.BASE_URL;

  const systemReducedMotion = useReducedMotion();
  const { motionPreference } = useAccessibility();
  const prefersReducedMotion = systemReducedMotion || motionPreference === 'reduce';
  const { scrollY } = useScroll();
  const backgroundY = useTransform(scrollY, [0, 1000], [0, prefersReducedMotion ? 0 : 200]);

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <SEOHead
        title="Newsroom | SparkPoint"
        description="The SparkPoint Newsroom — press releases, publication-ready media assets, newsletters, organizational background, and media contact information for Transylvania County coverage."
        path="/press"
      />

      {/* ──── FIXED STICKY BACKGROUND (same pattern as Mission / Sponsors / Resilience Hub) ──── */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        <motion.div style={{ y: backgroundY }} className="absolute inset-0 w-full">
          <img
            src={stickyBackground}
            alt=""
            className="h-full w-full object-cover object-center"
            style={{ minHeight: '120%' }}
          />
          {/* Dark gradient overlay for text legibility — matches Mission / Sponsors */}
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(to bottom, rgba(0,0,0,0.40) 0%, rgba(0,0,0,0.22) 40%, rgba(0,0,0,0.58) 100%)',
            }}
          />
        </motion.div>
      </div>

      {/* Hero — transparent window, dark glass card (matches Mission / Sponsors hero) */}
      <section className="relative z-10 px-6 pb-16 pt-32 md:pb-20 md:pt-40">
        <div className="mx-auto max-w-3xl">
          <div
            className="rounded-[2rem] p-8 text-center md:p-14"
            style={{
              border: '1px solid rgba(255,255,255,0.10)',
              background: 'linear-gradient(180deg, rgba(0,0,0,0.52) 0%, rgba(0,0,0,0.42) 55%, rgba(0,0,0,0.58) 100%)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              boxShadow: '0 18px 50px rgba(0,0,0,0.40)',
            }}
          >
            <h1
              className="text-4xl font-bold tracking-tight text-white md:text-6xl"
              style={{ textShadow: '0 8px 28px rgba(0,0,0,0.55)' }}
            >
              {PRESS_CONTENT.portal.title}
            </h1>
            <p
              className="mx-auto mt-6 max-w-3xl text-lg leading-8 md:text-xl"
              style={{ color: 'rgba(255,255,255,0.86)', textShadow: '0 4px 16px rgba(0,0,0,0.50)' }}
            >
              {PRESS_CONTENT.portal.introduction}
            </p>
          </div>
        </div>
      </section>

      {/* Quick nav — jump straight to a release, the archive, or the branding assets */}
      <div className="sticky top-20 z-30 border-y border-gray-100 bg-white px-6 py-3 shadow-sm">
        <nav aria-label="Newsroom sections" className="mx-auto flex max-w-6xl items-center gap-2 overflow-x-auto">
          {featuredRelease ? (
            <a
              href="#featured-release"
              className="shrink-0 whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-100 hover:text-[#1A1A1A]"
            >
              Featured release
            </a>
          ) : null}
          <a
            href="#press-archive"
            className="shrink-0 whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-100 hover:text-[#1A1A1A]"
          >
            Past releases
          </a>
          <a
            href="#media-kit"
            className="shrink-0 whitespace-nowrap rounded-full px-4 py-2 text-sm font-bold text-white shadow-sm transition-transform hover:-translate-y-0.5"
            style={{ backgroundImage: GRADIENT }}
          >
            Brand &amp; media kit
          </a>
          <a
            href="#press-contact"
            className="shrink-0 whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-100 hover:text-[#1A1A1A]"
          >
            Press contact
          </a>
        </nav>
      </div>

      {/* Featured release — everything about the current release lives here, including its promo asset */}
      {featuredRelease ? (
        <section
          id="featured-release"
          className="relative z-10 scroll-mt-[132px] border-b border-gray-100 bg-white px-6 py-20"
          aria-labelledby="featured-release-heading"
        >
          <div className="mx-auto max-w-6xl">
            <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
              <div>
                <Eyebrow>Featured release</Eyebrow>
                <h2 id="featured-release-heading" className="text-3xl font-bold text-[#1A1A1A]">
                  Latest from SparkPoint
                </h2>
              </div>
              {mediaKitUrl ? (
                <Button asChild variant="outline" className="rounded-full px-6">
                  <a href={mediaKitUrl} download={featuredRelease.mediaKitFile}>
                    <Download aria-hidden="true" /> Download release media kit
                  </a>
                </Button>
              ) : null}
            </div>
            <PressReleaseCard release={featuredRelease} featured />

            {featuredPromo ? (
              <div className="mt-10">
                <h3 className="mb-4 text-sm font-bold uppercase tracking-widest text-gray-400">Release asset</h3>
                <div className="max-w-3xl">
                  <MediaAssetCard asset={featuredPromo} />
                </div>
              </div>
            ) : null}
          </div>
        </section>
      ) : null}

      {/* Press release archive — transparent window; heading sits in a dark glass card, release cards float as their own opaque cards */}
      <section id="press-archive" className="relative z-10 scroll-mt-[132px] px-6 py-20" aria-labelledby="press-archive-heading">
        <div className="mx-auto max-w-6xl">
          <div
            className="inline-block max-w-2xl rounded-3xl px-7 py-6"
            style={{
              border: '1px solid rgba(255,255,255,0.10)',
              background: 'linear-gradient(180deg, rgba(0,0,0,0.50) 0%, rgba(0,0,0,0.40) 100%)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
            }}
          >
            <p
              className="mb-2 text-sm font-bold uppercase tracking-[0.16em]"
              style={{ color: '#FDB515', textShadow: '0 1px 0 rgba(0,0,0,0.55)' }}
            >
              Archive
            </p>
            <h2
              id="press-archive-heading"
              className="text-3xl font-bold text-white md:text-4xl"
              style={{ textShadow: '0 4px 16px rgba(0,0,0,0.50)' }}
            >
              Press release archive
            </h2>
            <p className="mt-3 max-w-2xl leading-7" style={{ color: 'rgba(255,255,255,0.80)' }}>
              Official releases are listed by publication date. New entries are added here automatically.
            </p>
          </div>
          {archiveReleases.length > 0 ? (
            <div className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {archiveReleases.map((release) => (
                <PressReleaseCard key={release.slug} release={release} />
              ))}
            </div>
          ) : (
            <p className="mt-10 rounded-2xl border border-dashed border-white/30 bg-white/90 p-8 text-gray-600 shadow-lg backdrop-blur-md">
              Additional SparkPoint releases will appear here as they are published.
            </p>
          )}
        </div>
      </section>

      {/* Official SparkPoint Media Kit — transparent window, full glass-morphism treatment (signature section) */}
      <section
        id="media-kit"
        className="relative z-10 scroll-mt-[132px] px-6 py-24"
        aria-labelledby="media-kit-heading"
      >
        <div className="mx-auto max-w-6xl">
          <div
            className="relative overflow-hidden rounded-[2.5rem] p-8 md:p-14"
            style={{
              border: '1px solid rgba(255,255,255,0.12)',
              background: 'linear-gradient(160deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.40) 50%, rgba(0,0,0,0.55) 100%)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              boxShadow: '0 24px 60px rgba(0,0,0,0.45)',
            }}
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute left-1/2 top-[-180px] h-[420px] w-[420px] -translate-x-1/2 rounded-full opacity-[0.20] blur-3xl"
              style={{ backgroundImage: 'conic-gradient(from 180deg, #FDB515, #F15F48, #E03694, #9E509F, #FDB515)' }}
            />
            <img
              src={`${base}brand-kit/assets/mark/SparkPoint-Mark-White.png`}
              alt=""
              aria-hidden="true"
              className="pointer-events-none absolute -right-14 -top-14 w-72 rotate-6 opacity-[0.08]"
            />
            <div className="relative">
              <span
                className="mb-4 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-white shadow-sm"
                style={{ backgroundImage: GRADIENT }}
              >
                Official SparkPoint Media Kit
              </span>
              <h2
                id="media-kit-heading"
                className="text-3xl font-bold text-white md:text-4xl"
                style={{ textShadow: '0 4px 16px rgba(0,0,0,0.50)' }}
              >
                Brand &amp; media resources
              </h2>
              <p className="mt-4 max-w-2xl leading-7" style={{ color: 'rgba(255,255,255,0.82)' }}>
                The two evergreen resources for anyone covering or partnering with SparkPoint: the complete brand kit
                and a quick-reference organization backgrounder. Both stay current automatically — always the right
                logos, colors, and facts.
              </p>

              <div className="mt-8 grid gap-4 md:grid-cols-2">
                <Link
                  to="/brand-kit"
                  className="group relative flex flex-col justify-between gap-6 overflow-hidden rounded-3xl p-7 outline-none transition-all hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-[#E03694]"
                  style={{
                    border: '1px solid rgba(255,255,255,0.14)',
                    backgroundColor: 'rgba(255,255,255,0.07)',
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)',
                  }}
                >
                  <div className="flex items-start gap-4">
                    <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#FDB515] via-[#F15F48] to-[#9E509F] text-white shadow-sm">
                      <Image aria-hidden="true" />
                    </span>
                    <div>
                      <h3 className="text-xl font-bold text-white">SparkPoint brand kit</h3>
                      <p className="mt-1 text-sm leading-6" style={{ color: 'rgba(255,255,255,0.68)' }}>
                        Every logo color, the brandmark, full palette, and fonts — including print-ready vector files.
                      </p>
                    </div>
                  </div>
                  <span className="inline-flex w-fit items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-bold text-[#1A1A1A] transition-transform group-hover:translate-x-1">
                    Open kit <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </span>
                </Link>

                <Link
                  to="/organization-background"
                  className="group relative flex flex-col justify-between gap-6 overflow-hidden rounded-3xl p-7 outline-none transition-all hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-[#E03694]"
                  style={{
                    border: '1px solid rgba(255,255,255,0.14)',
                    backgroundColor: 'rgba(255,255,255,0.07)',
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)',
                  }}
                >
                  <div className="flex items-start gap-4">
                    <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#9E509F] via-[#E03694] to-[#FDB515] text-white shadow-sm">
                      <FileText aria-hidden="true" />
                    </span>
                    <div>
                      <h3 className="text-xl font-bold text-white">Organization background</h3>
                      <p className="mt-1 text-sm leading-6" style={{ color: 'rgba(255,255,255,0.68)' }}>
                        Mission, history, leadership, and current work — a packaged fact sheet, not just a link.
                      </p>
                    </div>
                  </div>
                  <span className="inline-flex w-fit items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-bold text-[#1A1A1A] transition-transform group-hover:translate-x-1">
                    Open backgrounder <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Press contact & standard boilerplate — transparent window, each card provides its own contrast */}
      <section id="press-contact" className="relative z-10 scroll-mt-[132px] px-6 py-20" aria-labelledby="press-contact-heading">
        <div className="mx-auto max-w-6xl">
          <div
            className="mb-8 inline-block rounded-3xl px-7 py-6"
            style={{
              border: '1px solid rgba(255,255,255,0.10)',
              background: 'linear-gradient(180deg, rgba(0,0,0,0.50) 0%, rgba(0,0,0,0.40) 100%)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
            }}
          >
            <p
              className="mb-2 text-sm font-bold uppercase tracking-[0.16em]"
              style={{ color: '#FDB515', textShadow: '0 1px 0 rgba(0,0,0,0.55)' }}
            >
              Press contact
            </p>
            <h2
              id="press-contact-heading"
              className="text-3xl font-bold text-white md:text-4xl"
              style={{ textShadow: '0 4px 16px rgba(0,0,0,0.50)' }}
            >
              Get in touch
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <aside
              className="rounded-3xl p-8 text-white shadow-xl md:p-10"
              style={{
                border: '1px solid rgba(255,255,255,0.12)',
                backgroundColor: 'rgba(26,26,26,0.85)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
              }}
            >
              <Mail className="text-[#FDB515]" aria-hidden="true" />
              <h3 className="mt-5 text-xl font-bold">Media contact</h3>
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

            <aside className="rounded-3xl border border-gray-100 bg-white p-8 shadow-xl md:p-10">
              <h3 className="text-xl font-bold text-[#1A1A1A]">About SparkPoint</h3>
              <p className="mt-5 leading-7 text-gray-600">{PRESS_CONTENT.portal.boilerplate}</p>
            </aside>
          </div>
        </div>
      </section>

      {/* More from SparkPoint */}
      <section className="relative z-10 border-t border-gray-100 bg-white px-6 py-16" aria-labelledby="more-from-sparkpoint-heading">
        <div className="mx-auto max-w-6xl">
          <Eyebrow>Explore more</Eyebrow>
          <h2 id="more-from-sparkpoint-heading" className="text-2xl font-bold text-[#1A1A1A]">More from SparkPoint</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <a
              href="/newsletter"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-2xl border border-gray-100 bg-[#FCFCFD] p-6 shadow-sm outline-none transition-colors hover:border-[#E03694]/40 focus-visible:ring-2 focus-visible:ring-[#E03694]"
            >
              <h3 className="font-bold text-[#1A1A1A]">Newsletter archive</h3>
              <p className="mt-2 text-sm leading-6 text-gray-500">Read past SparkPoint newsletters and subscribe for updates.</p>
            </a>
            <Link
              to="/stories"
              className="rounded-2xl border border-gray-100 bg-[#FCFCFD] p-6 shadow-sm outline-none transition-colors hover:border-[#E03694]/40 focus-visible:ring-2 focus-visible:ring-[#E03694]"
            >
              <h3 className="font-bold text-[#1A1A1A]">Community stories</h3>
              <p className="mt-2 text-sm leading-6 text-gray-500">Explore talks, lectures, and lived experiences from across Transylvania County.</p>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
