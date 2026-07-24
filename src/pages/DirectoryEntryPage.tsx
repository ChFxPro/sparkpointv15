'use client';

import { useState } from 'react';
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
  FileText,
  ExternalLink,
} from 'lucide-react';
import { SEOHead } from '../components/SEOHead';
import {
  RESOURCES,
  NEED_CATEGORY_BY_ID,
  type ResourceEntry,
} from '../data/resources';
import { canonicalUrl } from '../lib/siteOrigin';

function formatAddress(entry: ResourceEntry): string | null {
  const a = entry.contact.address;
  if (!a) return null;
  const line = [a.street, a.city, a.state].filter(Boolean).join(', ');
  return [line, a.zip].filter(Boolean).join(' ');
}

function initials(org: string): string {
  const words = org
    .replace(/[—–-].*$/, '')
    .split(/\s+/)
    .filter((w) => w && !['the', 'of', 'and', '&', 'for'].includes(w.toLowerCase()));
  if (words.length === 0) return org.slice(0, 2).toUpperCase();
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

function OrgAvatar({ entry, size = 56 }: { entry: ResourceEntry; size?: number }) {
  const [broken, setBroken] = useState(false);
  const cat = NEED_CATEGORY_BY_ID[entry.categories[0]];
  const style = { width: size, height: size } as const;
  if (entry.logo && !broken) {
    return (
      <img
        src={entry.logo}
        alt={`${entry.org} logo`}
        onError={() => setBroken(true)}
        className="flex-shrink-0 rounded-2xl object-contain bg-white ring-1 ring-gray-200"
        style={style}
      />
    );
  }
  return (
    <div
      aria-hidden
      className="flex-shrink-0 grid place-items-center rounded-2xl font-extrabold ring-1 ring-black/5"
      style={{ ...style, background: cat.tint, color: cat.ink, fontSize: size * 0.34 }}
    >
      {initials(entry.org)}
    </div>
  );
}

/** Render a link with the right element for internal / external / tel / mailto URLs. */
function SmartLink({
  url,
  className,
  style,
  children,
}: {
  url: string;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}) {
  if (url.startsWith('/')) {
    return (
      <Link to={url} className={className} style={style}>
        {children}
      </Link>
    );
  }
  const isWeb = /^https?:\/\//i.test(url);
  return (
    <a
      href={url}
      className={className}
      style={style}
      {...(isWeb ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    >
      {children}
    </a>
  );
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
  accent,
  children,
}: {
  icon: typeof MapPin;
  label: string;
  accent: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-3 py-3 border-b border-gray-100 last:border-0">
      <Icon size={18} className="mt-0.5 flex-shrink-0" style={{ color: accent }} />
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

  const primary = NEED_CATEGORY_BY_ID[entry.categories[0]];
  const accent = primary.ink;
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

      {/* thin category accent across the top of the content */}
      <div aria-hidden className="h-1.5 w-full" style={{ background: accent }} />

      <article className="max-w-3xl mx-auto px-6 pt-16 md:pt-20 pb-16">
        <Link
          to="/directory"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-gray-800"
        >
          <ArrowLeft size={16} /> All resources
        </Link>

        <motion.header
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-6"
        >
          <div className="flex items-start gap-4">
            <OrgAvatar entry={entry} />
            <div className="min-w-0">
              <div className="flex flex-wrap gap-2">
                {entry.categories.map((cid) => {
                  const c = NEED_CATEGORY_BY_ID[cid];
                  return (
                    <Link
                      key={cid}
                      to={`/directory?category=${cid}`}
                      className="inline-flex items-center rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wide transition-opacity hover:opacity-80"
                      style={{ background: c.tint, color: c.ink }}
                    >
                      {c.label}
                    </Link>
                  );
                })}
              </div>
              <h1 className="mt-3 text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
                {entry.name}
              </h1>
              <p className="mt-1 text-lg font-semibold text-gray-500">{entry.org}</p>
            </div>
          </div>

          <div className="mt-4">
            <VerifiedLine entry={entry} />
          </div>
          <p className="mt-6 text-lg text-gray-700 leading-relaxed">{entry.summary}</p>
        </motion.header>

        {/* Warm next step — colored by the primary category */}
        <div
          className="mt-8 rounded-2xl border p-6"
          style={{ borderColor: `${accent}40`, background: primary.tint }}
        >
          <div className="text-xs font-bold uppercase tracking-wide" style={{ color: accent }}>
            Your next step
          </div>
          {entry.nextStep.url ? (
            <SmartLink
              url={entry.nextStep.url}
              className="mt-3 inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-bold text-white transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
              style={{ background: accent, ['--tw-ring-color' as string]: accent }}
            >
              <PhoneCall size={16} /> {entry.nextStep.label}
              <ArrowRight size={16} />
            </SmartLink>
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
            <DetailRow icon={Users} label="Who it's for" accent={accent}>
              {entry.eligibility}
            </DetailRow>
          ) : null}
          {entry.hours ? (
            <DetailRow icon={Clock} label="Hours" accent={accent}>
              {entry.hours}
            </DetailRow>
          ) : null}
          <DetailRow icon={MapPin} label="Service area" accent={accent}>
            {entry.serviceArea.towns?.length
              ? entry.serviceArea.towns.join(', ') + ` (${entry.serviceArea.county} County)`
              : `${entry.serviceArea.county} County`}
            {entry.serviceArea.note ? ` · ${entry.serviceArea.note}` : ''}
          </DetailRow>
          {entry.contact.phone ? (
            <DetailRow icon={Phone} label="Phone" accent={accent}>
              <a href={`tel:${entry.contact.phone.replace(/[^\d+]/g, '')}`} className="hover:underline" style={{ color: accent }}>
                {entry.contact.phone}
              </a>
              {entry.contact.tollFree ? (
                <>
                  {' '}· toll-free{' '}
                  <a href={`tel:${entry.contact.tollFree.replace(/[^\d+]/g, '')}`} className="hover:underline" style={{ color: accent }}>
                    {entry.contact.tollFree}
                  </a>
                </>
              ) : null}
            </DetailRow>
          ) : null}
          {entry.contact.email ? (
            <DetailRow icon={Mail} label="Email" accent={accent}>
              <a href={`mailto:${entry.contact.email}`} className="hover:underline" style={{ color: accent }}>
                {entry.contact.email}
              </a>
            </DetailRow>
          ) : null}
          {entry.contact.website ? (
            <DetailRow icon={Globe} label="Website" accent={accent}>
              <a
                href={entry.contact.website}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline break-words"
                style={{ color: accent }}
              >
                {entry.contact.website.replace(/^https?:\/\//, '')}
              </a>
            </DetailRow>
          ) : null}
          {address ? (
            <DetailRow icon={MapPin} label="Address" accent={accent}>
              {address}
              {entry.contact.addressNote ? (
                <span className="block text-xs text-gray-500 mt-1">{entry.contact.addressNote}</span>
              ) : null}
            </DetailRow>
          ) : entry.contact.addressNote ? (
            <DetailRow icon={MapPin} label="Address" accent={accent}>
              <span className="text-gray-500">{entry.contact.addressNote}</span>
            </DetailRow>
          ) : null}
        </div>

        {/* Other ways to connect — apply/intake form + program links */}
        {(entry.contact.applyUrl || (entry.contact.links && entry.contact.links.length)) ? (
          <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-6">
            <h2 className="text-sm font-bold uppercase tracking-wide text-gray-400">
              More ways to connect
            </h2>
            {entry.contact.applyUrl ? (
              <SmartLink
                url={entry.contact.applyUrl}
                className="mt-4 inline-flex items-center gap-2 rounded-full border-2 px-5 py-2.5 text-sm font-bold transition-opacity hover:opacity-80"
                style={{ borderColor: accent, color: accent }}
              >
                <FileText size={15} /> Apply or request help online
                <ArrowRight size={15} />
              </SmartLink>
            ) : null}
            {entry.contact.links && entry.contact.links.length ? (
              <ul className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
                {entry.contact.links.map((l) => (
                  <li key={l.url}>
                    <SmartLink
                      url={l.url}
                      className="group inline-flex items-center gap-1.5 text-sm font-semibold hover:underline"
                    >
                      <ExternalLink size={13} className="text-gray-400" style={{ color: accent }} />
                      <span style={{ color: accent }}>{l.label}</span>
                    </SmartLink>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        ) : null}

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
            className="inline-flex items-center gap-1.5 text-sm font-bold hover:underline"
            style={{ color: accent }}
          >
            <ArrowLeft size={16} /> Back to the Resource Directory
          </Link>
        </div>
      </article>
    </div>
  );
}

export default DirectoryEntryPage;
