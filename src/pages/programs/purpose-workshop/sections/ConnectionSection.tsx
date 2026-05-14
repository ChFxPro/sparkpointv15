import type { PurposeWorkshopData } from "../purposeWorkshopData";
import { Reveal, SectionIntro } from "./_shared";

export function ConnectionSection({ data }: { data: PurposeWorkshopData }) {
  return (
    <section className="section-shell">
      <div className="grid gap-10 lg:grid-cols-[minmax(300px,0.88fr)_minmax(0,1.12fr)] lg:items-center lg:gap-12">
        <Reveal delay={130} className="order-2 lg:order-1">
          <figure className="relative overflow-hidden rounded-[2rem]">
            <img
              src={data.connection.image.src}
              alt={data.connection.image.alt}
              className="h-[26rem] w-full object-cover object-center motion-safe:animate-[drift_18s_ease-in-out_infinite_alternate] lg:h-[34rem]"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,10,6,0.06),rgba(15,10,6,0.16)_46%,rgba(15,10,6,0.76)_100%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_82%_18%,rgba(253,181,21,0.14),transparent_26%)]" />
            <figcaption className="absolute inset-x-0 bottom-0 px-6 pb-6 pt-12 text-[0.88rem] leading-6 text-white/86">
              {data.connection.image.label}
            </figcaption>
          </figure>
        </Reveal>

        <Reveal className="order-1 space-y-7 lg:order-2">
          <SectionIntro
            eyebrow={data.connection.eyebrow}
            title={data.connection.title}
            description={data.connection.description}
          />
          <div className="max-w-xl space-y-4">
            {data.connection.paragraphs.map((paragraph) => (
              <p key={paragraph} className="section-copy">
                {paragraph}
              </p>
            ))}
          </div>

          <div className="max-w-xl divide-y divide-spark-ink/10">
            {data.connection.points.map((point) => (
              <div key={point.title} className="py-5 first:pt-0 last:pb-0">
                <p className="text-[0.72rem] font-semibold uppercase tracking-[0.26em] text-spark-rose">
                  {point.title}
                </p>
                <p className="mt-2 text-[0.98rem] leading-7 text-spark-ink/82">{point.description}</p>
              </div>
            ))}
          </div>

          <p className="max-w-lg border-l-2 border-spark-gold/70 pl-4 text-[0.94rem] leading-7 text-spark-soft italic">
            {data.connection.takeaway}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
