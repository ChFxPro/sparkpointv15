'use client';

import '@fontsource-variable/fraunces';

import { Link } from 'react-router';
import { ArrowRight, ExternalLink } from 'lucide-react';
import {
  POST_SESSION_ID,
  POST_SESSION_REGISTER_URL,
  isPostSessionActive,
} from '../pages/RuralHealthPostSession';

// Homepage promo for the 2026 WNC Regional Rural Health Convening — now a recap card
// for the October 1 event, pointing at the convening page's past-event recap. The palette,
// paper grain, star rule, plate frame, and square-cornered button are lifted from
// src/pages/ruralHealthConvening.css so the card reads as a window into that page.
export const RURAL_HEALTH_CONVENING_PATH = '/rural-health-convening';

const ASSET_BASE = `${import.meta.env.BASE_URL}assets/Rural%20Health/`;
const eventMark = `${ASSET_BASE}NC%20Rural%20Health%20Convening%20promo.webp`;
const connectionMap = `${ASSET_BASE}rural%20sim%20promo.webp`;

const PAPER = '#f5efdd';
const PAPER_DEEP = '#e9dfc4';
const INK = '#2b2620';
const FOREST = '#2f4a3c';
const CHESTNUT = '#6b4226';
const CLAY = '#9a432e';
const BRASS = '#a77f23';
const DISPLAY_FONT = "'Fraunces Variable', 'Fraunces', Georgia, serif";
const PAPER_GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180' viewBox='0 0 180 180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.82' numOctaves='2' stitchTiles='stitch'/%3E%3CfeComponentTransfer%3E%3CfeFuncA type='linear' slope='.035'/%3E%3C/feComponentTransfer%3E%3C/filter%3E%3Crect width='180' height='180' filter='url(%23n)'/%3E%3C/svg%3E\")";

// The convening took place October 1, 2026. The card stays up as a recap for a month
// afterward, then retires; move this date if the recap should run longer (for example
// once photos or the video land on the convening page). While the Nov 5 virtual
// post-convening session is still ahead, the card holds on until it is over, so its
// registration link never disappears before the session.
const PROMO_EXPIRES = new Date('2026-11-01T00:00:00-04:00');

export function isRuralHealthPromoActive(now = new Date()) {
  return now < PROMO_EXPIRES || isPostSessionActive(now);
}

const facts = [
  { label: 'Date', value: 'Thu, Oct 1, 2026' },
  { label: 'Attendance', value: 'A full house' },
  { label: 'Place', value: 'Deerwoode Reserve · Brevard, NC' },
];

