import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import { pathways } from "./programsData";
import { ArrowDown, ChevronRight } from "lucide-react";

const ease = [0.22, 1, 0.36, 1] as const;

export function ProgramsHero() {
  const prefersReduced = useReducedMotion();
  const { scrollY } = useScroll();
  const parallaxY = useTransform(scrollY, [0, 600], [0, prefersReduced ? 0 : -40]);
  const blurDrift = useTransform(scrollY, [0, 600], [0, prefersReduced ? 0 : 20]);

  const scrollToExplore = () => {
    document.getElementById("pathway-hub")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-[92vh] flex items-center overflow-hidden isolate" style={{ backgroundColor: "#0f1b2d" }}>
      {/* Ambient glow blobs */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute w-[600px] h-[600px] rounded-full will-change-transform"
          animate={prefersReduced ? {} : {
            x: [0, 30, -20, 0],
            y: [0, -20, 15, 0],
          }}
          transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
          style={{
            background: "radial-gradient(circle, #9E509F 0%, transparent 70%)",
            filter: "blur(140px)",
            top: "-10%",
            left: "-15%",
            opacity: 0.2,
            y: blurDrift,
          }}
        />
        <motion.div
          className="absolute w-[500px] h-[500px] rounded-full will-change-transform"
          animate={prefersReduced ? {} : {
            x: [0, -25, 20, 0],
            y: [0, 30, -15, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          style={{
            background: "radial-gradient(circle, #FDB515 0%, transparent 70%)",
            filter: "blur(120px)",
            bottom: "-5%",
            right: "-10%",
            opacity: 0.14,
          }}
        />
        <motion.div
          className="absolute w-[400px] h-[400px] rounded-full will-change-transform"
          animate={prefersReduced ? {} : {
            x: [0, 20, -15, 0],
            y: [0, -25, 10, 0],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
          style={{
            background: "radial-gradient(circle, #E03694 0%, transparent 70%)",
            filter: "blur(110px)",
            top: "40%",
            left: "40%",
            opacity: 0.12,
          }}
        />
      </div>

      {/* Film grain overlay */}
      <div
        className="absolute inset-0 pointer-events-none mix-blend-overlay -z-[5]"
        style={{
          opacity: 0.03,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: "128px 128px",
        }}
      />

      {/* Content grid: left copy + right pathway cards */}
      <motion.div
        className="relative z-10 w-full max-w-6xl mx-auto px-5 sm:px-8 py-24 sm:py-28"
        style={{ y: parallaxY }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left — Copy */}
          <div className="text-center lg:text-left">
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease, delay: 0.1 }}
              className="text-[2.25rem] sm:text-[3rem] lg:text-[3.25rem] tracking-tight text-white leading-[1.1]"
              style={{ fontFamily: "Manrope, sans-serif", fontWeight: 700 }}
            >
              Find Your Pathway
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease, delay: 0.3 }}
              className="mt-5 text-[1.0625rem] sm:text-[1.125rem] leading-relaxed max-w-md mx-auto lg:mx-0"
              style={{ color: "rgba(255,255,255,0.7)" }}
            >
              SparkPoint builds programs that listen to communities, develop
              practical resilience, and guide collaborative action.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease, delay: 0.5 }}
              className="flex flex-col sm:flex-row items-center lg:items-start gap-3 mt-9"
            >
              <button
                onClick={scrollToExplore}
                className="px-7 py-3 rounded-xl text-white text-[0.9375rem] transition-all duration-200 hover:brightness-110 cursor-pointer"
                style={{ backgroundColor: "#E03694", fontWeight: 500 }}
              >
                Explore Programs
              </button>
              <a
                href="#cta"
                className="px-7 py-3 rounded-xl text-[0.9375rem] text-white/90 transition-all duration-200 hover:bg-white/10"
                style={{ fontWeight: 500, border: "1px solid rgba(255,255,255,0.18)" }}
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
              className="mt-8 inline-flex items-center gap-1.5 text-[0.8125rem] text-white/50 hover:text-white/75 transition-colors cursor-pointer group"
              style={{ fontWeight: 400 }}
            >
              Not sure where you fit?
              <span className="inline-flex items-center gap-0.5" style={{ color: "#E03694", fontWeight: 500 }}>
                Take 20 seconds
                <ChevronRight size={13} className="transition-transform group-hover:translate-x-0.5" />
              </span>
            </motion.button>
          </div>

          {/* Right — Floating pathway preview cards */}
          <div className="relative flex flex-col gap-4 sm:gap-5 max-w-sm mx-auto lg:mx-0 lg:ml-auto w-full">
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
                className="group text-left rounded-2xl p-5 sm:p-6 backdrop-blur-sm transition-all duration-300 cursor-pointer border"
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
                    className="text-[1rem] text-white"
                    style={{ fontFamily: "Manrope, sans-serif", fontWeight: 600 }}
                  >
                    {pw.label}
                  </span>
                  <span className="ml-auto text-[0.75rem] text-white/30" style={{ fontWeight: 500 }}>
                    {pw.programs.length} programs
                  </span>
                </div>
                <p className="text-[0.8125rem] leading-relaxed line-clamp-2" style={{ color: "rgba(255,255,255,0.5)" }}>
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
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
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