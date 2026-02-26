import { useState } from "react";
import { Link } from "react-router";
import { ProgramsHero } from "./ProgramsHero";
import { EcosystemSection } from "./EcosystemSection";
import { AllProgramsSection } from "./AllProgramsSection";
import { PathwayModal } from "./PathwayModal";
import type { Pathway } from "./programsData";

export default function ProgramsPage() {
  const [activePathway, setActivePathway] = useState<Pathway | null>(null);

  return (
    <div className="pt-20 lg:pt-24">
      <ProgramsHero />

      <section id="ecosystem" className="scroll-mt-24">
        <EcosystemSection onOpenModal={setActivePathway} />
      </section>

      <section id="view-all" className="scroll-mt-24">
        <AllProgramsSection onOpenModal={setActivePathway} />
      </section>

      <section id="cta" className="scroll-mt-24 py-16 sm:py-20" style={{ backgroundColor: "#0f1b2d" }}>
        <div className="max-w-5xl mx-auto px-5 sm:px-8 text-center">
          <h2
            className="text-[1.75rem] sm:text-[2.25rem] text-white tracking-tight"
            style={{ fontFamily: "Manrope, sans-serif", fontWeight: 700 }}
          >
            Ready to Build With Us?
          </h2>
          <p className="mt-4 text-[1rem] leading-relaxed max-w-2xl mx-auto" style={{ color: "rgba(255,255,255,0.75)" }}>
            Tell us what you are working on, what support you need, and how SparkPoint programs can align.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-3">
            <Link
              to="/intake?intent=contact"
              className="px-7 py-3 rounded-xl text-[0.9375rem] text-white transition-all duration-200 hover:brightness-110"
              style={{ backgroundColor: "#E03694", fontWeight: 500 }}
            >
              Talk With Us
            </Link>
            <Link
              to="/get-involved"
              className="px-7 py-3 rounded-xl text-[0.9375rem] text-white/90 transition-all duration-200 hover:bg-white/10"
              style={{ border: "1px solid rgba(255,255,255,0.2)", fontWeight: 500 }}
            >
              Get Involved
            </Link>
          </div>
        </div>
      </section>

      <PathwayModal pathway={activePathway} onClose={() => setActivePathway(null)} />
    </div>
  );
}
