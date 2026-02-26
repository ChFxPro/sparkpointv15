import { useRef, useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence, useInView, useReducedMotion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { pathways, type Pathway } from "./programsData";

interface EcosystemSectionProps {
  onOpenModal: (pathway: Pathway) => void;
}

const ease = [0.22, 1, 0.36, 1] as const;

const microcopy: Record<string, string> = {
  listen: "Amplify lived experience",
  learn: "Build practical resilience",
  lead: "Guide collaborative action",
};

export function EcosystemSection({ onOpenModal }: EcosystemSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.15 });
  const prefersReduced = useReducedMotion();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isSticky, setIsSticky] = useState(false);
  const stickyRef = useRef<HTMLDivElement>(null);

  const activePw = pathways.find((p) => p.id === activeId) ?? null;

  // Sticky mini-nav observer
  useEffect(() => {
    const el = stickyRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsSticky(!entry.isIntersecting),
      { threshold: 0, rootMargin: "-72px 0px 0px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const handleSelect = useCallback((id: string) => {
    setActiveId((prev) => (prev === id ? null : id));
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, id: string) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleSelect(id);
      }
    },
    [handleSelect]
  );

  return (
    <>
      {/* Sticky mini-nav */}
      <AnimatePresence>
        {isSticky && (
          <motion.div
            initial={{ y: -48, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -48, opacity: 0 }}
            transition={{ duration: prefersReduced ? 0.1 : 0.3, ease }}
            className="fixed top-[64px] sm:top-[80px] left-0 right-0 z-40 hidden md:block"
            style={{
              backgroundColor: "rgba(255,255,255,0.92)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              borderBottom: "1px solid rgba(0,0,0,0.05)",
            }}
          >
            <div className="max-w-6xl mx-auto px-8 flex items-center justify-center gap-1 h-12">
              {pathways.map((pw) => (
                <button
                  key={pw.id}
                  onClick={() => handleSelect(pw.id)}
                  className={`px-4 py-1.5 rounded-lg text-[0.8125rem] transition-all duration-200 cursor-pointer ${
                    activeId === pw.id ? "text-gray-900" : "text-gray-500 hover:text-gray-700"
                  }`}
                  style={{
                    fontWeight: activeId === pw.id ? 600 : 500,
                    backgroundColor: activeId === pw.id ? `${pw.color}10` : "transparent",
                  }}
                >
                  <span className="flex items-center gap-1.5">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: pw.color }}
                    />
                    {pw.label}
                  </span>
                </button>
              ))}
              <span className="w-px h-5 mx-2" style={{ backgroundColor: "rgba(0,0,0,0.08)" }} />
              <button
                onClick={() => {
                  document.getElementById("all-programs")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="px-3 py-1.5 rounded-lg text-[0.8125rem] text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                style={{ fontWeight: 500 }}
              >
                View All
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <section
        id="pathway-hub"
        ref={sectionRef}
        className="py-20 sm:py-24"
        style={{ backgroundColor: "#FAFAF8" }}
      >
        <div className="max-w-5xl mx-auto px-5 sm:px-8">
          {/* Section header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, ease }}
            className="text-center mb-14"
          >
            <h2
              className="text-[1.625rem] sm:text-[2rem] text-gray-900 tracking-tight"
              style={{ fontFamily: "Manrope, sans-serif", fontWeight: 600 }}
            >
              Choose a Pathway
            </h2>
            <p className="mt-3 text-[0.9375rem] sm:text-[1rem] text-gray-500 leading-relaxed max-w-lg mx-auto">
              Each pathway represents how we partner with communities.
              Select one to preview programs, or view all below.
            </p>
          </motion.div>

          {/* Intersection sentinel for sticky */}
          <div ref={stickyRef} className="h-0" aria-hidden />

          {/* Pathway selector nodes */}
          <div className="flex items-stretch justify-center gap-3 sm:gap-4" role="tablist">
            {pathways.map((pw, i) => {
              const isActive = activeId === pw.id;
              return (
                <motion.button
                  key={pw.id}
                  role="tab"
                  aria-selected={isActive}
                  aria-controls={`panel-${pw.id}`}
                  tabIndex={0}
                  initial={{ opacity: 0, y: 16 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
                  transition={{ duration: 0.45, delay: 0.15 + i * 0.1, ease }}
                  onClick={() => handleSelect(pw.id)}
                  onKeyDown={(e) => handleKeyDown(e, pw.id)}
                  className="group flex-1 max-w-[220px] flex flex-col items-center p-5 sm:p-6 rounded-2xl border-2 transition-all duration-300 cursor-pointer relative focus-visible:outline-2 focus-visible:outline-offset-2"
                  style={{
                    borderColor: isActive ? pw.color : "rgba(0,0,0,0.06)",
                    backgroundColor: isActive ? `${pw.color}06` : "white",
                    boxShadow: isActive
                      ? `0 4px 24px ${pw.color}12, 0 1px 4px rgba(0,0,0,0.04)`
                      : "0 1px 3px rgba(0,0,0,0.04)",
                    outlineColor: pw.color,
                  }}
                >
                  {/* Glow */}
                  <div
                    className="absolute -inset-2 rounded-3xl pointer-events-none transition-opacity duration-500"
                    style={{
                      background: `radial-gradient(circle, ${pw.color}08 0%, transparent 70%)`,
                      opacity: isActive ? 1 : 0,
                    }}
                  />
                  {/* Node dot */}
                  <div
                    className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center border-2 transition-all duration-300 bg-white"
                    style={{
                      borderColor: pw.color,
                      transform: isActive ? "scale(1.05)" : undefined,
                    }}
                  >
                    <div
                      className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full transition-transform duration-300"
                      style={{
                        backgroundColor: pw.color,
                        transform: isActive ? "scale(1.15)" : undefined,
                      }}
                    />
                  </div>
                  <span
                    className="relative mt-3 text-[0.9375rem] text-gray-800 transition-colors"
                    style={{ fontFamily: "Manrope, sans-serif", fontWeight: 600 }}
                  >
                    {pw.label}
                  </span>
                  <span className="relative mt-0.5 text-[0.6875rem] text-gray-400" style={{ fontWeight: 400 }}>
                    {microcopy[pw.id]}
                  </span>
                </motion.button>
              );
            })}
          </div>

          {/* Preview panel */}
          <AnimatePresence mode="wait">
            {activePw && (
              <motion.div
                key={activePw.id}
                id={`panel-${activePw.id}`}
                role="tabpanel"
                initial={{ opacity: 0, y: prefersReduced ? 0 : 16, height: 0 }}
                animate={{ opacity: 1, y: 0, height: "auto" }}
                exit={{ opacity: 0, y: prefersReduced ? 0 : -8, height: 0 }}
                transition={{ duration: prefersReduced ? 0.15 : 0.4, ease }}
                className="overflow-hidden"
              >
                <div className="pt-8 sm:pt-10">
                  {/* Pathway description bar */}
                  <div
                    className="rounded-2xl border p-6 sm:p-8 mb-5"
                    style={{
                      borderColor: "rgba(0,0,0,0.05)",
                      backgroundColor: "white",
                    }}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <div
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: activePw.color }}
                          />
                          <span
                            className="text-[0.6875rem] uppercase tracking-[0.15em]"
                            style={{ color: activePw.color, fontWeight: 600 }}
                          >
                            {activePw.label} Pathway
                          </span>
                        </div>
                        <p className="text-[0.9375rem] text-gray-600 leading-relaxed max-w-lg">
                          {activePw.description}
                        </p>
                      </div>
                      <button
                        onClick={() => onOpenModal(activePw)}
                        className="self-start sm:self-center px-5 py-2.5 rounded-xl text-[0.8125rem] text-white transition-all duration-200 hover:brightness-110 cursor-pointer flex items-center gap-2 flex-shrink-0"
                        style={{ backgroundColor: activePw.color, fontWeight: 500 }}
                      >
                        View All {activePw.programs.length}
                        <ArrowRight size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Featured programs (first 3) */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {activePw.programs.slice(0, 3).map((program, idx) => (
                      <motion.div
                        key={program.title}
                        initial={{ opacity: 0, y: prefersReduced ? 0 : 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: prefersReduced ? 0 : 0.08 + idx * 0.06, ease }}
                        className="group bg-white rounded-xl border p-5 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 cursor-pointer relative overflow-hidden"
                        style={{ borderColor: "rgba(0,0,0,0.06)" }}
                        onClick={() => onOpenModal(activePw)}
                      >
                        {/* Accent stripe */}
                        <div
                          className="absolute top-0 left-0 right-0 h-[2px]"
                          style={{ backgroundColor: activePw.color, opacity: 0.5 }}
                        />
                        <h4
                          className="text-[0.875rem] text-gray-900 mb-1.5"
                          style={{ fontWeight: 500 }}
                        >
                          {program.title}
                        </h4>
                        <p className="text-[0.8125rem] text-gray-500 leading-relaxed mb-3 line-clamp-2">
                          {program.summary}
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {program.audiences.map((t) => (
                            <span
                              key={t}
                              className="text-[0.625rem] px-2 py-0.5 rounded-full text-gray-400"
                              style={{ backgroundColor: "rgba(0,0,0,0.03)" }}
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Hint when no pathway selected */}
          {!activePw && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="mt-10 text-center text-[0.8125rem] text-gray-400"
            >
              Select a pathway above to preview programs
            </motion.p>
          )}
        </div>
      </section>
    </>
  );
}
