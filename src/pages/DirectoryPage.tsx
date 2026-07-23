'use client';

import { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { Link, useSearchParams } from 'react-router';
import {
  Search,
  ArrowRight,
  MapPin,
  Phone,
  ShieldCheck,
  CircleDashed,
  Utensils,
  Home,
  Stethoscope,
  HeartPulse,
  Bus,
  ClipboardList,
  Scale,
  CloudRain,
  Briefcase,
  Laptop,
  Languages,
  Compass,
  type LucideIcon,
} from 'lucide-react';
import { SEOHead } from '../components/SEOHead';
import { KeepExploringLinks } from '../components/KeepExploringLinks';
import {
  RESOURCES,
  ACTIVE_NEED_CATEGORIES,
  NEED_CATEGORY_BY_ID,
  type ResourceEntry,
  type NeedCategoryId,
} from '../data/resources';

// Map the icon names stored in the data to real lucide components.
const CATEGORY_ICONS: Record<string, LucideIcon> = {
  Utensils,
  Home,
  Stethoscope,
  HeartPulse,
  Bus,
  ClipboardList,
  Scale,
  CloudRain,
  Briefcase,
  Laptop,
  Languages,
  Compass,
};

function categoryIcon(id: NeedCategoryId): LucideIcon {
  return CATEGORY_ICONS[NEED_CATEGORY_BY_ID[id]?.icon] ?? Compass;
}

// Build the searchable haystack once per entry (name, org, summary, eligibility,
// category labels + synonyms). Matching synonyms lets "food stamps" find the
// benefits/food entries — a light preview of the Phase 2 Needs Finder.
function haystack(entry: ResourceEntry): string {
  const catText = entry.categories
    .map((id) => {
      const c = NEED_CATEGORY_BY_ID[id];
      return c ? `${c.label} ${c.synonyms.join(' ')}` : id;
    })
    .join(' ');
  return [entry.name, entry.org, entry.summary, entry.eligibility ?? '', catText]
    .join(' ')
    .toLowerCase();
}

function VerifiedTag({ entry }: { entry: ResourceEntry }) {
  if (entry.verified === 'confirmed' || entry.verified === 'partner-input') {
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
        <ShieldCheck size={13} /> Verified
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-600">
      <CircleDashed size={13} /> Being verified
    </span>
  );
}

export function DirectoryPage() {
  const [searchParams] = useSearchParams();
  const initialCat = searchParams.get('category');
  const catIsValid =
    !!initialCat && ACTIVE_NEED_CATEGORIES.some((c) => c.id === initialCat);
  const [activeCat, setActiveCat] = useState<'all' | NeedCategoryId>(
    catIsValid ? (initialCat as NeedCategoryId) : 'all',
  );
  const [query, setQuery] = useState('');
  const [verifiedOnly, setVerifiedOnly] = useState(false);

  const q = query.trim().toLowerCase();

  const visible = useMemo(() => {
    return RESOURCES.filter((entry) => {
      const catOk = activeCat === 'all' || entry.categories.includes(activeCat);
      const txtOk = !q || haystack(entry).includes(q);
      const verOk =
        !verifiedOnly || entry.verified === 'confirmed' || entry.verified === 'partner-input';
      return catOk && txtOk && verOk;
    });
  }, [activeCat, q, verifiedOnly]);

  return (
    <div className="min-h-screen bg-[#FDFDFD]">
      <SEOHead
        title="Resource Directory | SparkPoint"
        description="Find local help in Transylvania County — food, housing, health care, mental health, transportation, benefits, legal aid, and disaster recovery. Browse and search SparkPoint's Resource Directory."
        path="/directory"
      />

      {/* Masthead */}
      <section className="relative pt-24 pb-8 md:pt-32 md:pb-12 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          >
            <span className="block text-xs font-bold tracking-[0.2em] text-[#E03694] uppercase mb-4">
              Resilience Hub
            </span>
            <h1
              className="font-bold text-[#1A1A1A]"
              style={{ fontSize: 'clamp(2.5rem, 7vw, 4rem)', lineHeight: '1.02', letterSpacing: '-0.03em' }}
            >
              Resource Directory
            </h1>
            <p
              className="mt-5 max-w-2xl text-gray-600"
              style={{ fontSize: 'clamp(1.125rem, 3vw, 1.25rem)', lineHeight: '1.6' }}
            >
              Local organizations across Transylvania County — food, housing, health, mental health,
              transportation, benefits, legal aid, and disaster recovery. Every listing includes a
              concrete first step you can take today.
            </p>
            <p className="mt-4 text-sm text-gray-500 max-w-2xl">
              This directory is growing, and we confirm details with each organization as we go. If
              something looks out of date, please{' '}
              <a href="mailto:info@yoursparkpoint.org" className="text-[#E03694] font-semibold hover:underline">
                let us know
              </a>
              . Not sure where to start?{' '}
              <Link to="/directory/sparkpoint-resilience-hub-navigation" className="text-[#E03694] font-semibold hover:underline">
                A SparkPoint navigator can help
              </Link>
              .
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filter + search */}
      <div className="sticky top-0 z-20 bg-[#FDFDFD]/95 backdrop-blur border-y border-gray-100">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center gap-2 py-3.5 flex-wrap">
            <span className="text-xs font-extrabold uppercase tracking-[0.16em] text-gray-400 mr-1">
              Browse
            </span>
            <button
              onClick={() => setActiveCat('all')}
              className={`rounded-full px-4 py-2 text-sm font-semibold border transition-all ${
                activeCat === 'all'
                  ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]'
                  : 'bg-white text-[#1A1A1A] border-gray-200 hover:border-[#E03694]'
              }`}
            >
              All resources
            </button>
            {ACTIVE_NEED_CATEGORIES.map((cat) => {
              const Icon = categoryIcon(cat.id);
              const active = activeCat === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCat(cat.id)}
                  className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold border transition-all ${
                    active
                      ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]'
                      : 'bg-white text-[#1A1A1A] border-gray-200 hover:border-[#E03694]'
                  }`}
                  aria-pressed={active}
                >
                  <Icon size={15} /> {cat.label}
                </button>
              );
            })}
          </div>
          <div className="flex items-center gap-4 pb-3.5 flex-wrap">
            <div className="relative flex items-center flex-1 min-w-[220px]">
              <Search size={15} className="absolute left-3.5 text-gray-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by need — e.g. food, rent, counseling, a ride…"
                aria-label="Search resources"
                className="w-full rounded-full border border-gray-200 bg-white pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-[#E03694] focus:ring-1 focus:ring-[#E03694]"
              />
            </div>
            <label className="inline-flex items-center gap-2 text-sm text-gray-600 select-none cursor-pointer">
              <input
                type="checkbox"
                checked={verifiedOnly}
                onChange={(e) => setVerifiedOnly(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-[#E03694] focus:ring-[#E03694]"
              />
              Show verified only
            </label>
          </div>
        </div>
      </div>

      {/* Results */}
      <section className="px-6 py-10">
        <div className="max-w-6xl mx-auto">
          <p className="text-sm text-gray-500 mb-6" aria-live="polite">
            {visible.length} {visible.length === 1 ? 'resource' : 'resources'}
            {activeCat !== 'all' ? ` in ${NEED_CATEGORY_BY_ID[activeCat].label}` : ''}
          </p>

          {visible.length === 0 ? (
            <div className="text-center text-gray-500 py-16">
              <p className="mb-2">No resources match that search yet.</p>
              <button
                onClick={() => {
                  setQuery('');
                  setActiveCat('all');
                  setVerifiedOnly(false);
                }}
                className="text-[#E03694] font-semibold hover:underline"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {visible.map((entry, i) => (
                <motion.li
                  key={entry.id}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.4, delay: (i % 3) * 0.04 }}
                >
                  <Link
                    to={`/directory/${entry.id}`}
                    className="group flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-6 transition-all hover:border-[#E03694]/40 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E03694]/40"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex flex-wrap gap-1.5">
                        {entry.categories.slice(0, 2).map((id) => {
                          const Icon = categoryIcon(id);
                          return (
                            <span
                              key={id}
                              className="inline-flex items-center gap-1 rounded-full bg-[#FBEAF4] px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-[#B0246F]"
                            >
                              <Icon size={12} /> {NEED_CATEGORY_BY_ID[id].label}
                            </span>
                          );
                        })}
                      </div>
                      <VerifiedTag entry={entry} />
                    </div>

                    <h2 className="mt-4 text-lg font-bold text-gray-900 leading-snug group-hover:text-[#E03694]">
                      {entry.name}
                    </h2>
                    <p className="text-sm font-semibold text-gray-500">{entry.org}</p>

                    <p className="mt-3 text-sm text-gray-600 leading-relaxed line-clamp-4">
                      {entry.summary}
                    </p>

                    <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500">
                      <span className="inline-flex items-center gap-1">
                        <MapPin size={12} />
                        {entry.serviceArea.note ||
                          (entry.serviceArea.towns?.length
                            ? entry.serviceArea.towns.join(', ')
                            : `${entry.serviceArea.county} County`)}
                      </span>
                      {entry.contact.phone ? (
                        <span className="inline-flex items-center gap-1">
                          <Phone size={12} />
                          {entry.contact.phone}
                        </span>
                      ) : null}
                    </div>

                    <span className="mt-5 inline-flex items-center text-sm font-bold text-[#E03694]">
                      {entry.nextStep.label}
                      <ArrowRight size={15} className="ml-1.5 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </Link>
                </motion.li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <KeepExploringLinks
        title="Keep exploring the Resilience Hub"
        intro="The directory is one door into SparkPoint's Resilience Hub."
        links={[
          {
            to: '/resilience-hub',
            label: 'The Resilience Hub',
            description: 'A shared space for connection, learning, and coordinated support.',
          },
          {
            to: '/directory/sparkpoint-resilience-hub-navigation',
            label: 'Talk to a navigator',
            description: 'Not sure where to start? A person will help you find it.',
          },
          {
            to: '/get-involved',
            label: 'Get involved',
            description: 'Volunteer, partner, or add your organization to the directory.',
          },
        ]}
      />
    </div>
  );
}

export default DirectoryPage;
