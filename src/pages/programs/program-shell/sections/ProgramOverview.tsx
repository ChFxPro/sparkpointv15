import type { Program } from "../../programsData";

interface ProgramOverviewProps {
  program: Program;
}

export function ProgramOverview({ program }: ProgramOverviewProps) {
  return (
    <section className="px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <div
          className="mb-5 flex items-center gap-3"
          aria-hidden="true"
        >
          <span
            className="h-px w-10"
            style={{ backgroundColor: "var(--program-accent)", opacity: 0.5 }}
          />
          <span
            className="text-[0.7rem] font-bold uppercase tracking-[0.18em] opacity-50"
            style={{ color: "var(--program-ink)" }}
          >
            About this program
          </span>
        </div>

        <p
          className="text-[1.05rem] leading-[1.75] sm:text-[1.1rem]"
          style={{ color: "var(--program-ink)" }}
        >
          {program.longDescription}
        </p>

        {program.whyItExists && (
          <div
            className="mt-8 border-l-[3px] pl-5"
            style={{ borderColor: "var(--program-accent)" }}
          >
            <p
              className="mb-1 text-[0.7rem] font-bold uppercase tracking-[0.14em] opacity-40"
              style={{ color: "var(--program-ink)" }}
            >
              Why it exists
            </p>
            <p
              className="text-[0.97rem] leading-[1.7] opacity-70"
              style={{ color: "var(--program-ink)" }}
            >
              {program.whyItExists}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
