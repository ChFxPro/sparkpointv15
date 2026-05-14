import { useReducedMotion } from "motion/react";
import {
  pathways,
  formatTypeLabels,
  offeringTypeLabels,
  type PathwayId,
  type ProgramFormatType,
  type OfferingType,
} from "../programsData";

interface PathwayFilterBarProps {
  activePathwayId: PathwayId | "all";
  onPathwayChange: (id: PathwayId | "all") => void;
  activeFormat?: ProgramFormatType | "all";
  onFormatChange?: (t: ProgramFormatType | "all") => void;
  activeOffering?: OfferingType | "all";
  onOfferingChange?: (t: OfferingType | "all") => void;
}

const formatTypes: ProgramFormatType[] = [
  "workshop",
  "series",
  "cohort",
  "event",
  "ongoing",
  "project",
  "collaborative",
];

const offeringTypes: OfferingType[] = ["community", "partner", "fee-based"];

export function PathwayFilterBar({
  activePathwayId,
  onPathwayChange,
  activeFormat,
  onFormatChange,
  activeOffering,
  onOfferingChange,
}: PathwayFilterBarProps) {
  const shouldReduceMotion = useReducedMotion();
  const showSecondary = Boolean(onFormatChange || onOfferingChange);

  return (
    <div
      className="sticky top-0 z-30 bg-[rgba(255,253,249,0.88)] backdrop-blur-md border-b border-black/6 shadow-[0_2px_12px_rgba(15,23,42,0.06)]"
      style={{
        transition: shouldReduceMotion ? "none" : "box-shadow 0.2s ease",
      }}
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        {/* Primary row — pathway chips */}
        <div className="flex items-center gap-2 py-3 flex-wrap">
          <button
            onClick={() => onPathwayChange("all")}
            className="inline-flex items-center px-4 py-1.5 rounded-full text-[0.72rem] font-bold uppercase tracking-[0.1em] border transition-all"
            style={{
              transition: shouldReduceMotion ? "none" : "all 0.18s ease",
              background: activePathwayId === "all" ? "#1A1A1A" : "transparent",
              color: activePathwayId === "all" ? "#fff" : "#555",
              borderColor: activePathwayId === "all" ? "#1A1A1A" : "rgba(0,0,0,0.18)",
            }}
            aria-pressed={activePathwayId === "all"}
          >
            All
          </button>

          {pathways.map((pathway) => {
            const isActive = activePathwayId === pathway.id;
            return (
              <button
                key={pathway.id}
                onClick={() => onPathwayChange(pathway.id)}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[0.72rem] font-bold uppercase tracking-[0.1em] border transition-all"
                style={{
                  transition: shouldReduceMotion ? "none" : "all 0.18s ease",
                  background: isActive ? pathway.color : "transparent",
                  color: isActive ? "#fff" : pathway.color,
                  borderColor: isActive ? pathway.color : pathway.color,
                }}
                aria-pressed={isActive}
              >
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{
                    backgroundColor: isActive ? "rgba(255,255,255,0.7)" : pathway.color,
                  }}
                  aria-hidden="true"
                />
                {pathway.label}
              </button>
            );
          })}
        </div>

        {/* Secondary row — format + offering chips */}
        {showSecondary && (
          <div className="flex items-center gap-1.5 pb-2.5 flex-wrap">
            {onFormatChange && (
              <>
                <span className="text-[0.62rem] uppercase tracking-[0.1em] text-gray-400 font-semibold mr-1">
                  Format
                </span>
                <button
                  onClick={() => onFormatChange("all")}
                  className="inline-flex items-center px-3 py-1 rounded-full text-[0.65rem] font-semibold uppercase tracking-[0.08em] border transition-all"
                  style={{
                    transition: shouldReduceMotion ? "none" : "all 0.15s ease",
                    background: activeFormat === "all" ? "rgba(0,0,0,0.08)" : "transparent",
                    color: activeFormat === "all" ? "#1A1A1A" : "#888",
                    borderColor: activeFormat === "all" ? "rgba(0,0,0,0.2)" : "rgba(0,0,0,0.1)",
                  }}
                  aria-pressed={activeFormat === "all"}
                >
                  All
                </button>
                {formatTypes.map((f) => {
                  const isActive = activeFormat === f;
                  return (
                    <button
                      key={f}
                      onClick={() => onFormatChange(f)}
                      className="inline-flex items-center px-3 py-1 rounded-full text-[0.65rem] font-semibold uppercase tracking-[0.08em] border transition-all"
                      style={{
                        transition: shouldReduceMotion ? "none" : "all 0.15s ease",
                        background: isActive ? "rgba(0,0,0,0.08)" : "transparent",
                        color: isActive ? "#1A1A1A" : "#888",
                        borderColor: isActive ? "rgba(0,0,0,0.2)" : "rgba(0,0,0,0.1)",
                      }}
                      aria-pressed={isActive}
                    >
                      {formatTypeLabels[f]}
                    </button>
                  );
                })}
              </>
            )}

            {onOfferingChange && (
              <>
                <span className="text-[0.62rem] uppercase tracking-[0.1em] text-gray-400 font-semibold ml-2 mr-1">
                  Offering
                </span>
                <button
                  onClick={() => onOfferingChange("all")}
                  className="inline-flex items-center px-3 py-1 rounded-full text-[0.65rem] font-semibold uppercase tracking-[0.08em] border transition-all"
                  style={{
                    transition: shouldReduceMotion ? "none" : "all 0.15s ease",
                    background: activeOffering === "all" ? "rgba(0,0,0,0.08)" : "transparent",
                    color: activeOffering === "all" ? "#1A1A1A" : "#888",
                    borderColor: activeOffering === "all" ? "rgba(0,0,0,0.2)" : "rgba(0,0,0,0.1)",
                  }}
                  aria-pressed={activeOffering === "all"}
                >
                  All
                </button>
                {offeringTypes.map((o) => {
                  const isActive = activeOffering === o;
                  return (
                    <button
                      key={o}
                      onClick={() => onOfferingChange(o)}
                      className="inline-flex items-center px-3 py-1 rounded-full text-[0.65rem] font-semibold uppercase tracking-[0.08em] border transition-all"
                      style={{
                        transition: shouldReduceMotion ? "none" : "all 0.15s ease",
                        background: isActive ? "rgba(0,0,0,0.08)" : "transparent",
                        color: isActive ? "#1A1A1A" : "#888",
                        borderColor: isActive ? "rgba(0,0,0,0.2)" : "rgba(0,0,0,0.1)",
                      }}
                      aria-pressed={isActive}
                    >
                      {offeringTypeLabels[o]}
                    </button>
                  );
                })}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
