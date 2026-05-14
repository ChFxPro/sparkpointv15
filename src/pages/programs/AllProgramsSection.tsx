import { useMemo, useRef, useState } from "react";
import { Link } from "react-router";
import { motion, useInView } from "motion/react";
import { ArrowRight, Search } from "lucide-react";
import {
  allPrograms,
  pathways,
  getFormatLabel,
  getOfferingTypeLabel,
  type Program,
  type Pathway,
} from "./programsData";

interface AllProgramsSectionProps {
  onOpenProgram: (pathway: Pathway, program: Program) => void;
}

const ease = [0.22, 1, 0.36, 1] as const;

function matchesSearch(program: Program, query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return true;

  return (
    program.title.toLowerCase().includes(q) ||
    program.shortDescription.toLowerCase().includes(q) ||
    program.longDescription.toLowerCase().includes(q) ||
    program.tags.some((tag) => tag.toLowerCase().includes(q)) ||
    program.whoItsFor.some((tag) => tag.toLowerCase().includes(q))
  );
}

function ProgramBrowseCard({
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
      className="sp-prog-card relative overflow-hidden rounded-[1.15rem] border border-black/6 bg-white p-5"
      style={{ borderColor: "rgba(0,0,0,0.06)" }}
    >
      <div
        className="sp-prog-accent-stripe"
        style={{ backgroundColor: pathway.color, opacity: 0.45 }}
      />
      <div className="mb-2 mt-0.5 flex items-center gap-1.5">
        <div className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: pathway.color }} />
        <span
          className="text-[0.625rem] uppercase tracking-[0.12em]"
          style={{ color: pathway.color, fontWeight: 600 }}
        >
          {pathway.label}
        </span>
      </div>

      <h4 className="text-[0.95rem] text-gray-900" style={{ fontWeight: 600 }}>
        {program.title}
      </h4>
      <p className="mt-2 text-[0.84rem] leading-6 text-gray-500">
        {program.shortDescription}
      </p>

      <div className="sp-prog-card-badge-row mt-4 mb-3">
        <span className="sp-prog-badge sp-prog-badge-format">{getFormatLabel(program.format)}</span>
        <span className={`sp-prog-badge sp-prog-badge-${program.offeringType}`}>
          {getOfferingTypeLabel(program.offeringType)}
        </span>
      </div>

      <div className="flex flex-wrap gap-1.5">
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

export function AllProgramsSection({ onOpenProgram }: AllProgramsSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.08 });
  const [searchQuery, setSearchQuery] = useState("");

  const groupedPrograms = useMemo(() => {
    return pathways
      .map((pathway) => ({
        pathway,
        programs: pathway.programs.filter((program) => matchesSearch(program, searchQuery)),
      }))
      .filter((group) => group.programs.length > 0);
  }, [searchQuery]);

  const totalVisiblePrograms = groupedPrograms.reduce((count, group) => count + group.programs.length, 0);
  const isSearching = searchQuery.trim().length > 0;

  return (
    <section id="all-programs" ref={ref} className="sp-scroll-offset bg-white py-16 sm:py-20">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: 0.5, ease }}
        >
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[#E03694]">
                All Programs
              </p>
              <h2 className="mt-3 sp-prog-section-title-sm">Browse the full catalog.</h2>
              <p className="mt-3 sp-prog-section-subhead">
                The full list stays grouped by pathway so it is easy to scan, compare, and search when you already know what you are looking for.
              </p>
            </div>

            <div className="relative w-full lg:max-w-[15rem]">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search title, topic, or audience..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="sp-prog-search-input"
                style={{
                  backgroundColor: "rgba(0,0,0,0.03)",
                  border: "1px solid rgba(0,0,0,0.06)",
                }}
              />
            </div>
          </div>

          <p className="sp-prog-recommendation-note mt-5">
            {isSearching
              ? `Showing ${totalVisiblePrograms} matching programs.`
              : `Showing all ${allPrograms.length} programs.`}
          </p>

          <div className="mt-10 space-y-10">
            {groupedPrograms.map(({ pathway, programs }) => (
              <section key={pathway.id} className="space-y-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: pathway.color }} aria-hidden="true" />
                      <span className="text-[0.72rem] font-semibold uppercase tracking-[0.16em]" style={{ color: pathway.color }}>
                        {pathway.label}
                      </span>
                    </div>
                    <p className="mt-3 max-w-2xl text-[0.95rem] leading-7 text-slate-600">
                      {pathway.description}
                    </p>
                  </div>
                  <p className="text-[0.8rem] font-semibold uppercase tracking-[0.08em] text-slate-400">
                    {programs.length} program{programs.length === 1 ? "" : "s"}
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {programs.map((program) => (
                    <ProgramBrowseCard
                      key={program.id}
                      pathway={pathway}
                      program={program}
                      onOpenProgram={onOpenProgram}
                    />
                  ))}
                </div>
              </section>
            ))}
          </div>

          {groupedPrograms.length === 0 && (
            <div className="py-14 text-center">
              <p className="mb-2 text-[0.875rem] text-gray-400">
                No programs match that search yet.
              </p>
              <button
                onClick={() => setSearchQuery("")}
                className="text-[0.8125rem] text-gray-500 transition-colors hover:text-gray-700"
                style={{ fontWeight: 500 }}
              >
                Clear search
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
