import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import {
  X,
  ArrowRight,
  ArrowLeft,
  Search,
  Users,
  Sparkles,
  Target,
  Handshake,
  MessageCircle,
} from "lucide-react";
import {
  getFormatLabel,
  getOfferingTypeLabel,
  type Pathway,
  type Program,
} from "./programsData";

interface PathwayModalProps {
  pathway: Pathway | null;
  initialProgram?: Program | null;
  onProgramChange?: (program: Program | null) => void;
  onClose: () => void;
}

const ease = [0.22, 1, 0.36, 1] as const;

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
      <div className="flex items-center gap-2 mb-2">
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

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="sp-prog-detail-list">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

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
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
            <span className="text-[0.6875rem] uppercase tracking-[0.15em]" style={{ color, fontWeight: 600 }}>
              {program.pathway} pathway
            </span>
          </div>
          <h3
            className="text-[1.5rem] sm:text-[1.75rem] text-gray-900 tracking-tight mb-2"
            style={{ fontFamily: "Manrope, sans-serif", fontWeight: 700 }}
          >
            {program.title}
          </h3>
          <p className="sp-prog-detail-tagline">{program.tagline}</p>
          <p className="sp-prog-detail-text">{program.overview}</p>
          {program.whyItExists && <p className="sp-prog-detail-why">{program.whyItExists}</p>}

          <div className="sp-prog-card-badge-row mt-4">
            <span className="sp-prog-badge sp-prog-badge-format">{getFormatLabel(program.format)}</span>
            <span className={`sp-prog-badge sp-prog-badge-${program.offeringType}`}>
              {getOfferingTypeLabel(program.offeringType)}
            </span>
          </div>
        </div>

        <div className="space-y-5">
          <DetailBlock icon={<Users size={16} />} label="Who it's for" color={color}>
            <div className="flex flex-wrap gap-2 mt-1">
              {program.whoItsFor.map((audience) => (
                <span
                  key={audience}
                  className="px-3 py-1 rounded-full text-[0.8125rem] text-gray-600"
                  style={{ backgroundColor: `${color}08`, border: `1px solid ${color}15` }}
                >
                  {audience}
                </span>
              ))}
            </div>
          </DetailBlock>

          <DetailBlock icon={<Sparkles size={16} />} label="What you'll experience" color={color}>
            <BulletList items={program.whatYoullExperience} />
          </DetailBlock>

          <DetailBlock icon={<Target size={16} />} label="Outcomes" color={color}>
            <BulletList items={program.outcomes} />
          </DetailBlock>

          {program.idealPartners.length > 0 && (
            <DetailBlock icon={<Handshake size={16} />} label="Ideal partners" color={color}>
              <BulletList items={program.idealPartners} />
            </DetailBlock>
          )}
        </div>

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
              Ready to explore this program?
            </span>
          </div>
          <p className="text-[0.8125rem] text-gray-500 mb-4 max-w-xs mx-auto">
            We can walk through fit, timeline, and what partnership could look like.
          </p>
          <Link
            to={program.contactCTA.href}
            className="sp-prog-cta-button sp-prog-cta-button-primary"
            style={{ fontWeight: 500 }}
          >
            {program.contactCTA.label}
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

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
      type="button"
      aria-label={`View details for ${program.title}`}
      initial={{ opacity: 0, y: prefersReduced ? 0 : 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.3,
        delay: prefersReduced ? 0 : 0.15 + index * 0.04,
        ease,
      }}
      onClick={() => {
        const selection = window.getSelection()?.toString();
        if (selection && selection.trim().length > 0) return;
        onSelect();
      }}
      className="sp-prog-card sp-prog-card-button group w-full"
      style={{ borderColor: "rgba(0,0,0,0.06)", backgroundColor: "#FEFEFE" }}
    >
      <div
        className="sp-prog-accent-stripe"
        style={{ backgroundColor: color, opacity: 0.5 }}
      />

      <h4 className="text-[0.875rem] text-gray-900 mb-1.5" style={{ fontWeight: 600 }}>
        {program.title}
      </h4>
      <p className="text-[0.8125rem] text-gray-500 leading-[1.65] mb-3">
        {program.tagline}
      </p>

      <div className="sp-prog-card-badge-row mb-3">
        <span className="sp-prog-badge sp-prog-badge-format">{getFormatLabel(program.format)}</span>
        <span className={`sp-prog-badge sp-prog-badge-${program.offeringType}`}>
          {getOfferingTypeLabel(program.offeringType)}
        </span>
      </div>

      <div className="flex flex-wrap gap-1.5 mb-3">
        {program.tags.slice(0, 2).map((tag) => (
          <span
            key={`${program.id}-${tag}`}
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
            className="sp-prog-card-underline absolute left-0 w-0 group-hover:w-full transition-all duration-300"
            style={{ backgroundColor: color }}
          />
        </span>
        <ArrowRight size={12} className="sp-prog-card-arrow transition-transform duration-200" />
      </span>
    </motion.button>
  );
}

export function PathwayModal({
  pathway,
  initialProgram = null,
  onProgramChange,
  onClose,
}: PathwayModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const onProgramChangeRef = useRef(onProgramChange);
  const prefersReduced = useReducedMotion();
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const [activeAudience, setActiveAudience] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    onProgramChangeRef.current = onProgramChange;
  }, [onProgramChange]);

  const setDetailProgram = useCallback((program: Program | null) => {
    setSelectedProgram(program);
    onProgramChangeRef.current?.(program);
  }, []);

  useEffect(() => {
    setDetailProgram(initialProgram);
    setActiveAudience(null);
    setSearchQuery("");
  }, [pathway?.id, initialProgram, setDetailProgram]);

  useEffect(() => {
    if (pathway) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [pathway]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (selectedProgram) {
          setDetailProgram(null);
        } else {
          onClose();
        }
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose, selectedProgram, setDetailProgram]);

  useEffect(() => {
    if (!pathway) return;
    const el = modalRef.current;
    if (!el) return;

    const getFocusable = () =>
      Array.from(
        el.querySelectorAll<HTMLElement>(
          'button, [href], input, [tabindex]:not([tabindex="-1"])'
        )
      ).filter((node) => !node.hasAttribute("disabled"));

    const focusable = getFocusable();
    if (focusable.length) focusable[0].focus();

    const trapFocus = (event: KeyboardEvent) => {
      if (event.key !== "Tab") return;
      const nodes = getFocusable();
      if (nodes.length === 0) {
        event.preventDefault();
        return;
      }
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    el.addEventListener("keydown", trapFocus);
    return () => el.removeEventListener("keydown", trapFocus);
  }, [pathway, selectedProgram]);

  const audienceTags = useMemo(() => {
    if (!pathway) return [];
    const tags = new Set<string>();
    pathway.programs.forEach((program) => program.tags.forEach((tag) => tags.add(tag)));
    return Array.from(tags).sort();
  }, [pathway]);

  const filteredPrograms = useMemo(() => {
    if (!pathway) return [];
    let programs = pathway.programs;
    if (activeAudience) {
      programs = programs.filter((program) => program.tags.includes(activeAudience));
    }
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      programs = programs.filter(
        (program) =>
          program.title.toLowerCase().includes(query) ||
          program.tagline.toLowerCase().includes(query) ||
          program.overview.toLowerCase().includes(query)
      );
    }
    return programs;
  }, [pathway, activeAudience, searchQuery]);

  const handleBack = useCallback(() => setDetailProgram(null), [setDetailProgram]);

  return (
    <AnimatePresence>
      {pathway && (
        <div className="sp-prog-modal-overlay">
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
                setDetailProgram(null);
              } else {
                onClose();
              }
            }}
          />

          <motion.div
            ref={modalRef}
            initial={{ opacity: 0, y: prefersReduced ? 0 : 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: prefersReduced ? 0 : 24 }}
            transition={{ duration: 0.38, ease }}
            className="sp-prog-modal"
            style={{
              backgroundColor: "#FAFAF8",
              boxShadow: "0 24px 80px rgba(0,0,0,0.12), 0 8px 32px rgba(0,0,0,0.06)",
            }}
            role="dialog"
            aria-modal="true"
            aria-label={`${pathway.label} programs`}
          >
            <div
              className={`sp-prog-modal-main${selectedProgram ? " sp-prog-modal-main--with-detail" : ""}`}
            >
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
                    className="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all cursor-pointer flex-shrink-0"
                    aria-label="Close modal"
                  >
                    <X size={20} />
                  </button>
                </div>
                <div
                  className="mt-5 rounded-full"
                  style={{ height: 1, background: `linear-gradient(90deg, ${pathway.color}25, transparent)` }}
                />
              </div>

              <div className="px-7 sm:px-8 pb-4 flex-shrink-0">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                  <div className="relative flex-shrink-0 w-full sm:w-auto">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search programs…"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="sp-prog-search-input"
                      style={{
                        backgroundColor: "rgba(0,0,0,0.03)",
                        border: "1px solid rgba(0,0,0,0.06)",
                      }}
                    />
                  </div>
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
                        key={program.id}
                        program={program}
                        color={pathway.color}
                        index={idx}
                        onSelect={() => setDetailProgram(program)}
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

            <AnimatePresence>
              {selectedProgram && (
                <motion.div
                  key={selectedProgram.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: prefersReduced ? 0.15 : 0.3, ease }}
                  className="sp-prog-modal-detail"
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
