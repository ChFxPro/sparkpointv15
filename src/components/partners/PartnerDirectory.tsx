import { PARTNER_SECTORS } from '../../data/partners';
import { partnerLogo } from '../partnerLogos';
import { PartnerLogoArt } from './PartnerLogoArt';

// Every partner, by sector, with its logo where there is one in
// src/assets/partner-logos/ and its name otherwise. A partner listed under two
// sectors appears in both; the total counts each organization once.

const ALL = new Set(PARTNER_SECTORS.flatMap((s) => s.partners.map((p) => p.name)));

export function PartnerDirectory() {
  return (
    <section id="section-directory" aria-labelledby="directory-heading" className="relative z-10 bg-white px-6 py-20 md:py-24" style={{ borderTop: '1px solid rgba(0,0,0,0.06)' }}>
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 grid gap-5 lg:grid-cols-[1fr_1.1fr] lg:items-end lg:gap-16">
          <h2 id="directory-heading" className="text-3xl font-extrabold tracking-tight text-[#1A1A1A] md:text-[2.6rem] md:leading-[1.08]">
            {ALL.size} partner organizations
          </h2>
          <p className="text-lg leading-relaxed text-[#55555F]">
            Schools, nonprofits, county and town government, health care, local business, and
            funders, grouped by sector, not by rank.
          </p>
        </div>
        <div className="grid gap-14">
          {PARTNER_SECTORS.map((sector) => {
            const withLogo = sector.partners.filter((p) => partnerLogo(p.name));
            const without = sector.partners.filter((p) => !partnerLogo(p.name));
            return (
              <div key={sector.id} aria-labelledby={`dir-${sector.id}`}>
                <h3 id={`dir-${sector.id}`} className="flex items-center gap-2.5 border-b border-black/10 pb-3 text-lg font-extrabold text-[#1A1A1A]">
                  <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ backgroundColor: sector.color }} aria-hidden="true" />
                  {sector.title}
                  <span className="ml-auto text-sm font-semibold text-[#55555F]">{sector.partners.length}</span>
                </h3>
                {withLogo.length > 0 && (
                  <ul className="mt-6 grid grid-cols-2 gap-x-6 gap-y-6 sm:grid-cols-3 lg:grid-cols-5">
                    {withLogo.map((p) => {
                      const art = <PartnerLogoArt name={p.name} area={7600} minH={32} maxH={68} />;
                      return (
                        <li key={p.name} className="flex h-20 items-center justify-center">
                          {p.url ? (
                            <a href={p.url} target="_blank" rel="noopener noreferrer" aria-label={`${p.name} (opens their website)`} className="flex h-full w-full items-center justify-center rounded-lg p-2 transition-opacity hover:opacity-75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d42c8a]">
                              {art}
                            </a>
                          ) : (
                            <span className="flex h-full w-full items-center justify-center p-2">{art}</span>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                )}
                {without.length > 0 && (
                  <ul className="mt-5 flex flex-wrap gap-2">
                    {without.map((p) => (
                      <li key={p.name}>
                        {p.url ? (
                          <a href={p.url} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-[36px] items-center rounded-full border border-black/10 px-3 text-sm font-semibold text-[#3d3d46] hover:border-black/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d42c8a]">
                            {p.name}
                          </a>
                        ) : (
                          <span className="inline-flex min-h-[36px] items-center rounded-full border border-black/10 px-3 text-sm font-semibold text-[#3d3d46]">{p.name}</span>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
