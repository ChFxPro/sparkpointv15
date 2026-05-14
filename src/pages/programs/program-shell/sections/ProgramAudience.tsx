import type { Program } from "../../programsData";

interface ProgramAudienceProps {
  program: Program;
}

export function ProgramAudience({ program }: ProgramAudienceProps) {
  return (
    <section className="px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="grid gap-10 sm:grid-cols-2 sm:gap-12">
          {/* Who it's for */}
          <div>
            <h2
              className="mb-6 text-[1.2rem] font-bold tracking-[-0.018em]"
              style={{ color: "var(--program-ink)" }}
            >
              Who it's for
            </h2>
            <ul className="space-y-3" role="list">
              {program.whoItsFor.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 text-[0.95rem] leading-[1.6]"
                  style={{ color: "var(--program-ink)" }}
                >
                  <span
                    className="mt-[0.4em] h-1.5 w-1.5 shrink-0 rounded-full opacity-60"
                    style={{ backgroundColor: "var(--program-accent)" }}
                    aria-hidden="true"
                  />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Ideal partners */}
          <div>
            <h2
              className="mb-6 text-[1.2rem] font-bold tracking-[-0.018em]"
              style={{ color: "var(--program-ink)" }}
            >
              Ideal partners
            </h2>
            <ul className="space-y-3" role="list">
              {program.idealPartners.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 text-[0.95rem] leading-[1.6]"
                  style={{ color: "var(--program-ink)" }}
                >
                  <span
                    className="mt-[0.4em] h-1.5 w-1.5 shrink-0 rounded-full opacity-60"
                    style={{ backgroundColor: "var(--program-accent)" }}
                    aria-hidden="true"
                  />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
