'use client';

import { Link, useParams } from 'react-router';
import { motion } from 'motion/react';
import { ArrowLeft, ArrowRight, Download, Gift, QrCode, ShieldCheck } from 'lucide-react';
import { Button } from '../components/ui/button';
import { CopyButton } from '../components/press/CopyButton';
import { getStoryCollection, storyCollectionDownloadUrl, STORY_COLLECTIONS } from '../data/storyCollections';
import { SEOHead } from '../components/SEOHead';

export default function StoryCollectionDetailPage() {
  const { id } = useParams();
  const collection = getStoryCollection(id);

  if (!collection) {
    return (
      <div className="min-h-[70vh] bg-[#FDFDFD] px-6 pb-24 pt-36 text-center">
        <SEOHead
          title="Story Collection Not Found | SparkPoint"
          description="The requested SparkPoint story collection could not be found."
          path={`/stories/collections/${id ?? ''}`}
          noindex
        />
        <h1 className="text-4xl font-bold text-[#1A1A1A]">Collection not found</h1>
        <p className="mt-5 text-gray-600">It may have moved, or the link may be out of date.</p>
        <Button asChild className="mt-8 bg-[#E03694] text-white hover:bg-[#C82C82]">
          <Link to="/stories/collections"><ArrowLeft aria-hidden="true" /> All story collections</Link>
        </Button>
      </div>
    );
  }

  const isActive = collection.status === 'active';
  const hasMediaKit = isActive && (collection.flyerImage || collection.qrImage || collection.socialCopy?.length);
  const flyerDownloadUrl = collection.flyerDownloadFile ? storyCollectionDownloadUrl(collection.flyerDownloadFile) : undefined;
  const qrDownloadUrl = collection.qrDownloadFile ? storyCollectionDownloadUrl(collection.qrDownloadFile) : undefined;

  return (
    <div className="min-h-screen bg-[#FDFDFD]">
      <SEOHead
        title={collection.seoTitle ?? `${collection.title} | SparkPoint Story Collection`}
        description={collection.seoDescription ?? collection.summary}
        path={`/stories/collections/${collection.id}`}
        image={collection.image}
        imageType={collection.image.includes('.webp') ? 'image/webp' : undefined}
      />

      <header className="px-6 pb-12 pt-28 md:pb-16 md:pt-36">
        <div className="mx-auto max-w-5xl">
          <Link
            to="/stories/collections"
            className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-gray-500 transition-colors hover:text-[#E03694]"
          >
            <ArrowLeft size={18} aria-hidden="true" /> Story Collections
          </Link>
          <span
            className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.1em] ${
              isActive ? 'bg-[#FBEFF6] text-[#E03694]' : 'bg-gray-100 text-gray-500'
            }`}
          >
            {isActive ? <span className="h-2 w-2 animate-pulse rounded-full bg-[#25b06a]" /> : null}
            {collection.statusLabel}
          </span>
          <h1 className="mt-5 font-bold text-[#1A1A1A]" style={{ fontSize: 'clamp(2.25rem, 5vw, 3.5rem)', lineHeight: '1.08', letterSpacing: '-0.02em' }}>
            {collection.title}
          </h1>
          <p className="mt-4 max-w-2xl font-serif italic text-lg text-gray-500">{collection.tagline}</p>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-gray-600">{collection.description}</p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            {isActive && collection.formPath ? (
              <Button asChild className="rounded-full px-8 py-6 text-base shadow-lg hover:shadow-xl" style={{ background: 'linear-gradient(135deg, #E03694, #9E509F)', color: 'white' }}>
                <Link to={collection.formPath}>Share your story <ArrowRight className="ml-1" size={18} /></Link>
              </Button>
            ) : collection.resultsPath ? (
              <Button asChild className="rounded-full px-8 py-6 text-base shadow-lg hover:shadow-xl" style={{ background: 'linear-gradient(135deg, #E03694, #9E509F)', color: 'white' }}>
                <Link to={collection.resultsPath}>{collection.resultsLabel ?? 'See what came of it'} <ArrowRight className="ml-1" size={18} /></Link>
              </Button>
            ) : null}
            {collection.incentive ? (
              <span className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500">
                <Gift size={17} className="text-[#FDB515]" aria-hidden="true" /> {collection.incentive}
              </span>
            ) : null}
          </div>

          {collection.privacyNote ? (
            <p className="mt-6 inline-flex max-w-xl items-start gap-2 text-sm leading-relaxed text-gray-500">
              <ShieldCheck size={16} className="mt-0.5 flex-shrink-0 text-gray-400" aria-hidden="true" /> {collection.privacyNote}
            </p>
          ) : null}
        </div>
      </header>

      {hasMediaKit ? (
        <section className="px-6 pb-20" aria-labelledby="media-kit-heading">
          <div className="mx-auto max-w-5xl">
            <div className="mb-8 flex items-end justify-between flex-wrap gap-3">
              <div>
                <span className="mb-2 block text-xs font-bold uppercase tracking-[0.2em] text-[#E03694]">Media kit</span>
                <h2 id="media-kit-heading" className="text-2xl font-bold text-gray-900 md:text-3xl">
                  Help spread the word
                </h2>
              </div>
              {collection.formUrlAbsolute ? (
                <CopyButton text={collection.formUrlAbsolute} label="Copy form link" className="rounded-full" />
              ) : null}
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.1fr_0.9fr]">
              {collection.flyerImage ? (
                <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-40px' }} transition={{ duration: 0.5 }}>
                  <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                    <img src={collection.flyerImage} alt={collection.flyerImageAlt ?? `${collection.title} flyer`} loading="lazy" className="w-full" />
                    <div className="flex items-center justify-between gap-4 p-5">
                      <p className="text-sm text-gray-500">Print or post as-is — no cropping needed.</p>
                      {flyerDownloadUrl ? (
                        <Button asChild variant="outline" className="flex-shrink-0 rounded-full">
                          <a href={flyerDownloadUrl} download>
                            <Download aria-hidden="true" /> Download flyer
                          </a>
                        </Button>
                      ) : null}
                    </div>
                  </div>
                </motion.div>
              ) : null}

              <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-40px' }} transition={{ duration: 0.5, delay: 0.05 }} className="flex flex-col gap-6">
                {collection.qrImage ? (
                  <div className="rounded-2xl border border-gray-100 bg-white p-6 text-center shadow-sm">
                    <span className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-wide text-gray-400">
                      <QrCode size={15} aria-hidden="true" /> Scan to share
                    </span>
                    <img
                      src={collection.qrImage}
                      alt={`QR code linking to ${collection.formUrlAbsolute ?? collection.formPath}`}
                      className="mx-auto my-5 h-40 w-40"
                    />
                    {collection.formUrlAbsolute ? (
                      <p className="mb-4 break-all text-sm font-semibold text-gray-500">{collection.formUrlAbsolute}</p>
                    ) : null}
                    {qrDownloadUrl ? (
                      <Button asChild variant="outline" className="w-full rounded-full">
                        <a href={qrDownloadUrl} download>
                          <Download aria-hidden="true" /> Download QR code
                        </a>
                      </Button>
                    ) : null}
                  </div>
                ) : null}
              </motion.div>
            </div>

            {collection.socialCopy?.length ? (
              <div className="mt-10">
                <h3 className="mb-5 text-xs font-extrabold uppercase tracking-[0.16em] text-gray-400">
                  Ready-to-post copy
                </h3>
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  {collection.socialCopy.map((block) => (
                    <div key={block.platform} className="flex flex-col rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                      <span className="mb-3 text-sm font-bold text-[#9E509F]">{block.platform}</span>
                      <p className="flex-1 whitespace-pre-line text-[15px] leading-relaxed text-gray-700">{block.text}</p>
                      <div className="mt-5">
                        <CopyButton text={block.text} label="Copy caption" className="rounded-full" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </section>
      ) : null}

      {STORY_COLLECTIONS.length > 1 ? (
        <section className="border-t border-gray-100 px-6 py-14">
          <div className="mx-auto max-w-5xl">
            <Link to="/stories/collections" className="text-sm font-bold uppercase tracking-wide text-[#E03694]">
              See all story collections →
            </Link>
          </div>
        </section>
      ) : null}
    </div>
  );
}
