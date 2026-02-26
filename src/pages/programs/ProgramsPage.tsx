import { useState } from "react";
import { Link } from "react-router";
import { ProgramsHero } from "./ProgramsHero";
import { EcosystemSection } from "./EcosystemSection";
import { AllProgramsSection } from "./AllProgramsSection";
import { PathwayModal } from "./PathwayModal";
import type { Pathway, Program } from "./programsData";
import "./programs.css";

export default function ProgramsPage() {
  const [activePathway, setActivePathway] = useState<Pathway | null>(null);
  const [activeProgram, setActiveProgram] = useState<Program | null>(null);

  const handleOpenPathway = (pathway: Pathway) => {
    setActiveProgram(null);
    setActivePathway(pathway);
  };

  const handleOpenProgram = (pathway: Pathway, program: Program) => {
    setActiveProgram(program);
    setActivePathway(pathway);
  };

  const handleCloseModal = () => {
    setActiveProgram(null);
    setActivePathway(null);
  };

  return (
    <div className="sp-programs">
      <ProgramsHero />

      <section id="ecosystem" className="sp-scroll-offset">
        <EcosystemSection
          onOpenPathway={handleOpenPathway}
          onOpenProgram={handleOpenProgram}
        />
      </section>

      <section id="view-all" className="sp-scroll-offset">
        <AllProgramsSection onOpenProgram={handleOpenProgram} />
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
        pathway={activePathway}
        initialProgram={activeProgram}
        onClose={handleCloseModal}
      />
    </div>
  );
}
