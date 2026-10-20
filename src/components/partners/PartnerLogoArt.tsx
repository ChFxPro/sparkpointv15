import { useState } from 'react';
import { partnerLogo } from '../partnerLogos';

// A partner's logo, optically sized: every logo gets about the same visual area,
// so a round seal shows taller and a long wordmark shorter, instead of all
// sharing one height. All-white logos (`-ink` files) are drawn as their shape
// in near-black. Used by the homepage partner wall and the /partners directory.

const ratios = new Map<string, number>();

export function PartnerLogoArt({
  name,
  area = 8200,
  minH = 34,
  maxH = 76,
  className = '',
  decorative = false,
}: {
  name: string;
  /** Target visual area in px². */
  area?: number;
  minH?: number;
  maxH?: number;
  className?: string;
  /** Hide from assistive tech when the name is announced elsewhere. */
  decorative?: boolean;
}) {
  const art = partnerLogo(name);
  const [ratio, setRatio] = useState(() => (art ? ratios.get(art.src) ?? 2.4 : 2.4));
  if (!art) return null;
  const height = Math.round(Math.max(minH, Math.min(maxH, Math.sqrt(area / ratio))));
  const width = Math.round(height * ratio);
  const measure = (w: number, h: number) => {
    if (w && h) {
      ratios.set(art.src, w / h);
      setRatio(w / h);
    }
  };
  if (art.ink) {
    return (
      <>
        {/* Measure the file's proportions; the visible logo is the mask below. */}
        <img src={art.src} alt="" aria-hidden="true" className="hidden" onLoad={(e) => measure(e.currentTarget.naturalWidth, e.currentTarget.naturalHeight)} />
        <span
          role={decorative ? undefined : 'img'}
          aria-label={decorative ? undefined : name}
          aria-hidden={decorative || undefined}
          className={`block max-w-full ${className}`}
          style={{
            height,
            width,
            backgroundColor: 'var(--partner-ink, #2a2a2a)',
            mask: `url("${art.src}") center / contain no-repeat`,
            WebkitMask: `url("${art.src}") center / contain no-repeat`,
          }}
        />
      </>
    );
  }
  return (
    <img
      src={art.src}
      alt={decorative ? '' : name}
      aria-hidden={decorative || undefined}
      className={`max-w-full object-contain ${className}`}
      style={{ height, width }}
      loading="lazy"
      decoding="async"
      onLoad={(e) => measure(e.currentTarget.naturalWidth, e.currentTarget.naturalHeight)}
    />
  );
}
