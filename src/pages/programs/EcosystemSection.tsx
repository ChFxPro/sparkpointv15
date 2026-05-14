import { useRef } from "react";
import { Link } from "react-router";
import { motion, useInView, useReducedMotion } from "motion/react";
import { ArrowRight } from "lucide-react";
import {
  pathways,
  getFormatLabel,
  getOfferingTypeLabel,
  type Pathway,
  type Program,
} from "./programsData";

interface EcosystemSectionProps {
  onOpenPathway: (pathway: Pathway) => void;
  onOpenProgram: (pathway: Pathway, program: Program) => void;
}

const ease = [0.22, 1, 0.36, 1] as const;

function PathwayProgramCard({
  pathway,
  program,
  onOpenProgram,
}: {
  pathway: Pathway;
  program: Program;
  onOpenProgram: (pathway: Pathway, program: Program) => void;
}) {
  return (
    <article
      className="sp-prog-card relative overflow-hidden rounded-[1.2rem] border border-black/6 bg-white p-5"
      style={{ borderColor: "rgba(0,0,0,0.06)" }}
    >
      <div
        className="sp-prog-accent-stripe"
        style={{ backgroundColor: pathway.color, opacity: 0.5 }}
      />
      <h4 className="text-[0.98rem] text-gray-900" style={{ fontWeight: 600 }}>
        {program.title}
      </h4>
      <p className="mt-2 text-[0.84rem] leading-6 text-gray-500">
        {program.shortDescription}
      </p>

      <div className="sp-prog-card-badge-row mt-4">
        <span className="sp-prog-badge sp-prog-badge-format">{getFormatLabel(program.format)}</span>
        <span className={`sp-prog-badge sp-prog-badge-${program.offeringType}`}>
          {getOfferingTypeLabel(program.offeringType)}
        </span>
      </div>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {program.tags.slice(0, 3).map((tag) => (
          <span
            key={`${program.id}-${tag}`}
            className="rounded-full px-2.5 py-1 text-[0.64rem] font-medium uppercase tracking-[0.08em] text-gray-400"
            style={{ backgroundColor: "rgba(0,0,0,0.025)" }}
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
        {program.detailPageHref ? (
          <Link
            to={program.detailPageHref}
            className="inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-[0.76rem] font-semibold uppercase tracking-[0.08em] text-white transition-all hover:brightness-105"
            style={{ backgroundColor: pathway.color }}
          >
            View program page
            <ArrowRight size={14} />
          </Link>
        ) : null}
        <button
          type="button"
          onClick={() => onOpenProgram(pathway, program)}
          className="inline-flex items-center justify-center rounded-xl border border-slate-200 px-4 py-2.5 text-[0.76rem] font-semibold uppercase tracking-[0.08em] text-slate-700 transition-all hover:border-slate-300 hover:bg-slate-50"
        >
          {program.detailPageHref ? "Quick overview" : "View overview"}
        </button>
      </div>
    </article>
  );
}

export function EcosystemSection({ onOpenPathway, onOpenProgram }: EcosystemSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.12 });
  const prefersReduced = useReducedMotion();

  return (
    <section
      id="pathway-hub"
      ref={sectionRef}
      className="sp-scroll-offset py-20 sm:py-24"
      style={{ backgroundColor: "#FAFAF8" }}
    >
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, ease }}
          className="mb-14 max-w-3xl"
        >
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[#E03694]">
            Browse by pathway
          </p>
          <h2 className="sp-prog-section-title mt-3">Explore SparkPoint's work through Listen, Learn, and Lead.</h2>
          <p className="sp-prog-section-subhead mt-4">
            Each pathway gathers programs with a different role in the bigger picture, from listening to community voice to building practical tools to supporting coordinated action.
          </p>
        </motion.div>

        <div className="space-y-6">
          {pathways.map((pathway, index) => (
            <motion.article
              key={pathway.id}
              initial={{ opacity: 0, y: prefersReduced ? 0 : 18 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
              transition={{ duration: 0.45, delay: prefersReduced ? 0 : 0.08 + index * 0.08, ease }}
              className="overflow-hidden rounded-[2rem] border border-black/5 bg-white p-6 shadow-[0_18px_45px_rgba(15,23,42,0.05)] sm:p-8"
            >
              <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                <div className="max-w-2xl">
                  <div className="flex items-center gap-3">
                    <span className="h-3 w-3 rounded-full" style={{ backgroundColor: pathway.color }} aria-hidden="true" />
                    <p
                      className="text-[0.72rem] font-semibold uppercase tracking-[0.18em]"
                      style={{ color: pathway.color }}
                    >
                      {pathway.label}
                    </p>
                  </div>
                  <p className="mt-4 text-[1.05rem] leading-7 text-slate-600">
                    {pathway.description}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => onOpenPathway(pathway)}
                  className="inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-[0.8rem] font-semibold uppercase tracking-[0.08em] text-white transition-all hover:brightness-105"
                  style={{ backgroundColor: pathway.color }}
                >
                  View all {pathway.programs.length}
                  <ArrowRight size={14} />
                </button>
              </div>

              <div className="mt-8 grid gap-4 lg:grid-cols-3">
                {pathway.programs.slice(0, 3).map((program) => (
                  <PathwayProgramCard
                    key={program.id}
                    pathway={pathway}
                    program={program}
                    onOpenProgram={onOpenProgram}
                  />
                ))}
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
