import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { X, ArrowRight, ArrowLeft, Search, Users, Sparkles, Handshake, MessageCircle } from "lucide-react";
import type { Pathway, Program } from "./programsData";

interface PathwayModalProps {
  pathway: Pathway | null;
  onClose: () => void;
}

const ease = [0.22, 1, 0.36, 1] as const;

/* ─── Program Detail Drawer ─── */
function ProgramDetail({
  program,
  color,
  onBack,
}: {
  program: Program;
  color: string;
  onBack: () => void;
}) {
  const prefersReduced = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, x: prefersReduced ? 0 : 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: prefersReduced ? 0 : 24 }}
      transition={{ duration: 0.3, ease }}
      className="flex flex-col h-full"
    >
      <div className="flex items-center gap-3 px-7 sm:px-10 pt-7 pb-5 flex-shrink-0">
        <button
          onClick={onBack}
          className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all cursor-pointer"
          aria-label="Back to programs"
        >
          <ArrowLeft size={18} />
        </button>
        <span className="text-[0.75rem] text-gray-400 uppercase tracking-[0.12em]" style={{ fontWeight: 500 }}>
          Program Detail
        </span>
      </div>

      <div className="flex-1 overflow-y-auto px-7 sm:px-10 pb-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
            <span className="text-[0.6875rem] uppercase tracking-[0.15em]" style={{ color, fontWeight: 600 }}>
              {program.pathway} pathway
            </span>
          </div>
          <h3
            className="text-[1.5rem] sm:text-[1.75rem] text-gray-900 tracking-tight mb-3"
            style={{ fontFamily: "Manrope, sans-serif", fontWeight: 700 }}
          >
            {program.title}
          </h3>
          <p className="text-[0.9375rem] text-gray-500 leading-[1.7]">
            {program.summary}
          </p>
        </div>

        {/* Detail cards */}
        <div className="space-y-5">
          <DetailBlock
            icon={<Users size={16} />}
            label="Who it's for"
            color={color}
          >
            <div className="flex flex-wrap gap-2 mt-1">
              {program.audiences.map((a) => (
                <span
                  key={a}
                  className="px-3 py-1 rounded-full text-[0.8125rem] text-gray-600"
                  style={{ backgroundColor: `${color}08`, border: `1px solid ${color}15` }}
                >
                  {a}
                </span>
              ))}
            </div>
          </DetailBlock>

          <DetailBlock
            icon={<Sparkles size={16} />}
            label="What you'll experience"
            color={color}
          >
            <p className="text-[0.875rem] text-gray-500 leading-[1.7] mt-1">
              A facilitated experience designed to deepen understanding, build
              practical skills, and strengthen community connection through the{" "}
              {program.pathway} pathway.
            </p>
          </DetailBlock>

          <DetailBlock
            icon={<Handshake size={16} />}
            label="Ideal partners"
            color={color}
          >
            <p className="text-[0.875rem] text-gray-500 leading-[1.7] mt-1">
              {program.audiences.join(", ")}, and organizations seeking
              connection-centered approaches to community resilience.
            </p>
          </DetailBlock>
        </div>

        {/* CTA */}
        <div
          className="mt-10 rounded-xl p-6 text-center"
          style={{ backgroundColor: `${color}06`, border: `1px solid ${color}10` }}
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            <MessageCircle size={16} style={{ color }} />
            <span
              className="text-[0.875rem] text-gray-700"
              style={{ fontWeight: 500 }}
            >
              Interested in this program?
            </span>
          </div>
          <p className="text-[0.8125rem] text-gray-500 mb-4 max-w-xs mx-auto">
            We'd love to hear how it might fit your needs.
          </p>
          <button
            className="px-6 py-2.5 rounded-xl text-[0.875rem] text-white transition-all duration-200 hover:brightness-110 cursor-pointer"
            style={{ backgroundColor: color, fontWeight: 500 }}
          >
            Talk With Us About This Program
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function DetailBlock({
  icon,
  label,
  color,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  color: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="rounded-xl border p-5"
      style={{ borderColor: "rgba(0,0,0,0.05)", backgroundColor: "white" }}
    >
      <div className="flex items-center gap-2 mb-1">
        <span style={{ color }}>{icon}</span>
        <span
          className="text-[0.75rem] uppercase tracking-[0.12em] text-gray-500"
          style={{ fontWeight: 600 }}
        >
          {label}
        </span>
      </div>
      {children}
    </div>
  );
}

