import type { Program } from "../../programsData";

interface ProgramOutcomesProps {
  program: Program;
}

export function ProgramOutcomes({ program }: ProgramOutcomesProps) {
  return (
    <section
      className="px-4 py-14 sm:px-6 sm:py-16 lg:px-8"
      style={{ backgroundColor: "var(--program-accent-soft)" }}
    >
      <div className="mx-auto max-w-3xl">
        <h2
          className="text-[1.5rem] font-bold leading-tight tracking-[-0.02em] sm:text-[1.75rem]"
          style={{ color: "var(--program-ink)" }}
        >
          Outcomes
        </h2>

        <ol className="mt-8 space-y-4 counter-reset-[outcomes]" role="list">
          {program.outcomes.map((outcome, index) => (
            <li
              key={outcome}
              className="flex items-start gap-4 text-[0.97rem] leading-[1.65]"
              style={{ color: "var(--program-ink)" }}
            >
              <span
                className="mt-[0.1em] flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[0.7rem] font-bold text-white"
                style={{ backgroundColor: "var(--program-accent)" }}
                aria-hidden="true"
              >
                {index + 1}
              </span>
              {outcome}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
