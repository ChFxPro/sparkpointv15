'use client';

import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'motion/react';
import { useAccessibility } from '../context/AccessibilityContext';
import { StoryCollectionPromoCard } from './StoryCollectionPromo';
import { CommonGroundPromoCard, isCommonGroundPromoActive } from './CommonGroundPromo';
import { ACTIVE_STORY_COLLECTIONS } from '../data/storyCollections';

const ROTATE_INTERVAL_MS = 8000;
const FADE_DURATION_MS = 400;

export function HomePromoCarousel() {
  const rawSlides = [
    ACTIVE_STORY_COLLECTIONS.length > 0
      ? { key: 'story-collection', render: () => <StoryCollectionPromoCard /> }
      : null,
    isCommonGroundPromoActive()
      ? { key: 'common-ground', render: () => <CommonGroundPromoCard /> }
      : null,
  ];
  const slides = rawSlides.filter((slide): slide is NonNullable<typeof slide> => slide !== null);

  const [displayIndex, setDisplayIndex] = useState(0);
  const [visible, setVisible] = useState(true);
  const [paused, setPaused] = useState(false);
  const pendingIndexRef = useRef<number | null>(null);
  const systemReducedMotion = useReducedMotion();
  const { motionPreference } = useAccessibility();
  const prefersReducedMotion = systemReducedMotion || motionPreference === 'reduce';

  const goTo = (index: number) => {
    if (index === displayIndex) return;
    if (prefersReducedMotion) {
      setDisplayIndex(index);
      return;
    }
    pendingIndexRef.current = index;
    setVisible(false);
  };

  // Cross-fades via a plain CSS opacity transition: fade the current slide out,
  // swap its content while invisible, then fade the next one in. Avoids relying
  // on framer-motion's AnimatePresence exit-completion callback for this swap.
  useEffect(() => {
    if (visible || pendingIndexRef.current === null) return;
    const timeout = setTimeout(() => {
      setDisplayIndex(pendingIndexRef.current!);
      pendingIndexRef.current = null;
      setVisible(true);
    }, FADE_DURATION_MS);
    return () => clearTimeout(timeout);
  }, [visible]);

  useEffect(() => {
    if (prefersReducedMotion || paused || slides.length < 2) return;
    const interval = setInterval(() => {
      goTo((displayIndex + 1) % slides.length);
    }, ROTATE_INTERVAL_MS);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slides.length, prefersReducedMotion, paused, displayIndex]);

  if (slides.length === 0) return null;

  const activeSlide = slides[displayIndex % slides.length];

  return (
    <section
      className="relative px-6 py-8 md:py-10"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="mx-auto max-w-6xl">
        <div
          className="transition-opacity ease-out"
          style={{ transitionDuration: `${FADE_DURATION_MS}ms`, opacity: visible ? 1 : 0 }}
        >
          {activeSlide.render()}
        </div>

        {slides.length > 1 && (
          <div className="mt-4 flex justify-center gap-2" role="tablist" aria-label="Homepage promotions">
            {slides.map((slide, index) => (
              <button
                key={slide.key}
                type="button"
                role="tab"
                aria-selected={index === displayIndex}
                onClick={() => goTo(index)}
                className="h-2.5 w-2.5 rounded-full transition-all"
                style={{
                  backgroundColor: index === displayIndex ? '#123d34' : '#D1D5DB',
                  transform: index === displayIndex ? 'scale(1.2)' : 'scale(1)',
                }}
                aria-label={`Show promotion ${index + 1} of ${slides.length}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
