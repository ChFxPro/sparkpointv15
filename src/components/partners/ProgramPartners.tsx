import { Link } from 'react-router';
import { ArrowRight } from 'lucide-react';
import { PartnerLogoArt } from './PartnerLogoArt';
import { partnerLogo } from '../partnerLogos';
import { allPrograms } from '../../pages/programs/programsData';
import { ProgramLogo } from '../../pages/programs/ProgramLogo';

// "Partners in our programs": the programs SparkPoint runs with named partners,
// each with its partners' logos. Names match src/data/partners.ts exactly, so
// logos come from src/assets/partner-logos/ automatically.

type Collaboration = {
  id: string;
  title: string;
  /** The program whose own logo heads the card, if it has one (logos live in programsData). */
  programId?: string;
  pathwayColor: string;
  body: string;
  partners: string[];
  /** Shown when the collaboration's members aren't listed by name. */
  membersNote?: string;
  href: string;
  linkLabel: string;
};


const COLLABORATIONS: Collaboration[] = [
  {
    id: 'wrc',
    title: 'Wellness Rooted in Connection Collaborative',
    programId: 'wellness-rooted-in-connection-collaborative-trcn',
    pathwayColor: '#075079',
    body: 'A community of practice where organizations listen together and strengthen mental wellness and resilience across the county.',
    partners: [],
    membersNote: 'Organizations from education, health, youth work, and food access across Transylvania County.',
    href: '/programs/wellness-rooted-in-connection-collaborative-trcn',
    linkLabel: 'About the collaborative',
  },
  {
    id: 'community-connectors',
    title: 'Community Connectors',
    programId: 'community-connectors',
    pathwayColor: '#224a39',
    body: 'Trusted neighbors with the training and tools to help their communities get ready for hard days and recover from them.',
    partners: ['American Red Cross', 'FWRD Transylvania (LTRG)'],
    href: '/community-connectors',
    linkLabel: 'Meet the Connectors',
  },
  {
    id: 'powher',
    title: 'PowHer',
    programId: 'powher',
    pathwayColor: '#ba2e93',
    body: 'A monthly gathering of women for honest conversation, shared growth, leadership, and belonging.',
    partners: ['Pisgah Health Foundation', 'Brevard/Transylvania Chamber of Commerce', 'KL Creative'],
    href: '/programs/powher',
    linkLabel: 'About PowHer',
  },
  {
    id: 'trailhead',
    title: 'TrailHead',
    programId: 'trailhead',
    pathwayColor: '#2F4A3C',
    body: 'TrailHead is a SparkPoint simulation. Its first edition, TrailHead: Rural Health, was built for the October 1 Western NC Regional Rural Health Convening with the North Carolina Rural Health Association and the Foundation for Health Leadership and Innovation, with a statewide briefing from the NC DHHS Office of Rural Health.',
    partners: ['North Carolina Rural Health Association', 'Foundation for Health Leadership and Innovation', 'NC DHHS Office of Rural Health'],
    href: '/programs/trailhead',
    linkLabel: 'About TrailHead',
  },
];

export function ProgramPartners() {
  return (
    <section id="section-program-partners" aria-labelledby="program-partners-heading" className="relative z-10 bg-white px-6 py-20 md:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 grid gap-5 lg:grid-cols-[1fr_1.1fr] lg:items-end lg:gap-16">
          <h2 id="program-partners-heading" className="text-3xl font-extrabold tracking-tight text-[#1A1A1A] md:text-[2.6rem] md:leading-[1.08]" style={{ textWrap: 'balance' }}>
            Partners in our programs
          </h2>
          <p className="text-lg leading-relaxed text-[#55555F]">
            Some of SparkPoint&rsquo;s programs are built and run together with partners. These
            are the collaborations, and who&rsquo;s in them.
          </p>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          {COLLABORATIONS.map((c) => {
            const program = c.programId ? allPrograms.find((p) => p.id === c.programId) : undefined;
            return (
            <article key={c.id} aria-labelledby={`collab-${c.id}`} className="relative flex flex-col overflow-hidden rounded-[1.25rem] border border-black/10 bg-white p-6 md:p-7">
              <span className="absolute inset-x-0 top-0 h-1.5" style={{ background: c.pathwayColor }} aria-hidden="true" />
              <h3 id={`collab-${c.id}`} className="text-xl font-extrabold leading-tight text-[#1A1A1A] md:text-[1.4rem]">
                {program?.logo ? <ProgramLogo program={program} className="block h-auto max-w-full" /> : c.title}
              </h3>
              <p className="mt-3 text-base leading-relaxed text-[#55555F]">{c.body}</p>
              {c.partners.length > 0 ? (
                <ul className="mt-6 flex flex-wrap items-center gap-x-8 gap-y-5" aria-label={`${c.title} partners`}>
                  {c.partners.map((name) => (
                    <li key={name} className="flex min-h-[56px] items-center">
                      {partnerLogo(name) ? (
                        <PartnerLogoArt name={name} area={5200} minH={28} maxH={56} />
                      ) : (
                        <span className="rounded-full border border-black/10 px-3 py-1.5 text-sm font-semibold text-[#3d3d46]">{name}</span>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-6 rounded-xl bg-[#f6f3f4] px-4 py-3 text-[0.95rem] font-semibold text-[#3d3d46]">{c.membersNote}</p>
              )}
              <div className="mt-auto pt-6">
                <Link to={c.href} className="inline-flex min-h-[44px] items-center gap-1.5 font-bold text-[#b81f73] underline-offset-4 hover:underline">
                  {c.linkLabel} <ArrowRight size={16} aria-hidden="true" />
                </Link>
              </div>
            </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
