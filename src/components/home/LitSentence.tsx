import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from 'motion/react';
import { useAccessibility } from '../../context/AccessibilityContext';

// The sentence that closes the region zoom and leads into the programs. Its
// words light up in reading order as you scroll. The whole sentence is always
// in the DOM as plain text; only the opacity is driven by scroll. Pass
// `progress` to drive it from a pinned section's scroll instead of its own,
// and `compact` to fit it in a caption column.
const WORDS = 'Communities rooted in connection don’t just weather the storm. They build change that lasts.'.split(' ');
const ACCENT_FROM = WORDS.length - 5; // "They build change that lasts."

function Word({ word, index, progress }: { word: string; index: number; progress: MotionValue<number> }) {
  const start = index / WORDS.length;
  const opacity = useTransform(progress, [start, start + 1.5 / WORDS.length], [0.22, 1]);
  return (
    <motion.span style={{ opacity }} className={index >= ACCENT_FROM ? 'text-[var(--home-pink)]' : undefined}>
      {word}{' '}
    </motion.span>
  );
}

export function LitSentence({ progress, onDark = false, compact = false }: { progress?: MotionValue<number>; onDark?: boolean; compact?: boolean }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const systemReducedMotion = useReducedMotion();
  const { motionPreference } = useAccessibility();
  const reducedMotion = Boolean(systemReducedMotion) || motionPreference === 'reduce';
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'end 0.45'] });
  const driver = progress ?? scrollYProgress;

  return (
    <p
      ref={ref}
      className={`home-display max-w-5xl ${onDark ? 'text-white' : 'text-[var(--home-plum)]'}`}
      style={{ fontSize: compact ? 'clamp(1.875rem, 3vw, 3rem)' : 'clamp(2rem, 4.6vw, 4rem)', lineHeight: 1.12, letterSpacing: '-0.03em', textWrap: 'balance' }}
    >
      {reducedMotion
        ? WORDS.map((w, i) => (
            <span key={i} className={i >= ACCENT_FROM ? 'text-[var(--home-pink)]' : undefined}>
              {w}{' '}
            </span>
          ))
        : WORDS.map((w, i) => <Word key={i} word={w} index={i} progress={driver} />)}
    </p>
  );
}