/* ─── Program Card ─── */
function ProgramCard({
  program,
  color,
  index,
  onSelect,
}: {
  program: Program;
  color: string;
  index: number;
  onSelect: () => void;
}) {
  const prefersReduced = useReducedMotion();
  return (
    <motion.button
      initial={{ opacity: 0, y: prefersReduced ? 0 : 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.3,
        delay: prefersReduced ? 0 : 0.15 + index * 0.04,
        ease,
      }}
      onClick={onSelect}
      className="group text-left rounded-xl border p-5 transition-all duration-200 hover:shadow-[0_4px_20px_rgba(0,0,0,0.06)] hover:-translate-y-0.5 cursor-pointer relative overflow-hidden w-full"
      style={{ borderColor: "rgba(0,0,0,0.06)", backgroundColor: "#FEFEFE" }}
    >
      <div
        className="absolute top-0 left-0 right-0 h-[2px]"
        style={{ backgroundColor: color, opacity: 0.5 }}
      />

      <h4 className="text-[0.875rem] text-gray-900 mb-1.5" style={{ fontWeight: 500 }}>
        {program.title}
      </h4>
      <p className="text-[0.8125rem] text-gray-500 leading-[1.65] mb-3">
        {program.summary}
      </p>

      <div className="flex flex-wrap gap-1.5 mb-3">
        {program.audiences.map((tag) => (
          <span
            key={tag}
            className="text-[0.625rem] px-2 py-0.5 rounded-full text-gray-400"
            style={{ backgroundColor: "rgba(0,0,0,0.025)", border: "1px solid rgba(0,0,0,0.05)" }}
          >
            {tag}
          </span>
        ))}
      </div>

      <span
        className="inline-flex items-center gap-1 text-[0.8125rem] transition-colors"
        style={{ color, fontWeight: 500 }}
      >
        <span className="relative">
          Details
          <span
            className="absolute left-0 bottom-[-1px] h-[1px] w-0 group-hover:w-full transition-all duration-300"
            style={{ backgroundColor: color }}
          />
        </span>
        <ArrowRight size={12} className="transition-transform duration-200 group-hover:translate-x-0.5" />
      </span>
    </motion.button>
  );
}

