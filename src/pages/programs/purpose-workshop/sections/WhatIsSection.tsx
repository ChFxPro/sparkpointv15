import type { PurposeWorkshopData } from "../purposeWorkshopData";
import { Reveal, SectionIntro } from "./_shared";

export function WhatIsSection({ data }: { data: PurposeWorkshopData }) {
  return (
    <section id="about" className="section-shell border-t border-spark-ink/8">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(280px,0.9fr)] lg:gap-14">
        <Reveal className="space-y-7">
          <SectionIntro
            eyebrow={data.whatIs.eyebrow}
            title={data.whatIs.title}
            description={data.whatIs.description}
          />
          <div className="max-w-xl space-y-4">
            {data.whatIs.body.map((paragraph) => (
              <p key={paragraph} className="section-copy">
                {paragraph}
              </p>
            ))}
          </div>
          <div className="max-w-xl border-l-[3px] border-spark-rose pl-5">
            <p className="spark-kicker text-spark-soft">Why it matters</p>
            <p className="mt-2 text-[1rem] font-medium leading-7 text-spark-ink sm:text-[1.04rem]">
              {data.whatIs.takeaway}
            </p>
          </div>
        </Reveal>

        <Reveal delay={100} className="lg:pt-16">
          <aside className="panel rounded-[2rem] p-7 sm:p-8">
            <p className="spark-kicker text-spark-rose">Adapted for</p>
            <p className="mt-3 text-[0.96rem] leading-7 text-spark-soft">{data.whatIs.settingsNote}</p>
            <div className="mt-6 flex flex-wrap gap-2.5">
              {data.whatIs.settings.map((setting) => (
                <span
                  key={setting}
                  className="rounded-full border border-spark-rose/12 bg-white px-4 py-2 text-[0.78rem] font-semibold uppercase tracking-[0.08em] text-spark-ink shadow-[0_8px_20px_rgba(26,26,26,0.06)]"
                >
                  {setting}
                </span>
              ))}
            </div>
          </aside>
        </Reveal>
      </div>
    </section>
  );
}
