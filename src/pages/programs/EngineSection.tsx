import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";

const steps = ["Listen", "Learn", "Lead", "Measure", "Repeat"] as const;
const ease = [0.22, 1, 0.36, 1] as const;

export function EngineSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: true, amount: 0.2 });
  const prefersReduced = useReducedMotion();

  return (
    <section id="engine" ref={sectionRef} className="sp-scroll-offset sp-prog-engine">
      <div className="max-w-5xl mx-auto px-5 sm:px-8">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: prefersReduced ? 0.15 : 0.45, ease }}
          className="sp-prog-section-title text-center"
        >
          How Listen • Learn • Lead Works
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: prefersReduced ? 0.15 : 0.45, delay: 0.08, ease }}
          className="sp-prog-section-subhead sp-prog-engine-copy"
        >
          We surface lived experience, build relational capacity, coordinate action,
          measure impact, and return to listening.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: prefersReduced ? 0.15 : 0.45, delay: 0.16, ease }}
          className="sp-prog-engine-rail"
          role="list"
          aria-label="Listen Learn Lead feedback loop"
        >
          {steps.map((step, index) => (
            <div key={step} role="listitem" className="sp-prog-engine-step">
              <span className="sp-prog-engine-index">{index + 1}</span>
              <span className="sp-prog-engine-label">{step}</span>
              {index < steps.length - 1 && <span className="sp-prog-engine-arrow" aria-hidden>→</span>}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