/* ─── Main Modal ─── */
export function PathwayModal({ pathway, onClose }: PathwayModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const [activeAudience, setActiveAudience] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Reset state when pathway changes
  useEffect(() => {
    setSelectedProgram(null);
    setActiveAudience(null);
    setSearchQuery("");
  }, [pathway?.id]);

  // Lock body scroll
  useEffect(() => {
    if (pathway) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [pathway]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (selectedProgram) {
          setSelectedProgram(null);
        } else {
          onClose();
        }
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose, selectedProgram]);

  // Focus trap
  useEffect(() => {
    if (!pathway) return;
    const el = modalRef.current;
    if (!el) return;
    const focusable = el.querySelectorAll<HTMLElement>(
      'button, [href], input, [tabindex]:not([tabindex="-1"])'
    );
    if (focusable.length) focusable[0].focus();
  }, [pathway, selectedProgram]);

  // Audience tags for filter chips
  const audienceTags = useMemo(() => {
    if (!pathway) return [];
    const tags = new Set<string>();
    pathway.programs.forEach((p) => p.audiences.forEach((a) => tags.add(a)));
    return Array.from(tags).sort();
  }, [pathway]);

  // Filtered programs
  const filteredPrograms = useMemo(() => {
    if (!pathway) return [];
    let progs = pathway.programs;
    if (activeAudience) {
      progs = progs.filter((p) => p.audiences.includes(activeAudience));
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      progs = progs.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.summary.toLowerCase().includes(q)
      );
    }
    return progs;
  }, [pathway, activeAudience, searchQuery]);

  const handleBack = useCallback(() => setSelectedProgram(null), []);

  return (
    <AnimatePresence>
      {pathway && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center sm:p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-0"
            style={{
              backgroundColor: "rgba(0,0,0,0.22)",
              backdropFilter: "blur(14px)",
              WebkitBackdropFilter: "blur(14px)",
            }}
            onClick={() => {
              if (selectedProgram) {
                setSelectedProgram(null);
              } else {
                onClose();
              }
            }}
          />

          {/* Modal shell */}
          <motion.div
            ref={modalRef}
            initial={{ opacity: 0, y: prefersReduced ? 0 : 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: prefersReduced ? 0 : 24 }}
            transition={{ duration: 0.38, ease }}
            className="relative w-full sm:w-[85vw] sm:max-w-[1400px] max-h-[94vh] sm:max-h-[85vh] overflow-hidden flex rounded-t-[22px] sm:rounded-[22px]"
            style={{
              backgroundColor: "#FAFAF8",
              boxShadow: "0 24px 80px rgba(0,0,0,0.12), 0 8px 32px rgba(0,0,0,0.06)",
            }}
            role="dialog"
            aria-modal="true"
            aria-label={`${pathway.label} programs`}
          >
            {/* Main list panel */}
            <div
              className={`flex flex-col transition-all duration-300 overflow-hidden ${
                selectedProgram
                  ? "hidden sm:flex sm:w-[45%] sm:min-w-[340px]"
                  : "w-full"
              }`}
            >
              {/* Header */}
              <div className="relative px-7 sm:px-8 pt-8 pb-5 flex-shrink-0">
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{ background: `linear-gradient(135deg, ${pathway.color}05 0%, transparent 60%)` }}
                />
                <div className="relative flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2.5">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: pathway.color }} />
                      <span
                        className="text-[0.6875rem] uppercase tracking-[0.16em]"
                        style={{ color: pathway.color, fontWeight: 600 }}
                      >
                        {pathway.label} Pathway
                      </span>
                    </div>
                    <h2
                      className="text-[1.5rem] sm:text-[1.75rem] text-gray-900 tracking-tight"
                      style={{ fontFamily: "Manrope, sans-serif", fontWeight: 700 }}
                    >
                      {pathway.label}
                    </h2>
                    <p className="mt-1.5 text-[0.875rem] text-gray-500 leading-relaxed max-w-lg">
                      {pathway.description}
                    </p>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100/80 transition-all cursor-pointer flex-shrink-0"
                    aria-label="Close modal"
                  >
                    <X size={20} />
                  </button>
                </div>
                <div
                  className="mt-5 h-[1px] rounded-full"
                  style={{ background: `linear-gradient(90deg, ${pathway.color}25, transparent)` }}
                />
              </div>

              {/* Filter row */}
              <div className="px-7 sm:px-8 pb-4 flex-shrink-0">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                  {/* Search */}
                  <div className="relative flex-shrink-0 w-full sm:w-auto">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search programs…"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full sm:w-52 pl-8 pr-3 py-2 rounded-lg text-[0.8125rem] text-gray-700 placeholder-gray-400 transition-all duration-200 focus:outline-none focus:ring-2"
                      style={{
                        backgroundColor: "rgba(0,0,0,0.03)",
                        border: "1px solid rgba(0,0,0,0.06)",
                        // @ts-ignore
                        "--tw-ring-color": `${pathway.color}40`,
                      }}
                    />
                  </div>
                  {/* Audience chips */}
                  <div className="flex flex-wrap gap-1.5">
                    {audienceTags.map((tag) => (
                      <button
                        key={tag}
                        onClick={() =>
                          setActiveAudience(activeAudience === tag ? null : tag)
                        }
                        className={`px-3 py-1 rounded-full text-[0.75rem] border transition-all duration-200 cursor-pointer ${
                          activeAudience === tag
                            ? "text-white"
                            : "text-gray-500 hover:text-gray-700 bg-white"
                        }`}
                        style={{
                          backgroundColor: activeAudience === tag ? pathway.color : undefined,
                          borderColor: activeAudience === tag ? pathway.color : "rgba(0,0,0,0.08)",
                          fontWeight: 500,
                        }}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Program grid / list */}
              <div className="flex-1 overflow-y-auto px-7 sm:px-8 pb-6">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${activeAudience}-${searchQuery}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`grid gap-4 ${
                      selectedProgram ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                    }`}
                  >
                    {filteredPrograms.map((program, idx) => (
                      <ProgramCard
                        key={program.title}
                        program={program}
                        color={pathway.color}
                        index={idx}
                        onSelect={() => setSelectedProgram(program)}
                      />
                    ))}
                  </motion.div>
                </AnimatePresence>

                {filteredPrograms.length === 0 && (
                  <div className="py-16 text-center">
                    <p className="text-[0.9375rem] text-gray-400">
                      No programs match your search.
                    </p>
                    <button
                      onClick={() => {
                        setActiveAudience(null);
                        setSearchQuery("");
                      }}
                      className="mt-2 text-[0.8125rem] cursor-pointer transition-colors"
                      style={{ color: pathway.color, fontWeight: 500 }}
                    >
                      Clear filters
                    </button>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div
                className="px-7 sm:px-8 py-4 flex items-center justify-between flex-shrink-0"
                style={{
                  borderTop: "1px solid rgba(0,0,0,0.04)",
                  backgroundColor: "rgba(0,0,0,0.012)",
                }}
              >
                <span className="text-[0.75rem] text-gray-400">
                  {filteredPrograms.length} of {pathway.programs.length} programs
                </span>
                <button
                  onClick={onClose}
                  className="px-4 py-2 rounded-lg text-[0.8125rem] text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-all cursor-pointer"
                  style={{ fontWeight: 500 }}
                >
                  Close
                </button>
              </div>
            </div>

            {/* Detail drawer — right panel desktop, full-screen mobile */}
            <AnimatePresence>
              {selectedProgram && (
                <motion.div
                  key={selectedProgram.title}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: prefersReduced ? 0.15 : 0.3, ease }}
                  className="w-full sm:w-[55%] sm:border-l overflow-hidden flex-shrink-0 h-full"
                  style={{
                    borderColor: "rgba(0,0,0,0.05)",
                    backgroundColor: "#FAFAF8",
                  }}
                >
                  <ProgramDetail
                    program={selectedProgram}
                    color={pathway.color}
                    onBack={handleBack}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}