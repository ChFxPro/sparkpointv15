import type { PurposeWorkshopData } from "../purposeWorkshopData";
import { Reveal } from "./_shared";

export function ExperienceSection({ data }: { data: PurposeWorkshopData }) {
  return (
    <section id="experience" className="section-shell">
      <Reveal>
        <div className="spark-dark-surface overflow-hidden rounded-[2.5rem] px-7 py-12 sm:px-10 sm:py-14 lg:px-12 lg:py-16">
          <div className="flex items-start justify-between gap-6">
            <div className="max-w-2xl">
              <span className="text-[0.6rem] font-semibold uppercase tracking-[0.36em] text-[#FDB515]">
                {data.experience.eyebrow}
              </span>
              <h2 className="spark-section-title mt-4 text-[clamp(2.4rem,6.5vw,3.8rem)] text-white">
                {data.experience.title}
              </h2>
              <p className="mt-4 max-w-lg text-[1rem] leading-7 text-white/68 sm:text-[1.05rem]">
                {data.experience.description}
              </p>
            </div>
            <span
              className="hidden font-display text-[6rem] font-extrabold leading-none tracking-[-0.05em] text-white/8 lg:block"
              aria-hidden="true"
            >
              03
            </span>
          </div>

          <div className="mt-12 divide-y divide-white/10">
            {data.experience.items.map((item, index) => (
              <div
                key={item.title}
                className="grid gap-4 py-8 lg:grid-cols-[5.5rem_minmax(0,1fr)_minmax(0,1.6fr)] lg:gap-10 lg:py-10"
              >
                <span
                  className="font-display text-[2.8rem] font-extrabold leading-none tracking-[-0.03em] text-[#FDB515]/28"
                  aria-hidden="true"
                >
                  0{index + 1}
                </span>
                <h3 className="self-center font-display text-[1.45rem] font-bold leading-[1.1] tracking-[-0.02em] text-white sm:text-[1.65rem]">
                  {item.title}
                </h3>
                <p className="self-center text-[1rem] leading-7 text-white/72">{item.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 border-t border-white/10 pt-8">
            <p className="max-w-2xl text-[1rem] leading-7 text-white/62 sm:text-[1.04rem]">
              {data.experience.takeaway}
            </p>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
