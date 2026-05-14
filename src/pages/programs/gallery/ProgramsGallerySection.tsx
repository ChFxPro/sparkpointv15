import { useMemo, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import {
  allPrograms,
  pathways,
  type PathwayId,
  type ProgramFormatType,
  type OfferingType,
  type Program,
} from "../programsData";
import { PathwayFilterBar } from "./PathwayFilterBar";
import { ProgramCard } from "./ProgramCard";
import { PathwayBand } from "./PathwayBand";

interface ProgramsGallerySectionProps {
  onQuickPeek: (program: Program) => void;
}

// "Learn" has 11 programs — the most of any pathway. Feature it as the one band.
const FEATURED_PATHWAY_ID: PathwayId = "learn";
const featuredPathway = pathways.find((p) => p.id === FEATURED_PATHWAY_ID)!;

const containerVariants = {
  visible: {
    transition: {
      staggerChildren: 0.06,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const cardVariantsReduced = {
  hidden: { opacity: 1, y: 0 },
  visible: { opacity: 1, y: 0 },
};

export function ProgramsGallerySection({ onQuickPeek }: ProgramsGallerySectionProps) {
  const shouldReduceMotion = useReducedMotion();

  const [activePathway, setActivePathway] = useState<PathwayId | "all">("all");
  const [activeFormat, setActiveFormat] = useState<ProgramFormatType | "all">("all");
  const [activeOffering, setActiveOffering] = useState<OfferingType | "all">("all");

  const filteredPrograms = useMemo(() => {
    return allPrograms.filter((program) => {
      if (activePathway !== "all" && program.pathway !== activePathway) return false;
      if (activeFormat !== "all" && program.format.type !== activeFormat) return false;
      if (activeOffering !== "all" && program.offeringType !== activeOffering) return false;
      return true;
    });
  }, [activePathway, activeFormat, activeOffering]);

  const showBand = activePathway === "all";

  function handleFilterToPathway(id: PathwayId) {
    setActivePathway(id);
    setActiveFormat("all");
    setActiveOffering("all");
  }

  function handleReset() {
    setActivePathway("all");
    setActiveFormat("all");
    setActiveOffering("all");
  }

  return (
    <section id="programs-gallery" className="sp-scroll-offset py-12 sm:py-16">
      <PathwayFilterBar
        activePathwayId={activePathway}
        onPathwayChange={setActivePathway}
        activeFormat={activeFormat}
        onFormatChange={setActiveFormat}
        activeOffering={activeOffering}
        onOfferingChange={setActiveOffering}
      />

      <div className="pt-10">
        {/* One pathway band — shown only when "All" is active */}
        {showBand && featuredPathway && (
          <PathwayBand
            pathway={featuredPathway}
            onFilterToPathway={handleFilterToPathway}
          />
        )}

        {/* Gallery grid */}
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          {filteredPrograms.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <p className="text-[1rem] text-gray-500 mb-4">
                No programs match those filters — try clearing a filter.
              </p>
              <button
                onClick={handleReset}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-[0.78rem] font-bold uppercase tracking-[0.1em] bg-[#1A1A1A] text-white hover:bg-[#333] transition-colors"
              >
                Reset filters
              </button>
            </div>
          ) : (
            <motion.div
              key={`${activePathway}-${activeFormat}-${activeOffering}`}
              className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {filteredPrograms.map((program) => (
                <motion.div
                  key={program.id}
                  variants={shouldReduceMotion ? cardVariantsReduced : cardVariants}
                >
                  <ProgramCard
                    program={program}
                    onQuickPeek={onQuickPeek}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
