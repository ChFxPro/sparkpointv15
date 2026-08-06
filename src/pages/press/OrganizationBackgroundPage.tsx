import { useState } from 'react';
import { Link } from 'react-router';
import { Copy, Check, Mail } from 'lucide-react';
import { SEOHead } from '../../components/SEOHead';
import { PRESS_CONTENT, PRESS_RELEASES } from '../../data/pressReleases';

import sarahWebp from '../../assets/staff_pics/webp/sp_port26__0004_sarah.webp';
import sarahJpg from '../../assets/staff_pics/sp_port26__0004_sarah.jpg';
import charlotteWebp from '../../assets/staff_pics/webp/sp_port26__0003_charlotte.webp';
import charlotteJpg from '../../assets/staff_pics/sp_port26__0003_charlotte.jpg';
import jeffWebp from '../../assets/staff_pics/webp/sp_port26__0002_jeff.webp';
import jeffJpg from '../../assets/staff_pics/sp_port26__0002_jeff.jpg';
import maggieWebp from '../../assets/staff_pics/webp/sp_port26__0001_maggie.webp';
import maggieJpg from '../../assets/staff_pics/sp_port26__0001_maggie.jpg';
import jennyWebp from '../../assets/staff_pics/webp/sp_port26__0000_jenny.webp';
import jennyJpg from '../../assets/staff_pics/sp_port26__0000_jenny.jpg';

import oraWebp from '../../assets/board_pics/webp/sp_port26_0002_ora.webp';
import oraJpg from '../../assets/board_pics/sp_port26_0002_ora.jpg';
import danielWebp from '../../assets/board_pics/webp/sp_port26_0000_daniel.webp';
import danielJpg from '../../assets/board_pics/sp_port26_0000_daniel.jpg';
import saundraWebp from '../../assets/board_pics/webp/sp_port26_0005_saundra.webp';
import saundraJpg from '../../assets/board_pics/sp_port26_0005_saundra.jpg';
import maureenWebp from '../../assets/board_pics/webp/sp_port26_0007_maureen.webp';
import maureenJpg from '../../assets/board_pics/sp_port26_0007_maureen.jpg';
import shannonWebp from '../../assets/board_pics/webp/sp_port26_0008_shannon.webp';
import shannonJpg from '../../assets/board_pics/sp_port26_0008_shannon.jpg';
import jeffreyWebp from '../../assets/board_pics/webp/sp_port26_0003_jeffrey.webp';
import jeffreyJpg from '../../assets/board_pics/sp_port26_0003_jeffrey.jpg';
import carolynWebp from '../../assets/board_pics/webp/sp_port26_0004_carolyn.webp';
import carolynJpg from '../../assets/board_pics/sp_port26_0004_carolyn.jpg';
import marshaWebp from '../../assets/board_pics/webp/sp_port26_0001_marsha.webp';
import marshaJpg from '../../assets/board_pics/sp_port26_0001_marsha.jpg';
import gailWebp from '../../assets/board_pics/webp/sp_port26_0006_gail.webp';
import gailJpg from '../../assets/board_pics/sp_port26_0006_gail.jpg';
import gloriaWebp from '../../assets/board_pics/webp/sp_port26_0009_gloria.webp';
import gloriaJpg from '../../assets/board_pics/sp_port26_0009_gloria.jpg';

const GRADIENT = 'linear-gradient(90deg, #FDB515, #F15F48, #E03694, #9E509F)';

const QUICK_FACTS = [
  { label: 'Founded', value: '2020, as a 501(c)(3) nonprofit' },
  { label: 'Service area', value: 'Transylvania County & Western North Carolina' },
  { label: 'Framework', value: 'Listen. Learn. Lead.' },
];

const HISTORY = [
  {
    year: '2019',
    text: 'Community groundwork begins as Sustainable Health for All, including the Walk for Neighbors event.',
  },
  {
    year: '2020',
    text: 'Established as a 501(c)(3). Blue Zones Project Brevard is implemented across the City of Brevard through 2023.',
  },
  {
    year: '2023',
    text: 'Brevard is certified as a Blue Zones Community. The organization introduces its public-facing identity, SparkPoint, broadening the mission countywide.',
  },
  {
    year: '2024',
    text: 'SparkPoint coordinates countywide response to Hurricane Helene, helping information, volunteers, and resources reach more than 1,200 families. Wellness and connection programming expands to 6 new programs.',
  },
  {
    year: '2025',
    text: 'Regional collaboration grows — 3 additional counties and 15 new partners join SparkPoint’s network.',
  },
];

const STAFF = [
  {
    name: 'Sarah Hankey',
    role: 'Founder / Executive Director',
    webp: sarahWebp,
    jpg: sarahJpg,
  },
  {
    name: 'Charlotte Shackleford, EdD',
    role: 'Co-Founder / Program Manager',
    webp: charlotteWebp,
    jpg: charlotteJpg,
  },
  {
    name: 'Jeff Bannister',
    role: 'Marketing Manager',
    webp: jeffWebp,
    jpg: jeffJpg,
  },
  {
    name: 'Maggie Grimm',
    role: 'Outreach Coordinator',
    webp: maggieWebp,
    jpg: maggieJpg,
  },
  {
    name: 'Jenny Carlberg',
    role: 'Development Manager',
    webp: jennyWebp,
    jpg: jennyJpg,
  },
];

