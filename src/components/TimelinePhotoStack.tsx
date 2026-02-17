'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';

type TimelineImage =
  | string
  | {
      src: string;
      caption?: string;
    };

interface TimelinePhotoStackProps {
  images: TimelineImage[];
  label?: string;
  milestoneYear?: string;
}

function TimelinePhotoStack({ images, label, milestoneYear }: TimelinePhotoStackProps) {
  const safeImages = (images ?? [])
    .filter(Boolean)
    .map((img) => {
      if (typeof img === 'string') return { src: img, caption: '' };
      return { src: img.src, caption: img.caption ?? '' };
    })
    .filter((img) => Boolean(img.src));
  const hasMany = safeImages.length > 1;

  // which image is currently on top
  const [topIndex, setTopIndex] = useState(0);

  useEffect(() => {
    if (!safeImages.length) return;
    if (topIndex >= safeImages.length) setTopIndex(0);
  }, [safeImages.length, topIndex]);

  // Order images starting from current topIndex
  const ordered = useMemo(() => {
    if (!safeImages.length) return [];
    const head = safeImages.slice(topIndex);
    const tail = safeImages.slice(0, topIndex);
    return [...head, ...tail];
  }, [safeImages, topIndex]);

  // Show up to 3 images for the visual stack
  const stackImages = ordered.slice(0, 3);

  // Fixed rotations for the visual stack to look "curated"
  const rotations = [-1.5, 1.2, -0.8];

  const handleShuffle = () => {
    if (!hasMany) return;
    setTopIndex((prev) => (prev + 1) % safeImages.length);
  };

  // Variants for the cards
  const variants = {
    top: {
      opacity: 1,
      y: 0,
      x: 0,
      rotate: rotations[0],
      scale: 1,
      transition: { type: 'spring', stiffness: 420, damping: 34, mass: 0.9 },
    },
    mid: {
      opacity: 1,
      y: 10,
      x: 3,
      rotate: rotations[1],
      scale: 1,
      transition: { type: 'spring', stiffness: 420, damping: 34, mass: 0.9 },
    },
    back: {
      opacity: 1,
      y: 20,
      x: 6,
      rotate: rotations[2],
      scale: 0.985,
      transition: { type: 'spring', stiffness: 420, damping: 34, mass: 0.9 },
    },
  };

  return (
    <div className="flex flex-col items-center group/stack">
      <button
        type="button"
        onClick={handleShuffle}
        className={`relative ${hasMany ? 'cursor-pointer' : 'cursor-default'} focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E03694]/60 rounded-2xl`}
        aria-label={hasMany ? `Shuffle photos for ${label ?? 'timeline item'}` : `Photo for ${label ?? 'timeline item'}`}
      >
        {/* Slightly larger overall */}
        <div
          className="relative"
          style={{
            width: 'clamp(240px, 28vw, 360px)',
            aspectRatio: '4 / 3',
          }}
        >
          {stackImages.map((img, index) => {
            const pos = index === 0 ? 'top' : index === 1 ? 'mid' : 'back';

            // Top card gets the “to back” lift on shuffle via a quick keyframe-like hop
            const topHop = {
              opacity: 1,
              y: [0, -8, 20],
              x: [0, 2, 6],
              rotate: [rotations[0], rotations[0] + 2, rotations[2]],
              scale: [1, 1.01, 0.985],
              transition: { duration: 0.34, ease: 'easeOut' },
            };

            const animateTarget = (index === 0 && topIndex > 0 && pos === 'top')
              ? (topHop as any)
              : (variants[pos] as any);

            const isTop = index === 0;
            const zIndex = 30 - index * 10;

            return (
              <motion.div
                key={img.src}
                className="absolute inset-0 bg-white p-2 rounded-xl shadow-lg border-2 border-white transition-transform duration-300 ease-out"
                style={{ zIndex }}
                initial={false}
                animate={animateTarget}
                whileHover={isTop ? { y: -6 } : {}}
                layout
              >
                <div className="w-full h-full overflow-hidden rounded-lg bg-gray-100 relative">
                  <img
                    src={img.src}
                    alt={img.caption || `${label ?? 'timeline item'} photo`}
                    className="w-full h-full object-cover"
                    draggable={false}
                    loading="lazy"
                    decoding="async"
                  />
                  {!isTop && <div className="absolute inset-0 bg-black/10" />}
                  {isTop && hasMany && (
                    <div className="absolute inset-0 opacity-0 group-hover/stack:opacity-100 transition-opacity duration-300">
                      <div className="absolute inset-0 bg-black/5" />
                      <div className="absolute bottom-3 right-3 bg-black/55 backdrop-blur-sm rounded-full px-3 py-1 text-[11px] font-semibold text-white shadow-xl">
                        Click to shuffle
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </button>

      {/* Caption & Interaction */}
      <div className="mt-8 flex flex-col items-center gap-2">
        {label && (
          <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] font-medium tracking-wider text-white/60 uppercase">
            {label}
          </span>
        )}

        {hasMany ? (
          <span className="text-xs text-[#E03694] font-semibold">
            Shuffle photos <span className="w-1 h-1 inline-block rounded-full bg-current mx-2 align-middle" /> {safeImages.length} photos
          </span>
        ) : (
          <span className="text-xs text-white/30">{safeImages.length ? '1 photo' : 'No photos'}</span>
        )}

        {safeImages.length > 0 && ordered[0]?.src && !String(ordered[0].src).startsWith('figma:asset') && (
          <a
            href={ordered[0].src}
            target="_blank"
            rel="noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="text-[11px] text-white/40 hover:text-white/70 transition-colors"
          >
            Open image
          </a>
        )}

        {milestoneYear && (
          <span className="text-[10px] text-white/35 uppercase tracking-widest">{milestoneYear}</span>
        )}
      </div>
    </div>
  );
}

export { TimelinePhotoStack };
export default TimelinePhotoStack;
