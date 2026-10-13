import type { CSSProperties, ReactNode } from 'react';
import { motion } from 'motion/react';
import {
  ArrowDown,
  BookOpen,
  Check,
  Ear,
  GraduationCap,
  HandHeart,
  MapPin,
  MessageSquareQuote,
  Repeat,
  Rocket,
  Search,
  ShieldCheck,
  UserPlus,
  Users,
  type LucideIcon,
} from 'lucide-react';
import { Sparkmark } from '../../components/Sparkmark';
import studioSmall from '../../assets/hub/storylab-studio-960.webp';
import studioLarge from '../../assets/hub/storylab-studio-1536.webp';
import { RenderingNote } from './HubPlaceSections';
import './resilienceHub.css';

// Figures and copy below come from the StoryLab · Resilience Hub one-pager
// (v2, October 2026). They describe SparkPoint's 2025 story-collection work,
// not the site-wide 2025 rollups in src/data/impact2025.ts — update them here
// when the one-pager changes.

type Stat = { value: string; label: string; detail: string; icon: LucideIcon };

const GROUNDWORK_STATS: Stat[] = [
  { value: '3,622', label: 'Verified participants', detail: 'across 68 events in 2025', icon: Users },
  { value: '~11%', label: 'Of the county reached', detail: 'Transylvania County population', icon: MapPin },
  { value: '120+', label: 'Helene recovery stories', detail: 'from 10 collection sites', icon: MessageSquareQuote },
  { value: '42', label: 'Residents connected', detail: 'to recovery support', icon: HandHeart },
];

type Step = { label: string; when?: string; body: string; icon: LucideIcon; accent: string };

const STORY_CYCLE: Step[] = [
  {
    label: 'Listen',
    body: 'Stories gathered across age and geography (events, rural stops, QR codes, paper, audio), with consent and dignity first.',
    icon: Ear,
    accent: '#E03694',
  },
  {
    label: 'Learn',
    body: 'Stories reviewed and coded for patterns: where challenges cluster, what is working, what needs repair.',
    icon: Search,
    accent: '#F15F48',
  },
  {
    label: 'Lead',
    body: 'Insight shapes programs, partnerships, and funding, and the learning is returned to the community.',
    icon: BookOpen,
    accent: '#F59E0B',
  },
];

const FELLOWSHIP_CYCLE: Step[] = [
  { label: 'Train', when: 'Fall', body: 'Fellows learn inside StoryLab on real production work.', icon: GraduationCap, accent: '#9E509F' },
  { label: 'Deploy', when: 'Spring', body: 'Each fellow is placed with a partner organization.', icon: Rocket, accent: '#E03694' },
  { label: 'Backfill', when: 'Spring', body: 'A new fellow enters the studio behind them.', icon: UserPlus, accent: '#F15F48' },
  { label: 'Repeat', when: 'Every year', body: 'A pipeline, not a one-off program.', icon: Repeat, accent: '#F59E0B' },
];

// Numbers match the markers placed on the studio rendering (x/y in percent).
const STUDIO_ZONES = [
  { title: 'Editing workstation', body: 'Recordings become captioned video, archives, and usable media.', x: 14, y: 50 },
  { title: 'Interview seating', body: 'Two chairs and room to talk without a stage.', x: 33, y: 49 },
  { title: 'Camera and lighting', body: 'A standing setup, ready when someone is ready to talk.', x: 50, y: 31 },
  { title: 'Filing and media storage', body: 'Recordings, files, and archives kept organized in one place.', x: 88, y: 49 },
  { title: 'A warm, quiet room', body: 'Acoustic panels and soft light: professional, not clinical.', x: 38, y: 19 },
];

type Initiative = {
  id: 'storylab' | 'media-navigators';
  name: string;
  definition: string;
  rows: { label: string; value: string }[];
  linkLabel: string;
};

