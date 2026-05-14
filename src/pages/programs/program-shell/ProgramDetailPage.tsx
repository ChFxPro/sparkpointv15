import type { Program } from "../programsData";
import { getProgramAccent, getProgramAccentSoft } from "../programsData";
import { ProgramShell } from "./ProgramShell";
import {
  BackToPrograms,
  ProgramHero,
  ProgramOverview,
  ProgramExperience,
  ProgramAudience,
  ProgramOutcomes,
  ProgramCTA,
} from "./sections";

interface ProgramDetailPageProps {
  program: Program;
}

export function ProgramDetailPage({ program }: ProgramDetailPageProps) {
  const accent = getProgramAccent(program);
  const accentSoft = getProgramAccentSoft(program);

  return (
    <ProgramShell voice={program.brand.voice} accent={accent} accentSoft={accentSoft}>
      <div
        className="relative min-h-screen overflow-x-hidden"
        style={{ backgroundColor: "var(--program-surface)" }}
      >
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-[color:var(--program-ink)] focus:px-4 focus:py-2 focus:text-white"
        >
          Skip to content
        </a>

        <BackToPrograms />
        <ProgramHero program={program} />

        <main id="main-content">
          <ProgramOverview program={program} />
          <ProgramExperience program={program} />
          <ProgramAudience program={program} />
          <ProgramOutcomes program={program} />
          <ProgramCTA program={program} />
        </main>
      </div>
    </ProgramShell>
  );
}
