import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { Link } from "react-router";
import { ArrowDown } from "lucide-react";

const ease = [0.22, 1, 0.36, 1] as const;

export function ProgramsHero() {
  const prefersReduced = useReducedMotion();
  const { scrollY } = useScroll();
  const parallaxY = useTransform(scrollY, [0, 600], [0, prefersReduced ? 0 : -40]);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="sp-prog-hero">
      <motion.div className="sp-prog-hero-inner" style={{ y: parallaxY }}>
        <div className="mx-auto max-w-4xl text-center">
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease }}
            className="text-[0.8rem] font-semibold uppercase tracking-[0.2em] text-[#FDB515]"
          >
            SparkPoint Programs
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease, delay: 0.08 }}
            className="sp-prog-h1 mt-5"
          >
            Programs that strengthen connection, well-being, and resilience.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease, delay: 0.18 }}
            className="sp-prog-subhead mt-6 mx-auto max-w-2xl"
          >
            Explore SparkPoint's work across Listen, Learn, and Lead, and find the programs that fit your community, school, organization, or next step.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease, delay: 0.28 }}
            className="mt-10 mx-auto max-w-xl text-[0.98rem] italic leading-[1.55] text-white/70"
          >
            Pick a pathway. Step inside a program. See what it feels like from the inside.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease, delay: 0.36 }}
            className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:flex-wrap"
          >
            <button
              type="button"
              onClick={() => scrollToSection("programs-gallery")}
              className="sp-prog-cta-button sp-prog-cta-button-primary"
              style={{ backgroundColor: "#E03694", fontWeight: 500 }}
            >
              Explore programs
            </button>
            <Link
              to="/intake?intent=contact"
              className="inline-flex items-center justify-center rounded-full px-5 py-3 text-[0.9rem] font-semibold text-white/80 transition-colors hover:text-white"
            >
              Talk with us
            </Link>
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1, duration: 0.6 }}
        className="sp-prog-hero-scroll flex flex-col items-center gap-2"
      >
        <motion.div
          animate={prefersReduced ? {} : { y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <ArrowDown size={16} style={{ color: "rgba(255,255,255,0.3)" }} />
        </motion.div>
      </motion.div>

      <div className="absolute bottom-0 left-0 right-0" style={{ filter: "drop-shadow(0 -1px 4px rgba(0,0,0,0.03))" }}>
        <svg
          viewBox="0 0 1440 60"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full block"
          preserveAspectRatio="none"
          style={{ height: "clamp(32px, 4vw, 60px)" }}
        >
          <path d="M0 60V20C360 0 720 5 1080 15C1260 20 1380 28 1440 20V60H0Z" fill="#FAFAF8" />
        </svg>
      </div>
    </section>
  );
}