// Short definitions are SparkPoint's own (StoryLab interview prep, June 2026).
const INITIATIVES: Initiative[] = [
  {
    id: 'storylab',
    name: 'StoryLab',
    definition:
      'A community media studio and listening process where lived experience becomes useful learning.',
    rows: [
      { label: 'What it is', value: 'A 128 sq ft studio and a Listen, Learn, Lead process' },
      { label: 'Who takes part', value: 'Residents, nonprofits, and local leaders sharing their stories' },
      { label: 'What comes of it', value: 'Story collections, archives, and insight that shapes programs and funding' },
    ],
    linkLabel: 'Explore StoryLab',
  },
  {
    id: 'media-navigators',
    name: 'Media Navigators',
    definition:
      'A trained local media generalist who helps organizations communicate clearly and ethically.',
    rows: [
      { label: 'What it is', value: 'A paid fellowship: train in the fall, place with a partner in the spring' },
      { label: 'Who takes part', value: 'Local talent looking for a path into media and communications' },
      { label: 'What comes of it', value: 'Careers for fellows, and communications capacity for partners' },
    ],
    linkLabel: 'Meet the fellowship',
  },
];

const WHY_HERE = [
  'Uneven digital access and limited media infrastructure across the county',
  'Nonprofits stretched thin, without capacity to document or communicate',
  'High isolation among older adults and rural residents',
  'Few local career pathways in creative and digital fields',
];

const TRUST_PRINCIPLES = [
  { title: 'Active consent', body: 'People can opt out at any time.' },
  { title: 'Trauma-informed', body: 'Story work is shaped around the safety and pace of the person sharing.' },
  { title: 'People decide', body: 'AI assists with transcription and tools; it never makes the call.' },
  { title: 'Human review', body: 'A person checks every step before anything is shared.' },
];

type RevealProps = { reveal: { duration: number; ease?: 'easeOut' } };

function Kicker({ children, tone = 'dark' }: { children: ReactNode; tone?: 'dark' | 'light' }) {
  return <p className={`rh-kicker rh-kicker--${tone}`}>{children}</p>;
}

// ─── Groundwork stats ───

