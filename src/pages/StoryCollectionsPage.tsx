'use client';

import { Link } from 'react-router';
import { motion } from 'motion/react';
import { ArrowLeft, ArrowRight, Layers, Mic, RefreshCw, Sparkles } from 'lucide-react';
import { Card } from '../components/ui/card';
import { STORY_COLLECTIONS } from '../data/storyCollections';
import { SEOHead } from '../components/SEOHead';
import heleneShootSetup from '../assets/story-collections/imgs/storylab-interview-setup.webp';
import heleneShootMale from '../assets/story-collections/imgs/storylab-monitor-interview-male.webp';
import heleneShootFemale from '../assets/story-collections/imgs/storylab-monitor-interview-female.webp';
import onLocationShoot from '../assets/story-collections/imgs/on-location-shoot-mural-interview.webp';

const HELENE_SHOOT_PHOTOS = [
  { src: heleneShootSetup, alt: 'A remote-monitored interview being filmed for the Helene: One Year of Healing tribute film at the SparkPoint office.' },
  { src: heleneShootMale, alt: 'A Transylvania County resident being interviewed on camera for the Helene: One Year of Healing tribute film.' },
  { src: heleneShootFemale, alt: 'A Transylvania County resident being interviewed on camera for the Helene: One Year of Healing tribute film.' },
];

const PROCESS_STEPS = [
  {
    title: 'You share, in your own words',
    body: "Every collection opens with a real question, not a multiple-choice survey. You tell it as a story — whatever shape fits what actually happened to you.",
    icon: Mic,
  },
  {
    title: 'Responses are anonymized and read together',
    body: "Identifying details are stripped out and your story is combined with everyone else's. Community members — not just SparkPoint staff — are trained to help find the patterns.",
    icon: Layers,
  },
  {
    title: 'What we learn goes back to the community',
    body: "Patterns become published stories, public summaries, and real changes to SparkPoint's programs and partnerships — not a report that sits in a drawer.",
    icon: RefreshCw,
  },
];

