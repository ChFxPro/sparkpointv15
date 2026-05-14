import type { PurposeWorkshopData } from "../purposeWorkshopData";
import { Reveal } from "./_shared";

export function GallerySection({ data }: { data: PurposeWorkshopData }) {
  const [first, second, third] = data.gallery.photos;

  return (
    <section id="in-the-room" className="section-shell">
      <Reveal>
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between lg:mb-12">
          <div>
            <span className="spark-kicker text-spark-rose">{data.gallery.eyebrow}</span>
            <h2 className="spark-section-title mt-3 max-w-[28rem] text-[clamp(2.1rem,5.4vw,3.2rem)] text-spark-ink">
              {data.gallery.title}
            </h2>
          </div>
          <p className="max-w-[19rem] text-[0.9rem] leading-6 text-spark-soft sm:text-right">
            {data.gallery.description}
          </p>
        </div>
      </Reveal>

      <div className="grid gap-3 lg:grid-cols-12 lg:grid-rows-[auto_auto]">
        <Reveal delay={40} className="lg:col-span-5 lg:row-span-2">
          <figure className="h-full overflow-hidden rounded-[1.8rem]">
            <img
              src={first.src}
              alt={first.alt}
              className="h-full min-h-[22rem] w-full object-cover object-center transition-transform duration-700 hover:scale-[1.03] lg:min-h-full"
            />
          </figure>
        </Reveal>
        <Reveal delay={110} className="lg:col-span-7">
          <figure className="overflow-hidden rounded-[1.8rem]">
            <img
              src={second.src}
              alt={second.alt}
              className="h-[20rem] w-full object-cover object-center transition-transform duration-700 hover:scale-[1.03] sm:h-[24rem] lg:h-[27rem]"
            />
          </figure>
        </Reveal>
        <Reveal delay={180} className="lg:col-span-7">
          <figure className="overflow-hidden rounded-[1.8rem]">
            <img
              src={third.src}
              alt={third.alt}
              className="h-[18rem] w-full object-cover object-center transition-transform duration-700 hover:scale-[1.03] sm:h-[22rem] lg:h-[25rem]"
            />
          </figure>
        </Reveal>
      </div>
    </section>
  );
}
