'use client';

import { motion } from 'motion/react';
import { Link, useParams } from 'react-router';
import {
  ArrowLeft,
  ArrowRight,
  MapPin,
  Phone,
  Mail,
  Globe,
  Clock,
  Users,
  ShieldCheck,
  CircleDashed,
  AlertTriangle,
  PhoneCall,
} from 'lucide-react';
import { SEOHead } from '../components/SEOHead';
import { RESOURCES, NEED_CATEGORY_BY_ID, type ResourceEntry } from '../data/resources';
import { canonicalUrl } from '../lib/siteOrigin';

function formatAddress(entry: ResourceEntry): string | null {
  const a = entry.contact.address;
  if (!a) return null;
  const line = [a.street, a.city, a.state].filter(Boolean).join(', ');
  return [line, a.zip].filter(Boolean).join(' ');
}

function VerifiedLine({ entry }: { entry: ResourceEntry }) {
  const verified = entry.verified === 'confirmed' || entry.verified === 'partner-input';
  const reviewed = entry.lastReviewed
    ? new Date(entry.lastReviewed + 'T00:00:00').toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null;
  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${
        verified ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
      }`}
    >
      {verified ? <ShieldCheck size={14} /> : <CircleDashed size={14} />}
      {verified ? 'Verified' : 'Being verified'}
      {reviewed ? <span className="font-normal opacity-80">· reviewed {reviewed}</span> : null}
    </div>
  );
}

function DetailRow({
  icon: Icon,
  label,
  children,
}: {
  icon: typeof MapPin;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-3 py-3 border-b border-gray-100 last:border-0">
      <Icon size={18} className="mt-0.5 flex-shrink-0 text-[#E03694]" />
      <div>
        <div className="text-xs font-bold uppercase tracking-wide text-gray-400">{label}</div>
        <div className="mt-0.5 text-sm text-gray-700 leading-relaxed">{children}</div>
      </div>
    </div>
  );
}

export function DirectoryEntryPage() {
  const { id } = useParams<{ id: string }>();
  const entry = RESOURCES.find((r) => r.id === id);

  if (!entry) {
    return (
      <div className="min-h-screen bg-[#FDFDFD] flex items-center justify-center px-6">
        <SEOHead
          title="Resource not found | SparkPoint"
          description="This resource listing could not be found. Browse the SparkPoint Resource Directory for local help in Transylvania County."
          path="/directory"
          noindex
        />
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-3">We couldn't find that resource</h1>
          <p className="text-gray-600 mb-6">It may have moved or been renamed.</p>
          <Link
            to="/directory"
            className="inline-flex items-center gap-2 rounded-full bg-[#E03694] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#c72d80]"
          >
            <ArrowLeft size={16} /> Back to the directory
          </Link>
        </div>
      </div>
    );
  }

  const address = formatAddress(entry);
  const categoryLabels = entry.categories
    .map((cid) => NEED_CATEGORY_BY_ID[cid]?.label)
    .filter(Boolean)
    .join(', ');

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'GovernmentService',
    name: `${entry.name} — ${entry.org}`,
    serviceType: categoryLabels,
    description: entry.summary,
    areaServed: `${entry.serviceArea.county} County, NC`,
    provider: { '@type': 'Organization', name: entry.org },
    url: canonicalUrl(`/directory/${entry.id}`),
    ...(entry.contact.phone ? { telephone: entry.contact.phone } : {}),
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD]">
      <SEOHead
        title={`${entry.name} — ${entry.org} | SparkPoint Resource Directory`}
        description={entry.summary}
        path={`/directory/${entry.id}`}
        jsonLd={jsonLd}
      />

      <article className="max-w-3xl mx-auto px-6 pt-24 md:pt-32 pb-16">
        <Link
          to="/directory"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-[#E03694]"
        >
          <ArrowLeft size={16} /> All resources
        </Link>

        <motion.header
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-6"
        >
          <div className="flex flex-wrap gap-2">
            {entry.categories.map((cid) => (
              <Link
                key={cid}
                to={`/directory?category=${cid}`}
                className="inline-flex items-center rounded-full bg-[#FBEAF4] px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-[#B0246F] hover:bg-[#f6d7ea]"
              >
                {NEED_CATEGORY_BY_ID[cid]?.label ?? cid}
              </Link>
            ))}
          </div>
          <h1 className="mt-4 text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
            {entry.name}
          </h1>
          <p className="mt-1 text-lg font-semibold text-gray-500">{entry.org}</p>
          <div className="mt-4">
            <VerifiedLine entry={entry} />
          </div>
          <p className="mt-6 text-lg text-gray-700 leading-relaxed">{entry.summary}</p>
        </motion.header>

        {/* Warm next step */}
        <div className="mt-8 rounded-2xl border border-[#E03694]/25 bg-[#FDF2F8] p-6">
          <div className="text-xs font-bold uppercase tracking-wide text-[#B0246F]">Your next step</div>
          {entry.nextStep.url ? (
            <a
              href={entry.nextStep.url}
              className="mt-3 inline-flex items-center gap-2 rounded-full bg-[#E03694] px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-[#c72d80] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E03694]/50"
            >
              <PhoneCall size={16} /> {entry.nextStep.label}
              <ArrowRight size={16} />
            </a>
          ) : (
            <p className="mt-2 text-base font-bold text-gray-900">{entry.nextStep.label}</p>
          )}
          {entry.nextStep.note ? (
            <p className="mt-3 text-sm text-gray-600">{entry.nextStep.note}</p>
          ) : null}
        </div>

        {/* Crisis callout, when applicable */}
        {entry.contact.crisisPhone ? (
          <div className="mt-4 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
            <AlertTriangle size={18} className="mt-0.5 flex-shrink-0 text-red-600" />
            <p className="text-sm text-red-800">
              In a mental-health crisis? Call the 24/7 crisis line at{' '}
              <a href={`tel:${entry.contact.crisisPhone.replace(/[^\d+]/g, '')}`} className="font-bold underline">
                {entry.contact.crisisPhone}
              </a>
              . If someone is in immediate danger, call 911.
            </p>
          </div>
        ) : null}

        {/* Details */}
        <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-6">
          {entry.eligibility ? (
            <DetailRow icon={Users} label="Who it's for">
              {entry.eligibility}
            </DetailRow>
          ) : null}
          {entry.hours ? (
            <DetailRow icon={Clock} label="Hours">
              {entry.hours}
            </DetailRow>
          ) : null}
          <DetailRow icon={MapPin} label="Service area">
            {entry.serviceArea.towns?.length
              ? entry.serviceArea.towns.join(', ') + ` (${entry.serviceArea.county} County)`
              : `${entry.serviceArea.county} County`}
            {entry.serviceArea.note ? ` · ${entry.serviceArea.note}` : ''}
          </DetailRow>
          {entry.contact.phone ? (
            <DetailRow icon={Phone} label="Phone">
              <a href={`tel:${entry.contact.phone.replace(/[^\d+]/g, '')}`} className="text-[#E03694] hover:underline">
                {entry.contact.phone}
              </a>
              {entry.contact.tollFree ? (
                <>
                  {' '}· toll-free{' '}
                  <a
                    href={`tel:${entry.contact.tollFree.replace(/[^\d+]/g, '')}`}
                    className="text-[#E03694] hover:underline"
                  >
                    {entry.contact.tollFree}
                  </a>
                </>
              ) : null}
            </DetailRow>
          ) : null}
          {entry.contact.email ? (
            <DetailRow icon={Mail} label="Email">
              <a href={`mailto:${entry.contact.email}`} className="text-[#E03694] hover:underline">
                {entry.contact.email}
              </a>
            </DetailRow>
          ) : null}
          {entry.contact.website ? (
            <DetailRow icon={Globe} label="Website">
              <a
                href={entry.contact.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#E03694] hover:underline break-words"
              >
                {entry.contact.website.replace(/^https?:\/\//, '')}
              </a>
            </DetailRow>
          ) : null}
          {address ? (
            <DetailRow icon={MapPin} label="Address">
              {address}
              {entry.contact.addressNote ? (
                <span className="block text-xs text-gray-500 mt-1">{entry.contact.addressNote}</span>
              ) : null}
            </DetailRow>
          ) : entry.contact.addressNote ? (
            <DetailRow icon={MapPin} label="Address">
              <span className="text-gray-500">{entry.contact.addressNote}</span>
            </DetailRow>
          ) : null}
        </div>

        {/* Correction / freshness */}
        <p className="mt-6 text-sm text-gray-500">
          Details can change. Always confirm hours and eligibility directly with the organization. See
          something out of date?{' '}
          <a
            href={`mailto:info@yoursparkpoint.org?subject=${encodeURIComponent(
              `Directory correction: ${entry.name} (${entry.org})`,
            )}`}
            className="text-[#E03694] font-semibold hover:underline"
          >
            Tell us
          </a>
          .
        </p>

        <div className="mt-10 border-t border-gray-100 pt-6">
          <Link
            to="/directory"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-[#E03694] hover:underline"
          >
            <ArrowLeft size={16} /> Back to the Resource Directory
          </Link>
        </div>
      </article>
    </div>
  );
}

export default DirectoryEntryPage;
