import { Link } from 'react-router';
import { ArrowRight } from 'lucide-react';
import { getActiveSpotlight, type SpotlightItem } from '../../data/homeSpotlight';

// One or two featured items sitting on the bottom edge of the hero, half on
// the plum and half on the white below. They're drawn like the programs cards
// further down: the photo fills the card, the words sit on a wash of the item's
// colour rising from the bottom, chips for the facts, and a white button.
// What's featured lives in src/data/homeSpotlight.ts.
const DEFAULT_TONE = '#2a1430';

function SpotlightCard({ item }: { item: SpotlightItem }) {
  const tone = item.tone ?? DEFAULT_TONE;
  const external = /^https?:/.test(item.cta.href);
  const buttonClass =
    'inline-flex min-h-[44px] items-center gap-2 whitespace-nowrap rounded-full bg-white px-5 text-base font-bold transition-transform duration-300 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2';
  const buttonStyle = { color: tone, ['--tw-ring-offset-color' as string]: tone };
  const chips = [...(item.when ? [item.when] : []), ...(item.tags ?? [])];

  return (
    <li
      className="home-program group relative flex h-[26rem] overflow-hidden rounded-[1.75rem] text-white sm:h-[24rem]"
      data-side="bottom"
      style={{ ['--tone' as string]: tone, backgroundColor: tone, boxShadow: '0 22px 50px -24px rgba(20,8,24,0.65)' }}
    >
      {item.image && (
        <>
          <img
            src={item.image.src}
            srcSet={item.image.srcSet}
            sizes="(min-width: 768px) 45vw, 100vw"
            alt={item.image.alt}
            decoding="async"
            className="home-program-photo absolute inset-0 h-full w-full object-cover"
            style={item.image.position ? { objectPosition: item.image.position } : undefined}
          />
          <div aria-hidden="true" className="home-program-scrim pointer-events-none absolute inset-0" />
        </>
      )}
      <div className="relative mt-auto flex w-full flex-col p-6 md:p-8">
        <h2 className="text-[1.6rem] font-extrabold leading-[1.1] md:text-[1.9rem]" style={{ textWrap: 'balance' }}>
          {item.title}
        </h2>
        <p className="mt-2 max-w-xl text-base leading-relaxed text-white/90">{item.body}</p>
        {chips.length > 0 && (
          <ul className="mt-4 hidden flex-wrap gap-2 sm:flex" aria-label="Details">
            {chips.map((chip, i) => (
              <li
                key={chip}
                className={
                  i === 0 && item.when
                    ? 'rounded-full bg-white px-3 py-1 text-[0.8rem] font-bold'
                    : 'rounded-full border border-white/40 px-3 py-1 text-[0.8rem] font-semibold text-white'
                }
                style={i === 0 && item.when ? { color: tone } : undefined}
              >
                {chip}
              </li>
            ))}
          </ul>
        )}
        <div className="mt-5">
          {external ? (
            <a href={item.cta.href} className={buttonClass} style={buttonStyle}>
              {item.cta.label} <ArrowRight size={16} aria-hidden="true" />
            </a>
          ) : (
            <Link to={item.cta.href} className={buttonClass} style={buttonStyle}>
              {item.cta.label} <ArrowRight size={16} aria-hidden="true" />
            </Link>
          )}
        </div>
      </div>
    </li>
  );
}

export function HomeSpotlight() {
  const items = getActiveSpotlight();
  if (items.length === 0) return null;

  return (
    <section aria-label="Featured" className="home-spotlight relative z-10 -mt-24 px-6">
      <ul className={`mx-auto grid gap-4 md:gap-6 ${items.length > 1 ? 'max-w-7xl md:grid-cols-2' : 'max-w-3xl'}`}>
        {items.map((item) => (
          <SpotlightCard key={item.id} item={item} />
        ))}
      </ul>
    </section>
  );
}
