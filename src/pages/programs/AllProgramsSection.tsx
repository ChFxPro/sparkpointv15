import { useRef, useState, useMemo } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { Search } from "lucide-react";
import {
  allPrograms,
  pathways,
  audienceFilters,
  type Program,
  type Pathway,
} from "./programsData";

interface AllProgramsSectionProps {
  onOpenProgram: (pathway: Pathway, program: Program) => void;
}

const pathwayColorMap: Record<string, string> = {
  listen: "#9E509F",
  learn: "#FDB515",
  lead: "#E03694",
};

const ease = [0.22, 1, 0.36, 1] as const;

function MiniCard({
  program,
  onSelect,
}: {
  program: Program;
  onSelect: () => void;
}) {
  const color = pathwayColorMap[program.pathway];

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-label={`View details for ${program.title}`}
      className="sp-prog-card sp-prog-card-button group"
      style={{ borderColor: "rgba(0,0,0,0.06)" }}
    >
      <div
        className="sp-prog-accent-stripe"
        style={{ backgroundColor: color, opacity: 0.4 }}
      />
      <div className="flex items-center gap-1.5 mb-2 mt-0.5">
        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
        <span
          className="text-[0.625rem] uppercase tracking-[0.12em]"
          style={{ color, fontWeight: 600 }}
        >
          {program.pathway}
        </span>
      </div>
      <h4 className="text-[0.875rem] text-gray-900 mb-1" style={{ fontWeight: 500 }}>
        {program.title}
      </h4>
      <p className="text-[0.8125rem] text-gray-500 leading-relaxed mb-2.5 line-clamp-2">
        {program.summary}
      </p>
      <div className="flex flex-wrap gap-1">
        {program.audiences.map((tag) => (
          <span
            key={tag}
            className="text-[0.625rem] px-2 py-0.5 rounded-full text-gray-400"
            style={{ backgroundColor: "rgba(0,0,0,0.025)" }}
          >
            {tag}
          </span>
        ))}
      </div>
      <span
        className="inline-flex items-center gap-1 text-[0.8125rem] mt-3 transition-colors"
        style={{ color, fontWeight: 500 }}
      >
        <span className="relative">
          Details
          <span
            className="sp-prog-card-underline absolute left-0 w-0 group-hover:w-full transition-all duration-300"
            style={{ backgroundColor: color }}
          />
        </span>
      </span>
    </button>
  );
}

export function AllProgramsSection({ onOpenProgram }: AllProgramsSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.08 });
  const prefersReduced = useReducedMotion();
  const [searchQuery, setSearchQuery] = useState("");
  const [activePathway, setActivePathway] = useState<string | null>(null);
  const [activeAudience, setActiveAudience] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let progs = allPrograms;
    if (activePathway) progs = progs.filter((p) => p.pathway === activePathway);
    if (activeAudience) progs = progs.filter((p) => p.audiences.includes(activeAudience));
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      progs = progs.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.summary.toLowerCase().includes(q)
      );
    }
    return progs;
  }, [activePathway, activeAudience, searchQuery]);

  const hasFilters = activePathway || activeAudience || searchQuery.trim();

  return (
    <section id="all-programs" ref={ref} className="sp-scroll-offset py-16 sm:py-20 bg-white">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: 0.5, ease }}
        >
          {/* Header row */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <h2
                className="sp-prog-section-title-sm"
              >
                All Programs
              </h2>
              <p className="sp-prog-muted mt-1">
                {allPrograms.length} programs across {pathways.length} pathways
              </p>
            </div>
            {/* Search */}
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="sp-prog-search-input"
                style={{
                  backgroundColor: "rgba(0,0,0,0.03)",
                  border: "1px solid rgba(0,0,0,0.06)",
                }}
              />
            </div>
          </div>

          {/* Filter chips */}
          <div className="flex flex-wrap items-center gap-2 mb-8">
            {/* Pathway filters */}
            {pathways.map((pw) => (
              <button
                key={pw.id}
                onClick={() => setActivePathway(activePathway === pw.id ? null : pw.id)}
                className={`px-3.5 py-1.5 rounded-full text-[0.75rem] border transition-all duration-200 cursor-pointer ${
                  activePathway === pw.id ? "text-white" : "text-gray-500 hover:text-gray-700 bg-white"
                }`}
                style={{
                  backgroundColor: activePathway === pw.id ? pw.color : undefined,
                  borderColor: activePathway === pw.id ? pw.color : "rgba(0,0,0,0.08)",
                  fontWeight: 500,
                }}
              >
                {pw.label}
              </button>
            ))}
            <span
              className="w-px h-5 mx-1"
              style={{ backgroundColor: "rgba(0,0,0,0.08)" }}
            />
            {audienceFilters.map((f) => (
              <button
                key={f}
                onClick={() => setActiveAudience(activeAudience === f ? null : f)}
                className={`px-3.5 py-1.5 rounded-full text-[0.75rem] border transition-all duration-200 cursor-pointer ${
                  activeAudience === f
                    ? "bg-gray-900 text-white border-gray-900"
                    : "bg-white text-gray-500 border-gray-200 hover:border-gray-300"
                }`}
                style={{ fontWeight: 500 }}
              >
                {f}
              </button>
            ))}
            {hasFilters && (
              <button
                onClick={() => {
                  setActivePathway(null);
                  setActiveAudience(null);
                  setSearchQuery("");
                }}
                className="px-3 py-1.5 text-[0.75rem] text-gray-400 hover:text-gray-600 cursor-pointer transition-colors"
                style={{ fontWeight: 500 }}
              >
                Clear all
              </button>
            )}
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((program) => {
              const pathway = pathways.find((pw) => pw.id === program.pathway);
              if (!pathway) return null;
              return (
                <MiniCard
                  key={program.title}
                  program={program}
                  onSelect={() => onOpenProgram(pathway, program)}
                />
              );
            })}
          </div>

          {filtered.length === 0 && (
            <div className="py-14 text-center">
              <p className="text-[0.875rem] text-gray-400 mb-2">
                No programs match your filters.
              </p>
              <button
                onClick={() => {
                  setActivePathway(null);
                  setActiveAudience(null);
                  setSearchQuery("");
                }}
                className="text-[0.8125rem] text-gray-500 hover:text-gray-700 cursor-pointer transition-colors"
                style={{ fontWeight: 500 }}
              >
                Clear filters
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