export function RuralHealthPromoCard() {
  // While the Nov 5 virtual post-convening session is ahead, the card carries an
  // "Up next" panel for it (date block, title linking to the recap page's band, and
  // Zoom registration). It drops out on its own after Nov 5 ET; the card itself
  // retires then too, so the panel is there whenever the card is.
  const showPostSession = isPostSessionActive();

  return (
    <div className="group relative h-full pt-9 md:pt-11">
      <div
        className="relative flex h-full min-h-[320px] flex-col overflow-hidden rounded-2xl shadow-xl transition-shadow duration-300 group-hover:shadow-2xl"
        style={{
          backgroundColor: PAPER,
          backgroundImage: PAPER_GRAIN,
          border: `1px solid ${FOREST}`,
          color: INK,
        }}
      >
        <div
          className="absolute inset-x-0 top-0 h-1.5"
          style={{ background: `linear-gradient(90deg, ${BRASS}, ${FOREST} 55%, ${CLAY})` }}
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute inset-[7px] rounded-[10px]"
          style={{ border: '1px solid rgba(47, 74, 60, 0.45)' }}
          aria-hidden="true"
        />

        <div className="relative flex flex-1 flex-col justify-between gap-6 p-7 pt-12 md:p-8 md:pt-14">
          <div>
            <div className="pr-20 md:pr-32">
              <div className="mb-4 flex flex-wrap items-center gap-x-3 gap-y-2">
                <span
                  className="inline-flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[0.16em]"
                  style={{ color: CHESTNUT }}
                >
                  <span className="h-2 w-2 rounded-full" style={{ background: CLAY }} aria-hidden="true" />
                  Held October 1
                </span>
                <span
                  className="inline-flex items-baseline rounded-[2px] px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-[0.14em]"
                  style={{
                    color: PAPER,
                    background: CLAY,
                    boxShadow: `inset 0 0 0 1px ${CLAY}, inset 0 0 0 2px rgba(245, 239, 221, 0.55)`,
                  }}
                >
                  Full house
                </span>
              </div>
              <h2 className="mb-1">
                <img
                  src={eventMark}
                  alt="2026 WNC Regional Rural Health Convening"
                  width={720}
                  height={402}
                  loading="lazy"
                  className="h-auto w-full max-w-[240px]"
                />
              </h2>
            </div>

            <div
              className="my-3 grid w-full max-w-[240px] grid-cols-[1fr_auto_1fr] items-center gap-3"
              style={{ color: BRASS }}
              aria-hidden="true"
            >
              <span className="h-px" style={{ background: BRASS }} />
              <b className="text-lg font-normal leading-none" style={{ fontFamily: DISPLAY_FONT }}>
                ✦
              </b>
              <span className="h-px" style={{ background: BRASS }} />
            </div>

            <p
              className="max-w-xl text-[1.3rem] font-semibold leading-tight md:text-[1.45rem]"
              style={{ fontFamily: DISPLAY_FONT, color: FOREST, textWrap: 'balance' }}
            >
              Where rural health came together.
            </p>
            <p className="mt-1.5 max-w-xl leading-relaxed" style={{ color: 'rgba(43, 38, 32, 0.78)' }}>
              A full house of WNC&rsquo;s rural health leaders spent the day connecting, collaborating,
              and walking the Rural Health Field Simulator together&mdash;and left with so many new
              connections.
            </p>

            <dl className="mt-4 grid gap-x-5 gap-y-3 sm:grid-cols-3">
              {facts.map((fact) => (
                <div key={fact.label}>
                  <dt
                    className="text-[10px] font-bold uppercase tracking-[0.16em]"
                    style={{ color: BRASS }}
                  >
                    {fact.label}
                  </dt>
                  <dd
                    className="mt-0.5 text-[11px] font-bold uppercase leading-snug tracking-[0.12em]"
                    style={{ color: FOREST }}
                  >
                    {fact.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="flex flex-col gap-3">
            {showPostSession && (
              <section
                aria-labelledby="rh-promo-next-title"
                className="relative grid grid-cols-[auto_1fr] overflow-hidden"
                style={{
                  border: `1px solid ${FOREST}`,
                  background: 'rgba(255, 253, 248, 0.55)',
                  boxShadow: `inset 0 0 0 3px ${PAPER}, inset 0 0 0 4px rgba(47, 74, 60, 0.35)`,
                }}
              >
                <div
                  className="grid w-[78px] content-center justify-items-center gap-0.5 px-2 py-4 text-center md:w-[88px]"
                  style={{ background: FOREST, color: PAPER }}
                  aria-hidden="true"
                >
                  <span className="text-[10px] font-extrabold uppercase tracking-[0.2em]" style={{ color: '#e3c77d' }}>
                    Nov
                  </span>
                  <strong className="text-[2.4rem] font-semibold leading-none" style={{ fontFamily: DISPLAY_FONT }}>
                    05
                  </strong>
                  <span className="text-[9px] font-bold uppercase tracking-[0.18em] opacity-80">Thursday</span>
                </div>
                <div className="grid gap-1.5 px-4 py-3.5 md:px-5">
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.16em]" style={{ color: CLAY }}>
                    Up next &middot; For October 1 attendees
                  </p>
                  <h3
                    id="rh-promo-next-title"
                    className="text-[1.12rem] font-semibold leading-tight md:text-[1.2rem]"
                    style={{ fontFamily: DISPLAY_FONT, color: FOREST, textWrap: 'balance' }}
                  >
                    <Link
                      to={`${RURAL_HEALTH_CONVENING_PATH}#${POST_SESSION_ID}`}
                      className="underline decoration-[rgba(167,127,35,0.5)] decoration-1 underline-offset-[5px] transition-colors hover:decoration-[#a77f23]"
                    >
                      Virtual Post&#8209;Convening Session
                    </Link>
                  </h3>
                  <p className="text-[11px] font-bold uppercase tracking-[0.12em]" style={{ color: CHESTNUT }}>
                    10:00 a.m. ET &middot; Online on Zoom
                  </p>
                  <a
                    href={POST_SESSION_REGISTER_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 inline-flex items-center gap-2 justify-self-start whitespace-nowrap rounded-[1px] border px-3 py-1.5 text-[0.84rem] font-extrabold transition-colors duration-150 hover:bg-[rgba(167,127,35,0.16)]"
                    style={{ color: FOREST, borderColor: BRASS, background: 'rgba(167, 127, 35, 0.08)' }}
                  >
                    Register on Zoom <ExternalLink size={14} aria-hidden="true" />
                    <span className="sr-only">(opens in a new tab)</span>
                  </a>
                </div>
              </section>
            )}
            <Link
              to={RURAL_HEALTH_CONVENING_PATH}
              className="inline-flex min-h-[54px] w-full items-center justify-center gap-3 rounded-[1px] border-2 border-[#2f4a3c] bg-[#2f4a3c] px-8 text-[0.95rem] font-extrabold text-[#f5efdd] shadow-lg transition-[transform,background-color,box-shadow] duration-150 hover:-translate-y-0.5 hover:bg-[#20362c] hover:shadow-xl"
              style={{ boxShadow: `inset 0 0 0 2px ${FOREST}, inset 0 0 0 3px rgba(245, 239, 221, 0.72)` }}
            >
              See the recap <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <p
              className="text-center text-[10px] font-bold uppercase leading-relaxed tracking-[0.13em]"
              style={{ color: 'rgba(47, 74, 60, 0.7)' }}
            >
              Thank you to presenting sponsors UNC Health Pardee &amp; Transylvania Regional Hospital
            </p>
          </div>
        </div>
      </div>

      <div className="absolute -top-2 right-5 z-10 md:right-8">
        <div
          className="absolute -inset-4 -z-10 rounded-full opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-70"
          style={{ background: `radial-gradient(circle, ${BRASS}, transparent 70%)` }}
          aria-hidden="true"
        />
        <span
          className="absolute -right-3 -top-3 z-20 grid h-14 w-14 rotate-[8deg] place-items-center rounded-full text-center text-[9px] font-black uppercase leading-tight transition-transform duration-300 ease-out group-hover:-translate-y-1 group-hover:scale-105"
          style={{
            color: PAPER,
            background: CLAY,
            border: '3px solid #fffdf8',
            boxShadow: '0 10px 24px rgba(0,0,0,0.25)',
          }}
          aria-hidden="true"
        >
          Oct 1
          <br />
          2026
        </span>
        <div
          className="w-24 rotate-[5deg] p-1.5 transition-transform duration-300 ease-out group-hover:-translate-y-1.5 group-hover:scale-105 md:w-36"
          style={{
            background: PAPER_DEEP,
            border: `1px solid ${FOREST}`,
            boxShadow: `inset 0 0 0 3px ${PAPER_DEEP}, inset 0 0 0 4px rgba(47, 74, 60, 0.65), 8px 10px 0 rgba(43, 38, 32, 0.12), 0 20px 30px rgba(0, 0, 0, 0.22)`,
          }}
          aria-hidden="true"
        >
          <div
            className="hidden pb-1 text-[6px] font-bold uppercase tracking-[0.1em] md:block"
            style={{ fontFamily: DISPLAY_FONT, color: INK }}
          >
            System map &middot; not to scale
          </div>
          <img
            src={connectionMap}
            alt=""
            width={640}
            height={427}
            loading="lazy"
            className="block aspect-[3/2] w-full object-cover"
            style={{ border: '1px solid rgba(43, 38, 32, 0.38)', objectPosition: '62% 42%' }}
          />
        </div>
      </div>
    </div>
  );
}
