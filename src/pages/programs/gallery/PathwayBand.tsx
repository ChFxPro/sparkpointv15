import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { ArrowDown } from "lucide-react";
import type { Pathway, PathwayId } from "../programsData";

interface PathwayBandProps {
  pathway: Pathway;
  onFilterToPathway: (id: PathwayId) => void;
}

export function PathwayBand({ pathway, onFilterToPathway }: PathwayBandProps) {
  const shouldReduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px 0px" });

  function handleClick() {
    onFilterToPathway(pathway.id);
    const el = document.getElementById("programs-gallery");
    if (el) {
      el.scrollIntoView({ behavior: shouldReduceMotion ? "auto" : "smooth" });
    }
  }

  return (
    <motion.div
      ref={ref}
      initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="relative overflow-hidden rounded-3xl mx-auto max-w-6xl px-5 sm:px-8 mb-10"
    >
      <div
        className="relative rounded-3xl px-8 py-12 sm:px-12 sm:py-16 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8"
        style={{
          background: `linear-gradient(135deg, ${pathway.color} 0%, ${pathway.colorLight.replace("0.08", "0.6")} 100%)`,
        }}
      >
        {/* Decorative background texture */}
        <div
          className="absolute inset-0 rounded-3xl opacity-10"
          aria-hidden="true"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 50%, rgba(255,255,255,0.4) 0%, transparent 50%),
                             radial-gradient(circle at 80% 20%, rgba(255,255,255,0.2) 0%, transparent 40%)`,
          }}
        />

        <div className="relative z-10 max-w-xl">
          <p className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-white/70 mb-2">
            Pathway
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-[-0.018em] text-white mb-4">
            {pathway.label}
          </h2>
          <p className="text-[1rem] leading-relaxed text-white/85">
            {pathway.description}
          </p>
        </div>

        <div className="relative z-10 flex-shrink-0">
          <button
            onClick={handleClick}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-[0.78rem] font-bold uppercase tracking-[0.1em] bg-white transition-all hover:bg-white/90 active:scale-95"
            style={{ color: pathway.color }}
          >
            See all {pathway.label} programs
            <ArrowDown size={14} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
