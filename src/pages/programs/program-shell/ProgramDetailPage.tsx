import type { Program } from "../programsData";
import { getProgramAccent, getProgramAccentSoft, getRelatedPrograms } from "../programsData";
import { ProgramShell } from "./ProgramShell";
import {
  BackToPrograms,
  ProgramHero,
  ProgramOverview,
  ProgramExperience,
  ProgramAudience,
  ProgramOutcomes,
  ProgramCTA,
  RelatedPrograms,
  type RelatedProgramItem,
} from "./sections";

interface ProgramDetailPageProps {
  program: Program;
}

// A small number of programs have an unambiguous, explicit tie to a specific
// story or resource-directory entry elsewhere on the site (the program page
// literally is what that story documents, or names that resource as a named
// partner). Those go first; the rest of the "Related" list is filled in from
// real tag overlap via getRelatedPrograms().
const EXPLICIT_RELATED: Record<string, RelatedProgramItem[]> = {
  "community-connectors": [
    {
      to: "/stories/programs/when-neighbors-become-leaders",
      kind: "Story",
      title: "When neighbors become leaders",
      blurb: "How the first Community Connectors gathering came together, straight from the source.",
    },
    {
      to: "/directory/fwrd-long-term-recovery",
      kind: "Resource",
      title: "FWRD Transylvania — Long-Term Recovery Group",
      blurb: "A Community Connectors launch partner and Hurricane Helene recovery resource.",
    },
  ],
  "echoes-from-the-community": [
    {
      to: "/stories/community-voice/week-5",
      kind: "Story",
      title: "Echoes from the Community — Week 5",
      blurb: "The latest entry in this bi-weekly column.",
    },
    {
      to: "/stories/community-voice/week-4",
      kind: "Story",
      title: "Echoes from the Community — Week 4",
      blurb: "Kindness after the storm, as told by residents.",
    },
  ],
  "story-collection-projects": [
    {
      to: "/stories/collections/rural-healthcare",
      kind: "Story collection",
      title: "Rural Health Care Stories",
      blurb: "An active story collection project gathering healthcare experiences countywide.",
    },
    {
      to: "/stories/collections/helene-recovery",
      kind: "Story collection",
      title: "Helene: One Year of Healing",
      blurb: "A completed story collection project on recovery after Hurricane Helene.",
    },
  ],
};

function buildRelatedItems(program: Program): RelatedProgramItem[] {
  const explicit = EXPLICIT_RELATED[program.slug] ?? [];
  const auto: RelatedProgramItem[] = getRelatedPrograms(program, 4).map((p) => ({
    to: `/programs/${p.slug}`,
    kind: "Program",
    title: p.title,
    blurb: p.shortDescription,
  }));

  const seen = new Set<string>();
  return [...explicit, ...auto]
    .filter((item) => (seen.has(item.to) ? false : (seen.add(item.to), true)))
    .slice(0, 4);
}

export function ProgramDetailPage({ program }: ProgramDetailPageProps) {
  const accent = getProgramAccent(program);
  const accentSoft = getProgramAccentSoft(program);
  const relatedItems = buildRelatedItems(program);

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
          <RelatedPrograms items={relatedItems} />
        </main>
      </div>
    </ProgramShell>
  );
}
