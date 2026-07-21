// Event photo gallery for the Dr. Ora Wells "Protecting Cognitive Health" story.
// Images live in /public/assets/dr_ora_brain_img and are referenced by URL.
const BASE = import.meta.env.BASE_URL;
const img = (file: string) => `${BASE}assets/dr_ora_brain_img/${file}`;

const TILES: { file: string; alt: string }[] = [
  { file: 'drora_cog-07.webp', alt: 'Dr. Ora Wells and panelists on stage during the Brain Health talk' },
  { file: 'drora_cog-08.webp', alt: 'Dr. Ora Wells presenting a hands-on demonstration on stage' },
  { file: 'drora_cog-12.webp', alt: 'Dr. Ora Wells speaking at the podium as the audience listens' },
  { file: 'drora_crowd2.webp', alt: 'The audience gathered for the Brain Health talk' },
];

export function DrOraEventGallery() {
  return (
    <section aria-labelledby="dr-ora-event" className="mt-16">
      <div className="mb-6">
        <span className="mb-4 inline-block rounded-full bg-[#E03694]/10 px-3.5 py-1.5 text-xs font-extrabold uppercase tracking-[0.18em] text-[#E03694]">
          From the Evening
        </span>
        <h2 id="dr-ora-event" className="text-3xl font-bold tracking-tight text-[#1A1A1A] md:text-4xl">
          A full house at Brevard College
        </h2>
        <p className="mt-2 max-w-2xl text-lg text-gray-500">
          Hundreds of neighbors turned out for the talk — a panel conversation, a hands-on demonstration, and a packed auditorium.
        </p>
      </div>

      <img
        src={img('drora_crowd1.webp')}
        alt="A packed auditorium at Brevard College for Dr. Ora Wells' Brain Health talk"
        loading="lazy"
        className="w-full rounded-3xl object-cover shadow-sm aspect-[16/7]"
      />

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {TILES.map((t) => (
          <img
            key={t.file}
            src={img(t.file)}
            alt={t.alt}
            loading="lazy"
            className="aspect-[4/3] w-full rounded-2xl object-cover shadow-sm"
          />
        ))}
      </div>
    </section>
  );
}
