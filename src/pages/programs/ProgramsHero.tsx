import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import { pathways } from "./programsData";
import { ArrowDown, ChevronRight } from "lucide-react";

const ease = [0.22, 1, 0.36, 1] as const;

export function ProgramsHero() {
  const prefersReduced = useReducedMotion();
  const { scrollY } = useScroll();
  const parallaxY = useTransform(scrollY, [0, 600], [0, prefersReduced ? 0 : -40]);

  const scrollToExplore = () => {
    document.getElementById("pathway-hub")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="sp-prog-hero">
      {/* Content grid: left copy + right pathway cards */}
      <motion.div
        className="sp-prog-hero-inner"
        style={{ y: parallaxY }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left — Copy */}
          <div className="sp-prog-hero-copy">
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease, delay: 0.1 }}
              className="sp-prog-h1"
            >
              Listen. Learn. Lead. Repeat.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease, delay: 0.3 }}
              className="sp-prog-subhead"
            >
              One community feedback loop: neighbors find support and voice,
              volunteers turn care into action, and funders invest in
              resilience that keeps compounding.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease, delay: 0.5 }}
              className="sp-prog-hero-actions flex flex-col sm:flex-row items-center lg:items-start gap-3"
            >
              <button
                onClick={scrollToExplore}
                className="sp-prog-cta-button sp-prog-cta-button-primary"
                style={{ backgroundColor: "#E03694", fontWeight: 500 }}
              >
                Explore Programs
              </button>
              <a
                href="#cta"
                className="sp-prog-cta-button sp-prog-cta-button-secondary"
                style={{ fontWeight: 500 }}
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById("cta")?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Talk With Us
              </a>
            </motion.div>

            {/* Micro CTA */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              onClick={scrollToExplore}
              className="sp-prog-hero-micro inline-flex items-center gap-1.5 cursor-pointer group"
              style={{ fontWeight: 400 }}
            >
              Community member, volunteer, or funder?
              <span className="inline-flex items-center gap-0.5" style={{ color: "#E03694", fontWeight: 500 }}>
                Start where you are
                <ChevronRight size={13} className="sp-prog-chevron transition-transform" />
              </span>
            </motion.button>
          </div>

          {/* Right — Floating pathway preview cards */}
          <div className="sp-prog-pathway-list relative flex flex-col gap-4 sm:gap-5 w-full">
            {pathways.map((pw, i) => (
              <motion.button
                key={pw.id}
                initial={{ opacity: 0, x: 30, y: 10 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{
                  duration: 0.6,
                  ease,
                  delay: 0.35 + i * 0.12,
                }}
                onClick={scrollToExplore}
                className="sp-prog-hero-card sp-prog-card group text-left cursor-pointer"
                style={{
                  backgroundColor: "rgba(255,255,255,0.05)",
                  borderColor: "rgba(255,255,255,0.08)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.09)";
                  e.currentTarget.style.borderColor = `${pw.color}40`;
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.05)";
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${pw.color}20` }}
                  >
                    <div
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: pw.color }}
                    />
                  </div>
                  <span
                    className="sp-prog-hero-card-title"
                    style={{ fontFamily: "Manrope, sans-serif", fontWeight: 600 }}
                  >
                    {pw.label}
                  </span>
                  <span className="sp-prog-hero-card-count" style={{ fontWeight: 500 }}>
                    {pw.programs.length} programs
                  </span>
                </div>
                <p className="sp-prog-hero-card-desc line-clamp-2">
                  {pw.description}
                </p>
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="sp-prog-hero-scroll flex flex-col items-center gap-2"
      >
        <motion.div
          animate={prefersReduced ? {} : { y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <ArrowDown size={16} style={{ color: "rgba(255,255,255,0.3)" }} />
        </motion.div>
      </motion.div>

      {/* Bottom curve divider */}
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