const BOARD = [
  {
    name: 'Dr. Ora Wells',
    role: 'Board President',
    webp: oraWebp,
    jpg: oraJpg,
  },
  {
    name: 'Daniel Mehdi',
    role: 'Vice President',
    webp: danielWebp,
    jpg: danielJpg,
  },
  {
    name: 'Saundra Lemaster',
    role: 'Treasurer',
    webp: saundraWebp,
    jpg: saundraJpg,
  },
  {
    name: 'Mayor Maureen Copelof',
    role: 'Board Member',
    webp: maureenWebp,
    jpg: maureenJpg,
  },
  {
    name: 'Shannon Meadows Allison',
    role: 'Board Member',
    webp: shannonWebp,
    jpg: shannonJpg,
  },
  {
    name: 'Jeffrey Ambrose',
    role: 'Board Member',
    webp: jeffreyWebp,
    jpg: jeffreyJpg,
  },
  {
    name: 'Carolyn Foster',
    role: 'Board Member',
    webp: carolynWebp,
    jpg: carolynJpg,
  },
  {
    name: 'Marsha C. Farrell',
    role: 'Board Member',
    webp: marshaWebp,
    jpg: marshaJpg,
  },
  {
    name: 'Gail Masterson',
    role: 'Board Member',
    webp: gailWebp,
    jpg: gailJpg,
  },
  {
    name: 'Gloria Clouse',
    role: 'Board Member',
    webp: gloriaWebp,
    jpg: gloriaJpg,
  },
];

const FOCUS_AREAS = [
  {
    title: 'Storytelling & Community Voice',
    body: 'Collecting and sharing community stories through projects like Echoes from the Community and Story Lab Studios, so lived experience shapes local decisions.',
  },
  {
    title: 'Wellness & Connection Programming',
    body: 'Programs such as Thrive @ 5, Social Health 101, and Learn & Connect Nights that build social connection and well-being at every stage of life.',
  },
  {
    title: 'Leadership & Workplace Well-Being',
    body: 'Purpose Workshops and workplace culture programming that help local leaders and organizations build healthier, more connected teams.',
  },
  {
    title: 'Community & Regional Collaboration',
    body: 'Infrastructure like Community Connectors and the Resilience Hub that link nonprofits, schools, and healthcare providers into one coordinated network.',
  },
];