export default function StoryCollectionsPage() {
  const active = STORY_COLLECTIONS.filter((c) => c.status === 'active');
  const closed = STORY_COLLECTIONS.filter((c) => c.status === 'closed');

  return (
    <div className="min-h-screen bg-[#FDFDFD]">
      <SEOHead
        title="Story Collections | SparkPoint"
        description="Active and past story-collection drives from SparkPoint — where we're gathering community voices right now, and what past collections became."
        path="/stories/collections"
      />

      <section className="px-6 pb-10 pt-28 md:pb-14 md:pt-36">
        <div className="mx-auto max-w-6xl">
          <Link
            to="/stories"
            className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-gray-500 transition-colors hover:text-[#E03694]"
          >
            <ArrowLeft size={18} aria-hidden="true" /> The Story Hub
          </Link>
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
            <div>
              <span className="mb-4 block text-xs font-bold uppercase tracking-[0.2em] text-[#E03694]">
                Story Collections
              </span>
              <h1 className="font-bold text-[#1A1A1A]" style={{ fontSize: 'clamp(2.5rem, 6vw, 3.75rem)', lineHeight: '1.05', letterSpacing: '-0.02em' }}>
                Where the stories start.
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-relaxed text-gray-600">
                Story collections are the engine behind everything SparkPoint publishes — organized drives to listen to
                our neighbors on a specific question, at a specific moment. Some are open right now. Others became the
                films, talks, and columns already in the Story Hub.
              </p>
            </div>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="overflow-hidden rounded-2xl shadow-md"
            >
              <img
                src={onLocationShoot}
                alt="A SparkPoint crew filming a community interview on location, in front of a mural reading 'I get by with a little help from my friends.'"
                className="aspect-[4/3] w-full object-cover"
              />
            </motion.div>
          </div>
        </div>
      </section>

      <section className="px-6 pb-14">
        <div className="mx-auto max-w-6xl">
          <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm md:p-11">
            <span className="mb-3 block text-xs font-bold uppercase tracking-[0.2em] text-[#E03694]">How this works</span>
            <h2 className="max-w-2xl text-2xl font-bold text-gray-900 md:text-3xl">
              Grounded in Participatory Narrative Inquiry — story work that leads somewhere.
            </h2>
            <p className="mt-4 max-w-2xl leading-relaxed text-gray-600">
              SparkPoint's StoryLab collects, stewards, and learns from community stories ethically. It isn't
              about awareness alone — every collection follows the same three-step cycle before it ever informs
              a program or partnership.
            </p>
            <div className="mt-9 grid grid-cols-1 gap-8 md:grid-cols-3">
              {PROCESS_STEPS.map((step, i) => {
                const Icon = step.icon;
                return (
                  <motion.div
                    key={step.title}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-40px' }}
                    transition={{ duration: 0.5, delay: i * 0.08 }}
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FBEFF6]">
                      <Icon size={18} className="text-[#E03694]" aria-hidden="true" />
                    </div>
                    <h3 className="mt-4 font-bold text-gray-900">{step.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-gray-600">{step.body}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {active.length ? (
        <section className="px-6 pb-14">
          <div className="mx-auto max-w-6xl">
            <h2 className="mb-5 text-xs font-extrabold uppercase tracking-[0.16em] text-gray-400">
              Now collecting
            </h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {active.map((collection, i) => (
                <motion.div
                  key={collection.id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.5, delay: i * 0.05 }}
                >
                  <Link to={`/stories/collections/${collection.id}`}>
                    <Card className="group h-full overflow-hidden border-0 bg-white shadow-md transition-all duration-500 hover:-translate-y-1 hover:shadow-xl">
                      <div className="relative h-56 overflow-hidden bg-gray-100">
                        <img
                          src={collection.image}
                          alt={collection.imageAlt}
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                        />
                        <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.1em] text-[#E03694]">
                          <span className="h-2 w-2 animate-pulse rounded-full bg-[#25b06a]" /> {collection.statusLabel}
                        </span>
                      </div>
                      <div className="p-7">
                        <h3 className="text-2xl font-bold text-gray-900">{collection.title}</h3>
                        <p className="mt-2 text-[15px] leading-relaxed text-gray-600">{collection.summary}</p>
                        <span className="mt-5 flex items-center text-sm font-bold tracking-wide text-[#E03694]">
                          Media kit & share your story <ArrowRight size={16} className="ml-2" />
                        </span>
                      </div>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      ) : (
        <section className="px-6 pb-14">
          <div className="mx-auto max-w-6xl rounded-2xl border border-dashed border-gray-200 p-10 text-center text-gray-500">
            <Sparkles className="mx-auto mb-3 text-[#E03694]" aria-hidden="true" />
            No collections are actively gathering stories right now — check back soon.
          </div>
        </section>
      )}

      {closed.length ? (
        <section className="px-6 pb-14">
          <div className="mx-auto max-w-6xl">
            <div className="overflow-hidden rounded-2xl bg-[#1A1A1A]">
              <div className="grid grid-cols-1 gap-3 p-2 sm:grid-cols-3">
                {HELENE_SHOOT_PHOTOS.map((photo, i) => (
                  <motion.div
                    key={photo.src}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-40px' }}
                    transition={{ duration: 0.5, delay: i * 0.06 }}
                    className="overflow-hidden rounded-xl bg-gray-800"
                  >
                    <img src={photo.src} alt={photo.alt} loading="lazy" className="aspect-video w-full object-cover" />
                  </motion.div>
                ))}
              </div>
              <div className="px-6 py-7 sm:px-8 sm:py-9">
                <span className="mb-2 inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.16em] text-[#FDB515]">
                  <Sparkles size={15} aria-hidden="true" /> Proof the process works
                </span>
                <h2 className="max-w-2xl text-xl font-bold text-white md:text-2xl">
                  One shoot, two outcomes.
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/70 md:text-base">
                  These stills are from the Helene: One Year of Healing shoot — interviews filmed with residents
                  across the county. The same conversations did double duty: highlighted in the finished film, and
                  separately anonymized into SparkPoint's story database through the PNI process above. Reading
                  140+ of those anonymized stories together is what led to Community Connectors.
                </p>
                <Link
                  to="/stories/programs/when-neighbors-become-leaders"
                  className="mt-5 inline-flex items-center text-sm font-bold uppercase tracking-wide text-[#FDB515] hover:underline"
                >
                  Read what came of it <ArrowRight size={15} className="ml-2" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {closed.length ? (
        <section className="px-6 pb-20">
          <div className="mx-auto max-w-6xl">
            <h2 className="mb-5 text-xs font-extrabold uppercase tracking-[0.16em] text-gray-400">
              Past collections
            </h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {closed.map((collection) => (
                <Link key={collection.id} to={`/stories/collections/${collection.id}`}>
                  <Card className="flex h-full flex-col overflow-hidden border-0 bg-[#FAFAFA] shadow-sm transition-all duration-500 hover:shadow-md sm:flex-row">
                    <div className="relative h-40 overflow-hidden bg-gray-100 sm:h-auto sm:w-2/5 sm:flex-shrink-0">
                      <img src={collection.image} alt={collection.imageAlt} loading="lazy" className="h-full w-full object-cover" />
                    </div>
                    <div className="flex-1 p-6">
                      <span className="text-[11px] font-extrabold uppercase tracking-wide text-gray-400">{collection.statusLabel}</span>
                      <h3 className="mt-1 text-xl font-bold text-gray-900">{collection.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-gray-600">{collection.summary}</p>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </div>
  );
}