export function GroundworkSection({ reveal }: RevealProps) {
  return (
    <section className="rh-band rh-band--paper" aria-labelledby="rh-groundwork-title">
      <div className="rh-wrap">
        <motion.div
          className="rh-head"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={reveal}
        >
          <Kicker tone="light">The groundwork</Kicker>
          <h2 id="rh-groundwork-title" className="rh-title rh-title--ink">
            The hub isn&rsquo;t starting from zero.
          </h2>
          <p className="rh-lede rh-lede--ink">
            After Hurricane Helene, SparkPoint listened across Transylvania County. Those
            stories revealed unmet needs and connected residents to recovery support. The
            Resilience Hub gives that work a permanent address.
          </p>
        </motion.div>
        <ul className="rh-stats">
          {GROUNDWORK_STATS.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.li
                key={stat.label}
                className="rh-stat"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={reveal.duration ? { duration: 0.5, delay: index * 0.07 } : reveal}
              >
                <span className="rh-stat__icon" aria-hidden="true">
                  <Icon size={20} strokeWidth={2.2} />
                </span>
                <span className="rh-stat__value">{stat.value}</span>
                <span className="rh-stat__label">{stat.label}</span>
                <span className="rh-stat__detail">{stat.detail}</span>
              </motion.li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

// ─── Two initiatives, one home ───

export function InitiativesSection({ reveal }: RevealProps) {
  return (
    <section className="rh-band rh-band--white" aria-labelledby="rh-initiatives-title">
      <div className="rh-wrap">
        <motion.div
          className="rh-head"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={reveal}
        >
          <Kicker tone="light">At the Resilience Hub</Kicker>
          <h2 id="rh-initiatives-title" className="rh-title rh-title--ink">
            Two initiatives, one home.
          </h2>
          <p className="rh-lede rh-lede--ink">
            StoryLab is the place and the listening process. Media Navigators are the people it
            trains. They share a studio, a set of ethics, and a goal: turn local experience into
            local capacity.
          </p>
        </motion.div>

        <div className="rh-initiatives">
          {INITIATIVES.map((item, index) => (
            <motion.article
              key={item.id}
              className={`rh-initiative rh-initiative--${item.id}`}
              aria-labelledby={`rh-initiative-${item.id}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={reveal.duration ? { duration: 0.5, delay: index * 0.1 } : reveal}
            >
              <h3 id={`rh-initiative-${item.id}`} className="rh-initiative__name">
                {item.name}
              </h3>
              <p className="rh-initiative__definition">{item.definition}</p>
              <dl className="rh-initiative__rows">
                {item.rows.map((row) => (
                  <div key={row.label}>
                    <dt>{row.label}</dt>
                    <dd>{row.value}</dd>
                  </div>
                ))}
              </dl>
              <a className="rh-initiative__link" href={`#${item.id}`}>
                {item.linkLabel}
                <ArrowDown size={16} aria-hidden="true" />
              </a>
            </motion.article>
          ))}
          <p className="rh-initiatives__bridge">
            <span>Navigators train inside StoryLab, then carry those skills to partners.</span>
          </p>
        </div>
      </div>
    </section>
  );
}

// ─── StoryLab: what it is + the Listen → Learn → Lead cycle ───

function CycleRow({ steps, variant }: { steps: Step[]; variant: 'dark' | 'light' }) {
  return (
    <ol className={`rh-cycle rh-cycle--${variant} rh-cycle--${steps.length}`}>
      {steps.map((step) => {
        const Icon = step.icon;
        return (
          <li key={step.label} className="rh-cycle__step" style={{ '--accent': step.accent } as CSSProperties}>
            <span className="rh-cycle__icon" aria-hidden="true">
              <Icon size={22} strokeWidth={2.1} />
            </span>
            <span className="rh-cycle__label">{step.label}</span>
            {step.when && <span className="rh-cycle__when">{step.when}</span>}
            <span className="rh-cycle__body">{step.body}</span>
          </li>
        );
      })}
    </ol>
  );
}

export function StoryLabSection({ reveal }: RevealProps) {
  return (
    <section id="storylab" className="rh-band rh-band--night" aria-labelledby="rh-storylab-title">
      <div className="rh-wrap">
        <motion.div
          className="rh-head rh-head--wide"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={reveal}
        >
          <Kicker>StoryLab at the Resilience Hub</Kicker>
          <h2 id="rh-storylab-title" className="rh-title rh-title--display">
            The stories were already here.{' '}
            <span className="rh-gradient-text">Now they&rsquo;re getting a home.</span>
          </h2>
          <p className="rh-lede">
            StoryLab is SparkPoint&rsquo;s community media studio and listening process.
            Residents, nonprofits, and local leaders record stories, oral histories, and
            reflections in a respectful, professional setting. We review what people share for
            patterns, then turn it into captioned video, archives, and public learning that
            informs what the community does next.
          </p>
        </motion.div>

        <CycleRow steps={STORY_CYCLE} variant="dark" />

        <motion.p
          className="rh-callout"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={reveal}
        >
          <Sparkmark size="1.6em" />
          <span>
            Not storytelling for awareness alone. Storytelling that helps people, partners,
            and funders act with better information.
          </span>
        </motion.p>

        <div className="rh-studio-block">
          <motion.figure
            className="rh-studio-shot"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={reveal}
          >
            <div className="rh-studio-shot__frame">
              <img
                src={studioLarge}
                srcSet={`${studioSmall} 960w, ${studioLarge} 1536w`}
                sizes="(min-width: 1024px) 680px, 100vw"
                alt="Conceptual rendering of the StoryLab studio: a long, narrow room with an editing desk and two monitors along the left wall, two cream armchairs at the far end, a camera on a tripod and a softbox light aimed at the chairs, a curtained window on the right, and shelving with storage boxes by the door."
                width={1536}
                height={1024}
                loading="lazy"
              />
              {STUDIO_ZONES.map((zone, index) => (
                <span
                  key={zone.title}
                  className="rh-studio-shot__pin"
                  style={{ left: `${zone.x}%`, top: `${zone.y}%` }}
                  aria-hidden="true"
                >
                  {index + 1}
                </span>
              ))}
            </div>
            <figcaption>
              <RenderingNote />
            </figcaption>
          </motion.figure>
          <div>
            <h3 className="rh-studio-block__title">Inside the studio</h3>
            <p className="rh-studio-block__meta">Office, edit bay, and filming studio in 128 sq ft</p>
            <ol className="rh-studio-zones">
              {STUDIO_ZONES.map((zone, index) => (
                <li key={zone.title}>
                  <span className="rh-studio-zones__n" aria-hidden="true">{index + 1}</span>
                  <span>
                    <strong>{zone.title}</strong>
                    {zone.body}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Media Navigator Fellowship ───

export function FellowshipSection({ reveal }: RevealProps) {
  return (
    <section id="media-navigators" className="rh-band rh-band--plum" aria-labelledby="rh-fellowship-title">
      <div className="rh-wrap">
        <motion.div
          className="rh-head rh-head--wide"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={reveal}
        >
          <p className="rh-kicker rh-kicker--plum">Media Navigator Fellowship</p>
          <h2 id="rh-fellowship-title" className="rh-title rh-title--display">
            Rural learning meets <span className="rh-plum-text">real-world work.</span>
          </h2>
          <p className="rh-lede">
            StoryLab trains paid Media Navigator Fellows: ethical, AI-literate media
            generalists who learn through real production work, build portfolios, and support
            nonprofits, agencies, and small businesses that need communications capacity but
            can&rsquo;t sustain a specialist.
          </p>
        </motion.div>

        <div className="rh-navigator-pair">
          <div>
            <h3>For fellows</h3>
            <p>
              Paid, hands-on training in video, audio, editing, captioning, and responsible AI
              tools, with a portfolio and a partner placement at the end of it.
            </p>
          </div>
          <div>
            <h3>For partners</h3>
            <p>
              A trained Navigator who can document programs, tell your story, and handle
              everyday communications, without the cost of a full-time specialist.
            </p>
          </div>
        </div>

        <CycleRow steps={FELLOWSHIP_CYCLE} variant="dark" />

        <p className="rh-note rh-note--dark">
          A strength-based pathway for local talent, including neurodivergent minds, to grow,
          contribute, and build careers right here at home.
        </p>
      </div>
    </section>
  );
}

// ─── Why it matters here + trust & ethics ───

export function WhyTrustSection({ reveal }: RevealProps) {
  return (
    <section className="rh-band rh-band--night" aria-labelledby="rh-why-title">
      <motion.blockquote
        className="rh-wrap rh-quote"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={reveal}
      >
        <p>
          In a rural county, stories are often where the real information lives. StoryLab helps
          us listen with dignity, identify patterns, preserve community memory, and turn lived
          experience into better decisions.
        </p>
      </motion.blockquote>
      <div className="rh-wrap rh-split">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={reveal}
        >
          <Kicker>Why it matters here</Kicker>
          <h2 id="rh-why-title" className="rh-title">
            Rural stories deserve to be preserved and acted on.
          </h2>
          <ul className="rh-checks">
            {WHY_HERE.map((item) => (
              <li key={item}>
                <Check size={16} strokeWidth={3} aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
        </motion.div>
        <motion.div
          className="rh-trust"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={reveal}
        >
          <div className="rh-trust__head">
            <span className="rh-trust__icon" aria-hidden="true">
              <ShieldCheck size={24} strokeWidth={2} />
            </span>
            <div>
              <h3>Built on trust and ethics</h3>
              <p>Technology supports the work. People make the decisions.</p>
            </div>
          </div>
          <dl className="rh-trust__list">
            {TRUST_PRINCIPLES.map((item) => (
              <div key={item.title}>
                <dt>{item.title}</dt>
                <dd>{item.body}</dd>
              </div>
            ))}
          </dl>
        </motion.div>
      </div>
    </section>
  );
}