export function OrganizationBackgroundPage() {
  const [copied, setCopied] = useState(false);
  const mediaContact = PRESS_RELEASES[0]?.mediaContact;

  function handleCopyBoilerplate() {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(PRESS_CONTENT.portal.boilerplate).catch(() => undefined);
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  }

  return (
    <div className="min-h-screen bg-white pt-20">
      <SEOHead
        title="Organization Background | SparkPoint"
        description="SparkPoint's mission, history, leadership, and current work — a quick-reference fact sheet for press, partners, and funders."
        path="/organization-background"
      />

      {/* Hero */}
      <section className="px-6 pb-14 pt-16 text-center">
        <div className="mx-auto max-w-2xl">
          <span aria-hidden="true" className="mx-auto mb-5 block h-1 w-10 rounded-full" style={{ backgroundImage: GRADIENT }} />
          <h1 className="text-4xl font-bold tracking-tight text-[#1A1A1A] md:text-5xl">Organization background</h1>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-7 text-gray-600">
            A quick reference for press, partners, and funders — mission, history, leadership, and current work in one place.
          </p>
        </div>
      </section>

      {/* Quick facts */}
      <section className="mx-auto max-w-4xl px-6">
        <div className="grid gap-4 rounded-3xl border border-gray-100 bg-[#FAF9F7] p-6 sm:grid-cols-3 sm:p-8">
          {QUICK_FACTS.map((fact) => (
            <div key={fact.label}>
              <div className="text-xs font-bold uppercase tracking-widest text-gray-400">{fact.label}</div>
              <div className="mt-1 text-sm font-semibold leading-6 text-[#1A1A1A]">{fact.value}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Boilerplate */}
      <section className="mx-auto max-w-4xl px-6 py-16">
        <span aria-hidden="true" className="mb-4 block h-1 w-10 rounded-full" style={{ backgroundImage: GRADIENT }} />
        <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-2xl font-bold uppercase tracking-tight text-[#1A1A1A]">About SparkPoint</h2>
          <button
            type="button"
            onClick={handleCopyBoilerplate}
            className="inline-flex items-center gap-2 rounded-full border border-gray-200 px-4 py-2 text-xs font-bold text-[#1A1A1A] hover:border-[#1A1A1A]"
          >
            {copied ? <Check className="h-3.5 w-3.5" aria-hidden="true" /> : <Copy className="h-3.5 w-3.5" aria-hidden="true" />}
            {copied ? 'Copied' : 'Copy boilerplate'}
          </button>
        </div>
        <p className="rounded-2xl border border-gray-100 bg-white p-6 text-base leading-7 text-gray-700 shadow-sm">
          {PRESS_CONTENT.portal.boilerplate}
        </p>
      </section>

      {/* History */}
      <section className="bg-[#FAF9F7] px-6 py-16">
        <div className="mx-auto max-w-4xl">
          <span aria-hidden="true" className="mb-4 block h-1 w-10 rounded-full" style={{ backgroundImage: GRADIENT }} />
          <h2 className="text-2xl font-bold uppercase tracking-tight text-[#1A1A1A]">History</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-600">
            The short version. For the full story, photos, and milestones, see the{' '}
            <Link to="/about" className="font-semibold text-[#E03694] underline underline-offset-4">
              About page
            </Link>
            .
          </p>
          <div className="mt-8 space-y-6">
            {HISTORY.map((item) => (
              <div key={item.year} className="flex gap-5 rounded-2xl border border-gray-100 bg-white p-5">
                <div className="w-16 shrink-0 text-lg font-bold text-[#E03694]">{item.year}</div>
                <p className="text-sm leading-6 text-gray-700">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <div className="mb-2 flex flex-wrap items-start justify-between gap-4">
          <div>
            <span aria-hidden="true" className="mb-4 block h-1 w-10 rounded-full" style={{ backgroundImage: GRADIENT }} />
            <h2 className="text-2xl font-bold uppercase tracking-tight text-[#1A1A1A]">Leadership</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-600">
              The full staff team and Board of Directors, at a glance.
            </p>
          </div>
          <Link to="/about" className="text-sm font-semibold text-[#E03694] underline underline-offset-4">
            View full bios on the About page →
          </Link>
        </div>

        <h3 className="mt-10 mb-6 text-xs font-bold uppercase tracking-widest text-gray-400">Staff</h3>
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5">
          {STAFF.map((person) => (
            <div key={person.name} className="text-center">
              <picture>
                <source srcSet={person.webp} type="image/webp" />
                <img
                  src={person.jpg}
                  alt={person.name}
                  className="mx-auto h-24 w-24 rounded-full object-cover shadow-sm"
                  loading="lazy"
                />
              </picture>
              <div className="mt-3 text-sm font-bold text-[#1A1A1A]">{person.name}</div>
              <div className="text-xs text-gray-500">{person.role}</div>
            </div>
          ))}
        </div>

        <h3 className="mt-14 mb-6 text-xs font-bold uppercase tracking-widest text-gray-400">Board of Directors</h3>
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5">
          {BOARD.map((person) => (
            <div key={person.name} className="text-center">
              <picture>
                <source srcSet={person.webp} type="image/webp" />
                <img
                  src={person.jpg}
                  alt={person.name}
                  className="mx-auto h-24 w-24 rounded-full object-cover shadow-sm"
                  loading="lazy"
                />
              </picture>
              <div className="mt-3 text-sm font-bold text-[#1A1A1A]">{person.name}</div>
              <div className="text-xs text-gray-500">{person.role}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Current work */}
      <section className="bg-[#FAF9F7] px-6 py-16">
        <div className="mx-auto max-w-4xl">
          <span aria-hidden="true" className="mb-4 block h-1 w-10 rounded-full" style={{ backgroundImage: GRADIENT }} />
          <h2 className="text-2xl font-bold uppercase tracking-tight text-[#1A1A1A]">Current work</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-600">
            Four connected focus areas. See the full program list on the{' '}
            <Link to="/programs" className="font-semibold text-[#E03694] underline underline-offset-4">
              Programs page
            </Link>
            .
          </p>
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {FOCUS_AREAS.map((area) => (
              <div key={area.title} className="rounded-2xl border border-gray-100 bg-white p-6">
                <h3 className="mb-2 text-sm font-bold text-[#1A1A1A]">{area.title}</h3>
                <p className="text-sm leading-6 text-gray-600">{area.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Media contact */}
      {mediaContact ? (
        <section className="mx-auto max-w-4xl px-6 pb-20">
          <aside className="rounded-3xl bg-[#1A1A1A] p-8 text-white md:p-10">
            <Mail className="text-[#FDB515]" aria-hidden="true" />
            <h2 className="mt-5 text-2xl font-bold">Media contact</h2>
            <div className="mt-5 leading-7 text-white/80">
              <p className="font-bold text-white">{mediaContact.name}</p>
              {mediaContact.title ? <p>{mediaContact.title}</p> : null}
              <p>{mediaContact.organization}</p>
              {mediaContact.email ? (
                <a className="mt-4 inline-block font-semibold text-[#FDB515] hover:underline" href={`mailto:${mediaContact.email}`}>
                  {mediaContact.email}
                </a>
              ) : null}
            </div>
          </aside>
        </section>
      ) : null}
    </div>
  );
}
