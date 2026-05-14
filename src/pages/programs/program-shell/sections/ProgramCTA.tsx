import type { Program } from "../../programsData";

interface ProgramCTAProps {
  program: Program;
}

export function ProgramCTA({ program }: ProgramCTAProps) {
  return (
    <section
      className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8"
      style={{ backgroundColor: "var(--program-accent-soft)" }}
    >
      <div className="mx-auto max-w-3xl text-center">
        <h2
          className="text-[clamp(1.6rem,4vw,2.4rem)] font-bold leading-tight tracking-[-0.025em]"
          style={{ color: "var(--program-ink)" }}
        >
          Ready to explore{" "}
          <span style={{ color: "var(--program-accent)" }}>{program.title}</span>?
        </h2>

        <p
          className="mx-auto mt-4 max-w-md text-[0.97rem] leading-7 opacity-70"
          style={{ color: "var(--program-ink)" }}
        >
          {program.shortDescription}
        </p>

        <div className="mt-8">
          <a
            href={program.contactCTA.href}
            className="inline-flex items-center justify-center rounded-full px-8 py-4 text-[0.85rem] font-semibold uppercase tracking-[0.1em] text-white shadow-[0_8px_28px_rgba(0,0,0,0.15)] transition-all duration-200 hover:-translate-y-px hover:shadow-[0_12px_36px_rgba(0,0,0,0.2)] focus-visible:outline-2 focus-visible:outline-offset-4"
            style={{ backgroundColor: "var(--program-accent)" }}
          >
            {program.contactCTA.label}
          </a>
        </div>
      </div>
    </section>
  );
}
