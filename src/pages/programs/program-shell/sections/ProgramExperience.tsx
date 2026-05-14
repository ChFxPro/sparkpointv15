import type { Program } from "../../programsData";

interface ProgramExperienceProps {
  program: Program;
}

export function ProgramExperience({ program }: ProgramExperienceProps) {
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
          What you'll experience
        </h2>

        <ul className="mt-8 space-y-4" role="list">
          {program.whatYoullExperience.map((item) => (
            <li
              key={item}
              className="flex items-start gap-3.5 text-[0.97rem] leading-[1.65]"
              style={{ color: "var(--program-ink)" }}
            >
              <span
                className="mt-[0.45em] h-2 w-2 shrink-0 rounded-full"
                style={{ backgroundColor: "var(--program-accent)" }}
                aria-hidden="true"
              />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
