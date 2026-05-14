import type { PurposeWorkshopData } from "../purposeWorkshopData";
import { Reveal, CTAButton } from "./_shared";

export function FinalCTASection({ data }: { data: PurposeWorkshopData }) {
  return (
    <section className="section-shell pb-0">
      <Reveal>
        <div className="spark-dark-surface relative overflow-hidden rounded-[2.5rem] px-7 py-14 sm:px-10 sm:py-16 lg:px-14 lg:py-18">
          <div className="pointer-events-none absolute inset-0" aria-hidden="true">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_18%,rgba(253,181,21,0.24),transparent_34%),radial-gradient(circle_at_88%_82%,rgba(224,54,148,0.18),transparent_34%)]" />
          </div>

          <div className="relative grid items-end gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(280px,0.8fr)] lg:gap-14">
            <div>
              <span className="text-[0.6rem] font-semibold uppercase tracking-[0.38em] text-[#FDB515]">
                {data.closing.eyebrow}
              </span>
              <h2 className="spark-section-title mt-5 text-[clamp(2.8rem,7.5vw,5rem)] text-white">
                {data.closing.title}
              </h2>
              <p className="mt-5 max-w-lg text-[1.04rem] leading-7 text-white/72">
                {data.closing.support}
              </p>
              <div className="mt-8">
                <CTAButton
                  href={data.registrationUrl}
                  ariaLabel={`Register for the ${data.title}`}
                  variant="light"
                  className="!px-8 !py-4 !text-[0.84rem] !tracking-[0.06em]"
                >
                  {data.closing.ctaLabel}
                </CTAButton>
              </div>
            </div>

            <div className="spark-glass rounded-[1.8rem] px-6 py-6 sm:px-7 sm:py-7">
              <dl className="space-y-0 divide-y divide-white/10">
                {data.closing.details.map(([label, value]) => (
                  <div key={label} className="py-4 first:pt-0 last:pb-0">
                    <dt className="text-[0.6rem] font-semibold uppercase tracking-[0.3em] text-[#FDB515]">
                      {label}
                    </dt>
                    <dd className="mt-2 text-[0.96rem] font-medium leading-6 text-white/86">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
