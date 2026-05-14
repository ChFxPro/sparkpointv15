import type { PurposeWorkshopData } from "../purposeWorkshopData";
import { Reveal } from "./_shared";

export function AudienceSection({ data }: { data: PurposeWorkshopData }) {
  return (
    <section className="section-shell">
      <Reveal>
        <div className="spark-dark-surface overflow-hidden rounded-[2.5rem] px-7 py-12 sm:px-10 sm:py-14 lg:px-12 lg:py-16">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,0.78fr)_minmax(0,1.22fr)] lg:gap-14">
            <div className="flex flex-col justify-between gap-8">
              <div>
                <span className="text-[0.6rem] font-semibold uppercase tracking-[0.36em] text-[#FDB515]">
                  {data.audience.eyebrow}
                </span>
                <h2 className="spark-section-title mt-4 text-[clamp(2.4rem,6.5vw,3.6rem)] text-white">
                  {data.audience.title}
                </h2>
                <p className="mt-4 max-w-xs text-[1rem] leading-7 text-white/68">
                  {data.audience.description}
                </p>
              </div>
              <p className="max-w-xs border-t border-white/14 pt-6 text-[0.9rem] leading-6 text-white/52 italic">
                {data.audience.takeaway}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {data.audience.items.map((item, index) => (
                <article
                  key={item.title}
                  className={[
                    "spark-glass rounded-[1.5rem] p-5",
                    index % 2 === 0 ? "bg-white/10" : "bg-white/6",
                  ].join(" ")}
                >
                  <p className="text-[0.94rem] font-semibold leading-snug text-white">{item.title}</p>
                  <p className="mt-2 text-[0.88rem] leading-6 text-white/62">{item.description}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
