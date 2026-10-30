// Small shared pieces of the /backporch feed: the copy-link button, Add to
// calendar, the gold date block, month markers, photos, and the after-mount clock.
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { coverImgStyle, dateChip, porchImageSrcSet, porchImageUrl, postPath, shortAddress, type CoverFrame, type PorchPost } from '../../../lib/backporch';
import { WholeBackdrop } from '../../../components/backporch/PorchParts';
import { canonicalUrl } from '../../../lib/siteOrigin';
import { googleCalendarUrl, icsDataUrl, timeUntil } from '../../../lib/porchFeed';

declare global {
  interface Window {
    /** Set by scripts/prerender.mjs while it snapshots pages at build time. */
    __PRERENDER__?: boolean;
  }
}

/**
 * The current time, but only in a visitor's browser: null during the build-time
 * snapshot and the first render, so relative words ("In 16 days") never get frozen
 * into static HTML. Callers show the plain date until it arrives, on the same line.
 */
export function useClientNow(): number | null {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    if (window.__PRERENDER__) return;
    setNow(Date.now());
    const id = window.setInterval(() => setNow(Date.now()), 60 * 60_000);
    return () => window.clearInterval(id);
  }, []);
  return now;
}

/** "In 16 days" for visitors; the plain date in the static HTML. */
export function WhenLine({ post, fallback }: { post: PorchPost; fallback: string }) {
  const now = useClientNow();
  const rel = now && post.event_start ? timeUntil(post.event_start, now) : null;
  return <span className="pf-when">{rel ?? fallback}</span>;
}

export const pageUrl = (post: PorchPost) => canonicalUrl(postPath(post.slug));

export function Photo({
  path,
  alt,
  sizes,
  eager = false,
  className = '',
  frame,
}: {
  path: string | null;
  alt: string;
  sizes: string;
  eager?: boolean;
  className?: string;
  /** The post's cover framing, when this photo is its cover. */
  frame?: CoverFrame;
}) {
  const src = porchImageUrl(path, 960);
  if (!src) return <div className={`pf-photo pf-photo-blank ${className}`} aria-hidden="true" />;
  const img = (
    <img
      className={frame?.fit === 'whole' ? 'pf-photo-main' : `pf-photo ${className}`}
      src={src}
      srcSet={porchImageSrcSet(path)}
      sizes={sizes}
      alt={alt}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      style={coverImgStyle(frame)}
    />
  );
  if (frame?.fit !== 'whole') return img;
  // Shown whole: the wrapper takes the photo's place in the layout.
  return (
    <span className={`pf-photo pf-photo-whole ${className}`}>
      <WholeBackdrop path={path} className="pf-photo-backdrop" />
      {img}
    </span>
  );
}

/** The gold date block on a ticket. Read as text by the line beside it, so hidden here. */
export function DateBlock({ iso, size = 'lead' }: { iso: string; size?: 'lead' | 'small' }) {
  const { month, day } = dateChip(iso);
  return (
    <span className="pf-date" data-size={size} aria-hidden="true">
      <small>{month}</small>
      <b>{day}</b>
    </span>
  );
}

/** A gold italic month label with a rule fading out after it. */
export function Marker({ id, children }: { id?: string; children: ReactNode }) {
  return (
    <div className="pf-marker">
      <h2 id={id}>{children}</h2>
      <span aria-hidden="true" />
    </div>
  );
}

const LinkIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M10 14a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1" />
    <path d="M14 10a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1" />
  </svg>
);

/**
 * Copies the post's short address. If the clipboard isn't available, the address
 * appears in a field, selected, so it can be copied by hand.
 */
export function CopyLink({ post }: { post: PorchPost }) {
  const address = `https://${shortAddress(post.slug)}`;
  const [state, setState] = useState<'idle' | 'copied' | 'manual'>('idle');
  const field = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (state === 'manual') field.current?.select();
    if (state !== 'copied') return;
    const t = window.setTimeout(() => setState('idle'), 2500);
    return () => window.clearTimeout(t);
  }, [state]);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(address);
      setState('copied');
    } catch {
      setState('manual');
    }
  };
  return (
    <span className="pf-copy">
      <button type="button" className="pf-icon-btn" aria-label={`Copy the link to “${post.title}”`} onClick={() => void copy()}>
        <LinkIcon />
      </button>
      <span className="pf-copy-status" aria-live="polite">
        {state === 'copied' ? 'Copied' : ''}
      </span>
      {state === 'manual' && (
        <input
          ref={field}
          className="pf-copy-field"
          readOnly
          value={address}
          aria-label="The post's short link, selected to copy"
          onBlur={() => setState('idle')}
        />
      )}
    </span>
  );
}

const CalendarIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="5" width="18" height="16" rx="3" />
    <path d="M8 3v4M16 3v4M3 10h18" />
  </svg>
);

/**
 * A disclosure (works without JavaScript) with the calendar file for Apple,
 * Outlook and most phones, and a Google Calendar link.
 */
export function AddToCalendar({ post }: { post: PorchPost }) {
  if (!post.event_start) return null;
  const url = pageUrl(post);
  return (
    <details className="pf-cal">
      <summary className="pf-btn pf-btn-ghost">
        <CalendarIcon /> Add to calendar
      </summary>
      <div className="pf-cal-menu">
        <a href={icsDataUrl(post, url)} download={`${post.slug}.ics`}>
          Apple, Outlook, or phone <small>(.ics file)</small>
        </a>
        <a href={googleCalendarUrl(post, url)} target="_blank" rel="noopener">
          Google Calendar <span className="sr-only">(opens in a new tab)</span>
        </a>
      </div>
    </details>
  );
}
