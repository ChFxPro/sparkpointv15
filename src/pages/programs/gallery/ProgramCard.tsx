import { Link } from "react-router";
import { motion, useReducedMotion } from "motion/react";
import {
  Heart,
  Compass,
  Users,
  Megaphone,
  Shield,
} from "lucide-react";
import {
  pathways,
  getProgramAccent,
  getProgramAccentSoft,
  formatTypeLabels,
  type Program,
} from "../programsData";

interface ProgramCardProps {
  program: Program;
  onQuickPeek: (program: Program) => void;
}

function VoiceIcon({ voice, size = 36 }: { voice: Program["brand"]["voice"]; size?: number }) {
  const props = { size, strokeWidth: 1.5 };
  switch (voice) {
    case "soft":
      return <Heart {...props} />;
    case "corporate":
      return <Compass {...props} />;
    case "coalition":
      return <Users {...props} />;
    case "youth":
      return <Megaphone {...props} />;
    case "grounded":
      return <Shield {...props} />;
    default:
      return <Compass {...props} />;
  }
}

export function ProgramCard({ program, onQuickPeek }: ProgramCardProps) {
  const shouldReduceMotion = useReducedMotion();
  const accent = getProgramAccent(program);
  const accentSoft = getProgramAccentSoft(program);
  const pathway = pathways.find((p) => p.id === program.pathway);
  const formatLabel = formatTypeLabels[program.format.type];

  return (
    <motion.article
      className="group relative flex flex-col overflow-hidden rounded-3xl border border-black/6 bg-white shadow-[0_4px_24px_rgba(15,23,42,0.07)] cursor-default"
      style={{ minHeight: "420px" }}
      whileHover={
        shouldReduceMotion
          ? undefined
          : { y: -4, boxShadow: "0 12px 40px rgba(15,23,42,0.13)" }
      }
      transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Image area — top ~60% */}
      <div
        className="relative overflow-hidden"
        style={{
          flex: "0 0 60%",
          background: `linear-gradient(135deg, ${accent} 0%, ${accentSoft} 100%)`,
        }}
      >
        {/* Gradient overlay for depth */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(160deg, ${accent}cc 0%, ${accent}88 50%, ${accentSoft} 100%)`,
          }}
          aria-hidden="true"
        />

        {/* Centered icon */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          whileHover={shouldReduceMotion ? undefined : { scale: 1.02 }}
          transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.3, ease: "easeOut" }}
          aria-hidden="true"
        >
          <div style={{ color: "rgba(255,255,255,0.35)" }}>
            <VoiceIcon voice={program.brand.voice} size={64} />
          </div>
        </motion.div>

        {/* Pathway dot + label — top left */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 z-10">
          <span
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: "rgba(255,255,255,0.85)" }}
            aria-hidden="true"
          />
          <span
            className="text-[0.62rem] font-bold uppercase tracking-[0.1em]"
            style={{ color: "rgba(255,255,255,0.9)" }}
          >
            {pathway?.label}
          </span>
        </div>

        {/* Format chip — top right */}
        <div className="absolute top-3 right-3 z-10">
          <span
            className="inline-flex items-center px-2.5 py-1 rounded-full text-[0.6rem] font-bold uppercase tracking-[0.08em]"
            style={{
              background: "rgba(255,255,255,0.18)",
              color: "rgba(255,255,255,0.92)",
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(255,255,255,0.2)",
            }}
          >
            {formatLabel}
          </span>
        </div>
      </div>

      {/* Content panel — bottom ~40% */}
      <motion.div
        className="relative flex flex-col flex-1 p-5"
        style={{
          borderTop: `2px solid ${accentSoft}`,
        }}
        whileHover={
          shouldReduceMotion
            ? undefined
            : { backgroundColor: "rgba(255,255,255,1)" }
        }
      >
        {/* Title */}
        <h3
          className="text-[1rem] font-bold tracking-[-0.018em] text-[#1A1A1A] leading-snug mb-2"
        >
          {program.title}
        </h3>

        {/* Voice sample */}
        <p
          className="text-[0.825rem] italic leading-relaxed flex-1 mb-4 transition-opacity duration-200"
          style={{
            color: "#555",
          }}
        >
          <span
            className="md:opacity-70 md:group-hover:opacity-100 transition-opacity duration-200"
          >
            {program.brand.voiceSample}
          </span>
        </p>

        {/* Actions */}
        <div className="flex items-center justify-between gap-3 pt-3 border-t border-black/6">
          <button
            onClick={() => onQuickPeek(program)}
            className="text-[0.72rem] font-bold uppercase tracking-[0.08em] underline-offset-2 hover:underline transition-all"
            style={{ color: accent }}
            aria-label={`Quick peek at ${program.title}`}
          >
            Quick Peek
          </button>

          <Link
            to={`/programs/${program.slug}`}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-[0.72rem] font-bold uppercase tracking-[0.08em] text-white transition-all hover:brightness-110 active:scale-95"
            style={{ backgroundColor: accent }}
            aria-label={`Enter ${program.title} program`}
          >
            Enter Program
          </Link>
        </div>
      </motion.div>
    </motion.article>
  );
}
