import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router";
import { ProgramsHero } from "./ProgramsHero";
import { EcosystemSection } from "./EcosystemSection";
import { AllProgramsSection } from "./AllProgramsSection";
import { PathwayModal } from "./PathwayModal";
import { getProgramBySlug, pathways, type Pathway, type Program } from "./programsData";
import "./programs.css";

type AudienceSegment = "community" | "volunteer" | "partner";

const audienceSegmentConfig: Record<
  AudienceSegment,
  { label: string; audiences: string[]; ctaLabel: string; ctaHref: string }
> = {
  community: {
    label: "Community",
    audiences: ["Community", "Residents", "Youth", "Volunteers"],
    ctaLabel: "Connect With Us",
    ctaHref: "/intake?intent=contact",
  },
  volunteer: {
    label: "Volunteer",
    audiences: ["Volunteers", "Community", "Residents", "Teams"],
    ctaLabel: "See Ways To Get Involved",
    ctaHref: "/get-involved",
  },
  partner: {
    label: "Partner",
    audiences: ["Partners", "Organizations", "Leaders", "Nonprofits", "Schools"],
    ctaLabel: "Partner With Us",
    ctaHref: "/intake?intent=partner",
  },
};

export default function ProgramsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activePathway, setActivePathway] = useState<Pathway | null>(null);
  const [activeProgram, setActiveProgram] = useState<Program | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [audienceSegment, setAudienceSegment] = useState<AudienceSegment>("community");

  const segmentConfig = useMemo(() => audienceSegmentConfig[audienceSegment], [audienceSegment]);

  const setProgramParam = useCallback((slug: string | null) => {
    setSearchParams((prev) => {
      const currentSlug = prev.get("program");
      if ((currentSlug ?? null) === slug) {
        return prev;
      }

      const next = new URLSearchParams(prev);
      if (slug) {
        next.set("program", slug);
      } else {
        next.delete("program");
      }
      return next;
    }, { replace: true });
  }, [setSearchParams]);

  const handleOpenPathway = useCallback((pathway: Pathway) => {
    setActiveProgram(null);
    setActivePathway(pathway);
    setModalOpen(true);
    setProgramParam(null);
  }, [setProgramParam]);

  const handleOpenProgram = useCallback((pathway: Pathway, program: Program) => {
    setActiveProgram(program);
    setActivePathway(pathway);
    setModalOpen(true);
    setProgramParam(program.slug);
  }, [setProgramParam]);

  const handleProgramChange = useCallback((program: Program | null) => {
    setActiveProgram(program);
    setProgramParam(program?.slug ?? null);
  }, [setProgramParam]);

  const handleCloseModal = useCallback(() => {
    setModalOpen(false);
    setActiveProgram(null);
    setActivePathway(null);
    setProgramParam(null);
  }, [setProgramParam]);

  useEffect(() => {
    const programSlug = searchParams.get("program");
    if (!programSlug) return;

    const matchedProgram = getProgramBySlug(programSlug);
    if (!matchedProgram) return;

    const matchedPathway = pathways.find((pathway) => pathway.id === matchedProgram.pathway);
    if (!matchedPathway) return;

    setActivePathway(matchedPathway);
    setActiveProgram(matchedProgram);
    setModalOpen(true);
  }, [searchParams]);

  return (
    <div className="sp-programs">
      <ProgramsHero
        audienceSegment={audienceSegment}
        onAudienceSegmentChange={setAudienceSegment}
        secondaryCtaHref={segmentConfig.ctaHref}
        secondaryCtaLabel={segmentConfig.ctaLabel}
      />

      <section id="ecosystem" className="sp-scroll-offset">
        <EcosystemSection
          onOpenPathway={handleOpenPathway}
          onOpenProgram={handleOpenProgram}
        />
      </section>

      <section id="view-all" className="sp-scroll-offset">
        <AllProgramsSection
          onOpenProgram={handleOpenProgram}
          recommendedAudiences={segmentConfig.audiences}
          recommendationLabel={segmentConfig.label}
        />
      </section>

      <section id="cta" className="sp-scroll-offset sp-prog-cta">
        <div className="max-w-5xl mx-auto px-5 sm:px-8 text-center">
          <h2 className="sp-prog-cta-title">
            Ready to Build With Us?
          </h2>
          <p className="sp-prog-cta-body">
            Tell us what you are working on, what support you need, and how SparkPoint programs can align.
          </p>
          <div className="sp-prog-cta-actions">
            <Link
              to="/intake?intent=contact"
              className="sp-prog-cta-button sp-prog-cta-button-primary"
            >
              Talk With Us
            </Link>
            <Link
              to="/get-involved"
              className="sp-prog-cta-button sp-prog-cta-button-secondary"
            >
              Get Involved
            </Link>
          </div>
        </div>
      </section>

      <PathwayModal
        pathway={modalOpen ? activePathway : null}
        initialProgram={activeProgram}
        onProgramChange={handleProgramChange}
        onClose={handleCloseModal}
      />
    </div>
  );
}
