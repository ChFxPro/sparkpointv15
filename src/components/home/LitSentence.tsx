import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from 'motion/react';
import { useAccessibility } from '../../context/AccessibilityContext';

// One sentence that says what SparkPoint does, opening the programs section. Its words light up in reading order as it scrolls through
// the viewport. The whole sentence is always in the DOM as plain text; only
// the opacity is driven by scroll.
const WORDS = 'We listen for what our community needs, then find the people who can help.'.split(' ');
const ACCENT_FROM = WORDS.length - 3; // "who can help."

function Word({ word, index, progress }: { word: string; index: number; progress: MotionValue<number> }) {
  const start = index / WORDS.length;
  const opacity = useTransform(progress, [start, start + 1.5 / WORDS.length], [0.22, 1]);
  return (
    <motion.span style={{ opacity }} className={index >= ACCENT_FROM ? 'text-[var(--home-pink)]' : undefined}>
      {word}{' '}
    </motion.span>
  );
}

export function LitSentence() {
  const ref = useRef<HTMLParagraphElement>(null);
  const systemReducedMotion = useReducedMotion();
  const { motionPreference } = useAccessibility();
  const reducedMotion = Boolean(systemReducedMotion) || motionPreference === 'reduce';
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'end 0.45'] });

  return (
    <p
      ref={ref}
      className="home-display max-w-5xl text-[var(--home-plum)]"
      style={{ fontSize: 'clamp(2rem, 4.6vw, 4rem)', lineHeight: 1.12, letterSpacing: '-0.03em' }}
    >
      {reducedMotion
        ? WORDS.map((w, i) => (
            <span key={i} className={i >= ACCENT_FROM ? 'text-[var(--home-pink)]' : undefined}>
              {w}{' '}
            </span>
          ))
        : WORDS.map((w, i) => <Word key={i} word={w} index={i} progress={scrollYProgress} />)}
    </p>
  );
}
