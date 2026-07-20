import { Link } from "react-router";
import { ArrowLeft } from "lucide-react";
import type { PurposeWorkshopData } from "../purposeWorkshopData";
import { Reveal, CTAButton } from "./_shared";

export type HeroSectionProps = {
  data: PurposeWorkshopData;
  backToPrograms?: boolean;
};

export function HeroSection({ data, backToPrograms = false }: HeroSectionProps) {
  return (
    <header className="relative isolate min-h-[100svh] overflow-hidden">
      <div className="absolute inset-0" aria-hidden="true">
        <img
          src={data.heroImage.src}
          alt={data.heroImage.alt}
          className="h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(13,13,14,0.42),rgba(13,13,14,0.38)_22%,rgba(13,13,14,0.72)_68%,rgba(13,13,14,0.86)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(253,181,21,0.14)_0%,rgba(224,54,148,0.18)_100%)] mix-blend-screen" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(253,181,21,0.22),transparent_30%),radial-gradient(circle_at_82%_24%,rgba(224,54,148,0.16),transparent_24%)]" />
      </div>

      <div className="relative z-10">
        <Reveal>
          <div className="mx-auto flex max-w-[1440px] items-center justify-between px-4 pt-4 sm:px-6 lg:px-8 lg:pt-6">
            <div className="flex items-center gap-3 sm:gap-4">
              {backToPrograms ? (
                <Link
                  to="/programs"
                  className="spark-back-link inline-flex items-center gap-2 rounded-full px-4 py-3 text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-white/86 transition-all hover:bg-white/12"
                >
                  <ArrowLeft size={14} />
                  Back to Programs
                </Link>
              ) : null}
              <div className="spark-glass flex items-center gap-4 rounded-full px-4 py-3 sm:px-5">
                <img
                  src={data.logo}
                  alt="SparkPurpose logo"
                  className="spark-logo h-auto drop-shadow-[0_4px_14px_rgba(0,0,0,0.18)]"
                />
                <div className="hidden sm:block">
                  <p className="text-[0.62rem] font-semibold uppercase tracking-[0.28em] text-white/60">
                    Hosted by SparkPoint
                  </p>
                </div>
              </div>
            </div>

            <div className="hidden sm:flex items-center gap-3">
              <a
                href="/"
                className="spark-glass rounded-full px-5 py-3 text-[0.76rem] font-semibold uppercase tracking-[0.12em] text-white/84 transition-all duration-200 hover:bg-white/12"
              >
                Visit SparkPoint
              </a>
              <CTAButton
                href={data.registrationUrl}
                ariaLabel={`Register for the ${data.title}`}
              >
                {data.heroCtaLabel}
              </CTAButton>
            </div>
          </div>
        </Reveal>

        <div className="relative mx-auto flex min-h-[100svh] max-w-[1440px] items-end px-4 pb-12 pt-16 sm:px-6 sm:pb-16 lg:px-8 lg:pb-20">
          <Reveal className="w-full max-w-4xl">
            <div className="flex items-center gap-3">
              <span className="h-px w-16 bg-white/34" />
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#FDB515]">
                Listen • Learn • Lead
              </p>
            </div>

            <div className="mt-6 space-y-2">
              <p className="spark-kicker text-white/62">{data.title}</p>
              <h1 className="spark-section-title max-w-4xl text-[clamp(3.2rem,8.2vw,5.8rem)] text-white">
                <span className="block">{data.openingLines[0]}</span>
                <span className="spark-link-accent mt-2 block">{data.openingLines[1]}</span>
              </h1>
            </div>

            <div className="mt-6 max-w-3xl border-l-2 border-[#E03694]/70 pl-5">
              {data.heroSecondaryLines.map((line) => (
                <p
                  key={line}
                  className="font-display text-[clamp(1.18rem,3vw,1.85rem)] font-semibold leading-[1.08] tracking-[-0.02em] text-white/84"
                >
                  {line}
                </p>
              ))}
            </div>

            <p className="spark-lead mt-8 max-w-xl text-white/82">{data.heroTakeaway}</p>
            <p className="mt-4 max-w-2xl text-[0.96rem] leading-7 text-white/66">{data.beliefLine}</p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
              <CTAButton
                href={data.registrationUrl}
                ariaLabel={`Register for the ${data.title}`}
                className="w-full sm:w-auto"
              >
                {data.heroCtaLabel}
              </CTAButton>
              <p className="max-w-md text-[0.9rem] leading-6 text-white/70">{data.heroSummary}</p>
            </div>

            <div className="mt-10 grid max-w-3xl gap-3 border-t border-white/14 pt-6 sm:grid-cols-3">
              {data.heroHighlights.map((detail) => (
                <div key={detail.label} className="spark-glass rounded-[1.2rem] px-4 py-4">
                  <p className="spark-kicker text-[#FDB515]">{detail.label}</p>
                  <p className="mt-2 text-[0.94rem] font-semibold text-white/88">{detail.value}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 max-w-lg">
              <p className="spark-kicker text-white/46">In the room</p>
              <p className="mt-2 text-[0.95rem] leading-6 text-white/72">{data.heroImage.note}</p>
            </div>
          </Reveal>
        </div>
      </div>
    </header>
  );
}
