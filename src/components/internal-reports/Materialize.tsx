import { motion, useReducedMotion } from 'motion/react';
import type { ReactNode } from 'react';

// "Materialize, don't just fade" — for glass/blur surfaces, animate blur
// radius and scale together on entrance so the panel reads as a real
// material arriving, not a plain opacity fade. Skips entirely under
// prefers-reduced-motion (a static render, not a faster version of the
// same animation).
export function Materialize({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <>{children}</>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97, filter: 'blur(6px)' }}
      animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
      transition={{ type: 'spring', bounce: 0, duration: 0.5, delay }}
    >
      {children}
    </motion.div>
  );
}
