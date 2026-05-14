import { Link } from "react-router";
import { ArrowRight } from "lucide-react";
import {
  getFormatLabel,
  getOfferingTypeLabel,
  pathways,
  programsWithDetailPages,
  type Program,
  type Pathway,
} from "./programsData";

interface ProgramPagesSectionProps {
  onOpenProgram: (pathway: Pathway, program: Program) => void;
}

export function ProgramPagesSection({ onOpenProgram }: ProgramPagesSectionProps) {
  if (programsWithDetailPages.length === 0) {
    return null;
  }

  return (
    <section id="program-pages" className="sp-scroll-offset bg-[#f7f5f8] py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="max-w-3xl">
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[#E03694]">
            Featured Programs
          </p>
          <h2 className="mt-3 sp-prog-section-title">
            Start with the programs that need a closer look.
          </h2>
          <p className="mt-4 sp-prog-section-subhead">
            These pages offer fuller context, clearer next steps, and a better sense of what each program is designed to do.
          </p>
        </div>

        <div className="mt-10 grid gap-4 lg:grid-cols-2">
          {programsWithDetailPages.map((program) => {
            const pathway = pathways.find((entry) => entry.id === program.pathway);
            if (!pathway || !program.detailPageHref) {
              return null;
            }

            return (
              <article
                key={program.id}
                className="group relative overflow-hidden rounded-[1.5rem] border border-black/6 bg-white p-6 shadow-[0_18px_45px_rgba(15,23,42,0.06)]"
              >
                <div
                  className="absolute inset-x-0 top-0 h-1"
                  style={{
                    background: `linear-gradient(90deg, ${pathway.color} 0%, #FDB515 100%)`,
                  }}
                />

                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: pathway.color }}
                      aria-hidden="true"
                    />
                    <span
                      className="text-[0.68rem] font-semibold uppercase tracking-[0.18em]"
                      style={{ color: pathway.color }}
                    >
                      {pathway.label}
                    </span>
                  </div>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-slate-500">
                    Featured
                  </span>
                </div>

                <h3 className="mt-5 text-[1.45rem] font-bold leading-tight tracking-[-0.02em] text-slate-900">
                  {program.title}
                </h3>
                <p className="mt-3 text-[0.98rem] leading-7 text-slate-600">
                  {program.shortDescription}
                </p>
                {program.whyItExists ? (
                  <p className="mt-4 text-[0.92rem] leading-7 text-slate-500">
                    {program.whyItExists}
                  </p>
                ) : null}

                <div className="sp-prog-card-badge-row mt-5">
                  <span className="sp-prog-badge sp-prog-badge-format">
                    {getFormatLabel(program.format)}
                  </span>
                  <span className={`sp-prog-badge sp-prog-badge-${program.offeringType}`}>
                    {getOfferingTypeLabel(program.offeringType)}
                  </span>
                </div>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <Link
                    to={program.detailPageHref}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#1A1A1A] px-5 py-3 text-[0.82rem] font-semibold uppercase tracking-[0.08em] text-white transition-all hover:bg-[#E03694]"
                  >
                    View program page
                    <ArrowRight size={15} />
                  </Link>
                  <button
                    type="button"
                    onClick={() => onOpenProgram(pathway, program)}
                    className="inline-flex items-center justify-center rounded-xl border border-slate-200 px-5 py-3 text-[0.82rem] font-semibold uppercase tracking-[0.08em] text-slate-700 transition-all hover:border-slate-300 hover:bg-slate-50"
                  >
                    Quick overview
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
