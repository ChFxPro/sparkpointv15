import { motion, useReducedMotion } from "motion/react";
import type { Program } from "../../programsData";
import { pathways, getFormatLabel } from "../../programsData";

interface ProgramHeroProps {
  program: Program;
}

const ease = [0.22, 1, 0.36, 1] as const;

const pathwayColors: Record<string, string> = {
  listen: "#9E509F",
  learn: "#FDB515",
  lead: "#E03694",
};

export function ProgramHero({ program }: ProgramHeroProps) {
  const prefersReduced = useReducedMotion();
  const pathway = pathways.find((p) => p.id === program.pathway);
  const pathwayColor = pathwayColors[program.pathway] ?? "#1a1a1a";

  const fadeUp = prefersReduced
    ? {}
    : { initial: { opacity: 0, y: 22 }, animate: { opacity: 1, y: 0 } };

  return (
    <header
      className="relative overflow-hidden px-4 pb-16 pt-10 sm:px-6 sm:pb-20 sm:pt-12 lg:px-8"
      style={{
        background:
          "linear-gradient(160deg, var(--program-surface) 0%, color-mix(in srgb, var(--program-surface) 70%, transparent) 100%)",
      }}
    >
      {/* Soft accent gradient backdrop */}
      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 10% 0%, var(--program-accent-soft) 0%, transparent 70%)",
        }}
      />

      <div className="relative mx-auto max-w-5xl">
        {/* Pathway chip + format chip */}
        <motion.div
          className="mb-6 flex flex-wrap items-center gap-2.5"
          {...fadeUp}
          transition={{ duration: 0.5, ease }}
        >
          {pathway && (
            <span
              className="inline-flex items-center rounded-full px-3.5 py-1.5 text-[0.7rem] font-bold uppercase tracking-[0.12em] text-white"
              style={{ backgroundColor: pathwayColor }}
            >
              {pathway.label}
            </span>
          )}
          <span className="inline-flex items-center rounded-full border border-[color:var(--program-ink)]/10 bg-white/70 px-3.5 py-1.5 text-[0.7rem] font-semibold uppercase tracking-[0.1em] text-[color:var(--program-ink)]/70">
            {getFormatLabel(program.format)}
          </span>
        </motion.div>

        {/* Title */}
        <motion.h1
          className="text-[clamp(2.2rem,6vw,4rem)] font-extrabold leading-[1.05] tracking-[-0.03em]"
          style={{ color: "var(--program-ink)" }}
          {...fadeUp}
          transition={{ duration: 0.55, delay: prefersReduced ? 0 : 0.06, ease }}
        >
          {program.title}
        </motion.h1>

        {/* Voice sample */}
        <motion.p
          className="mt-4 max-w-2xl text-[clamp(1.05rem,2.4vw,1.35rem)] font-medium italic leading-[1.5] opacity-60"
          style={{ color: "var(--program-ink)" }}
          {...fadeUp}
          transition={{ duration: 0.55, delay: prefersReduced ? 0 : 0.12, ease }}
        >
          "{program.brand.voiceSample}"
        </motion.p>

        {/* Short description */}
        <motion.p
          className="mt-5 max-w-xl text-[1rem] leading-7 opacity-80"
          style={{ color: "var(--program-ink)" }}
          {...fadeUp}
          transition={{ duration: 0.55, delay: prefersReduced ? 0 : 0.18, ease }}
        >
          {program.shortDescription}
        </motion.p>

        {/* CTA */}
        <motion.div
          className="mt-8"
          {...fadeUp}
          transition={{ duration: 0.5, delay: prefersReduced ? 0 : 0.24, ease }}
        >
          <a
            href={program.contactCTA.href}
            className="inline-flex items-center justify-center rounded-full px-7 py-3.5 text-[0.82rem] font-semibold uppercase tracking-[0.1em] text-white shadow-[0_8px_24px_rgba(0,0,0,0.15)] transition-all duration-200 hover:-translate-y-px hover:shadow-[0_12px_32px_rgba(0,0,0,0.2)] focus-visible:outline-2 focus-visible:outline-offset-4"
            style={{ backgroundColor: "var(--program-accent)" }}
          >
            {program.contactCTA.label}
          </a>
        </motion.div>
      </div>
    </header>
  );
}
