import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { PathwayModal } from "./PathwayModal";
import { ProgramsLineup } from "./lineup/ProgramsLineup";
import { getProgramBySlug, pathways, type Pathway, type Program } from "./programsData";
import { SEOHead } from "../../components/SEOHead";
import "./programs.css";

export default function ProgramsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activePathway, setActivePathway] = useState<Pathway | null>(null);
  const [activeProgram, setActiveProgram] = useState<Program | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

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
      <SEOHead
        title="Programs | SparkPoint"
        description="SparkPoint's programs, in four pathways: Listen, Learn, Lead, and Connect. Story collection, leadership and workplace series, youth voice, the TrailHead simulation, and collaborations with partners across Transylvania County and Western North Carolina."
        path="/programs"
      />

      <ProgramsLineup onOpenProgram={handleOpenProgram} />

      <PathwayModal
        pathway={modalOpen ? activePathway : null}
        initialProgram={activeProgram}
        onProgramChange={handleProgramChange}
        onClose={handleCloseModal}
      />
    </div>
  );
}
