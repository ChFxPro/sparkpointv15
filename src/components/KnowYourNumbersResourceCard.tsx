import { ArrowRight, Calculator, Download } from 'lucide-react';
import { Link } from 'react-router';

const BASE = import.meta.env.BASE_URL;

export function KnowYourNumbersResourceCard() {
  return (
    <div className="relative mb-8 overflow-hidden rounded-3xl border border-[#7552A3]/25 bg-gradient-to-br from-[#13253F] via-[#203B60] to-[#5A467B] p-7 text-white shadow-lg shadow-[#13253F]/10 md:p-8">
      <span
        className="pointer-events-none absolute -right-12 -top-20 font-serif text-[13rem] leading-none text-white/[0.055]"
        aria-hidden="true"
      >
        07
      </span>
      <span
        className="pointer-events-none absolute -bottom-20 right-20 h-44 w-44 rounded-full bg-[#D9A62E]/20 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative z-10 grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
        <div className="flex items-start gap-4">
          <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-[#F2C85B] shadow-inner">
            <Calculator size={29} aria-hidden="true" />
          </span>
          <div>
            <span className="mb-2 block text-xs font-extrabold uppercase tracking-[0.18em] text-[#F2C85B]">
              Interactive health field guide
            </span>
            <h3 className="font-serif text-2xl font-bold tracking-tight md:text-3xl">
              Know Your Numbers
            </h3>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/75 md:text-base">
              Explore seven metabolic health measures, calculate HOMA-IR, and create a completed
              two-page guide to discuss with your healthcare provider.
            </p>
            <div className="mt-4 flex flex-wrap gap-2 text-xs font-bold text-white/75">
              <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5">7 measures</span>
              <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5">HOMA-IR calculator</span>
              <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5">Printable worksheet</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row md:flex-col">
          <Link
            to="/resources/know-your-numbers"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#D9A62E] px-5 py-3 font-extrabold text-[#13253F] transition hover:bg-[#F2C85B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#203B60]"
          >
            Use the guide
            <ArrowRight size={17} aria-hidden="true" />
          </Link>
          <a
            href={`${BASE}downloads/brain-health/know-your-numbers.pdf`}
            download
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/30 bg-white/10 px-5 py-3 font-bold text-white transition hover:border-white/60 hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#203B60]"
          >
            <Download size={16} aria-hidden="true" />
            Blank PDF
          </a>
        </div>
      </div>
    </div>
  );
}
