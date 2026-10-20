import type { Program } from "./programsData";

/** A program's logo, swapping to its compact version on narrow screens when it has one. */
export function ProgramLogo({ program, className, width }: { program: Program; className?: string; width?: number }) {
  if (!program.logo) return null;
  const w = width ?? program.logoWidth;
  return (
    <picture>
      {program.logoSmall && <source media="(max-width: 400px)" srcSet={program.logoSmall} />}
      <img src={program.logo} alt={program.title} className={className} style={w ? { width: w } : undefined} />
    </picture>
  );
}
