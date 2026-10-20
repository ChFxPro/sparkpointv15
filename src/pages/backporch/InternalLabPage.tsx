// /internal/lab: the Porch Lab bench. Every experimental tool, running on sample
// content, with its stage, what's left, and the checklist it must pass before release.
import { Link } from 'react-router';
import { SEOHead } from '../../components/SEOHead';
import { RequireInternalAuth } from '../../components/RequireInternalAuth';
import { PostBlocks } from '../../components/backporch/PostBlocks';
import { Reactions } from '../../components/backporch/lab/LabBlocks';
import { BLOCK_LABELS, normalizeBlocks, type PorchBlock } from '../../lib/porchBlocks';
import { LAB_FEATURES, LAB_TOOLS, RELEASE_CHECKLIST, STAGE_LABELS } from '../../lib/porchLab';
import '../internalReports.css';
import './internalBackporch.css';

const R = '/assets/Rural Health/recap/';
const photo = (n: string, alt: string) => ({ path: `${R}rhc-2026-${n}-1600.webp`, alt });

// Sample content for each tool. Photos are the convening recap's, already on the site.
const SAMPLES: Record<string, PorchBlock[]> = {
  motionText: [
    { id: 's1', type: 'motionText', text: 'Resilience is built through relationships, one porch at a time.', effect: 'type', size: 'large' },
    { id: 's2', type: 'motionText', text: 'When neighbors know neighbors, the whole county is a little stronger.', effect: 'light', size: 'large' },
  ],
  backdrop: [
    { id: 's3', type: 'backdrop', scene: 'sunrise', heading: 'Good morning, Transylvania County', sub: 'Sunrise over the ridges' },
    { id: 's4', type: 'backdrop', scene: 'fireflies', heading: 'Fireflies at dusk' },
    { id: 's5', type: 'backdrop', scene: 'ridges', heading: 'Drifting ridges' },
  ],
  counter: [
    {
      id: 's6',
      type: 'counter',
      items: [
        { value: 71, suffix: '%', label: 'of rural U.S. adults use Facebook (Pew, 2025)' },
        { value: 150, label: 'seats at the convening' },
        { value: 3, label: 'sample number' },
      ],
    },
  ],
  beforeAfter: [
    {
      id: 's7',
      type: 'beforeAfter',
      before: photo('01', 'The convening room at the start of the day.'),
      after: photo('02', 'People talking in small groups later in the day.'),
      beforeLabel: 'Morning',
      afterLabel: 'Afternoon',
    },
  ],
  scrolly: [
    {
      id: 's8',
      type: 'scrolly',
      steps: [
        { text: 'Morning: the room fills up. Rural health leaders from across Western North Carolina find their tables.', image: photo('01', 'A full room at round tables.') },
        { text: 'The program starts. A keynote frames the day around cooperation.', image: photo('03', 'A speaker at the front of the room.') },
        { text: 'Then the real work: small groups, side conversations, numbers traded.', image: photo('02', 'People talking in small groups.') },
        { text: 'By the afternoon, plans are being written down.', image: photo('04', 'Participants reviewing materials.') },
      ],
    },
  ],
  timeline: [
    {
      id: 's9',
      type: 'timeline',
      items: [
        { date: 'Sept 2024', title: 'Hurricane Helene', text: 'The county begins a long recovery.' },
        { date: 'Sept 2025', title: 'One year of healing', text: 'Neighbors mark the anniversary together.' },
        { date: 'Oct 1, 2026', title: 'A full house at Deerwoode Reserve' },
        { date: 'Dec 11, 2026', title: 'The SparkPoint Gala' },
      ],
    },
  ],
  poll: [{ id: 's10', type: 'poll', question: 'What should the next Porch Talk be about?', options: ['Brain health', 'Caregiving', 'Local food', 'Something else'] }],
};

function LabBench() {
  return (
    <div className="ir-shell pe-shell lab-bench">
      <p className="pe-help" style={{ maxWidth: '62ch' }}>
        Tools graduate from <strong>Lab</strong> (previews only) to <strong>Field test</strong> (on published posts, with a
        small tag) to <strong>Released</strong>. Moving a tool is a one-line change in <code>src/lib/porchLab.ts</code>.
      </p>

      <section className="lab-checklist">
        <h2>Before a tool is released</h2>
        <ul>
          {RELEASE_CHECKLIST.map((c) => (
            <li key={c}>{c}</li>
          ))}
        </ul>
      </section>

      {LAB_TOOLS.map((tool) => (
        <section key={tool.type} className="lab-tool" aria-labelledby={`lab-${tool.type}`}>
          <header>
            <h2 id={`lab-${tool.type}`}>
              {BLOCK_LABELS[tool.type]} <span className="bc-stage" data-stage={tool.stage}>{STAGE_LABELS[tool.stage]}</span>
            </h2>
            <p>{tool.pitch}</p>
            {tool.notes && <p className="pe-help">Still to do: {tool.notes}</p>}
          </header>
          <div className="porch porch-dusk lab-stage-frame">
            <PostBlocks blocks={normalizeBlocks(SAMPLES[tool.type] ?? [])} preview />
          </div>
        </section>
      ))}

      {Object.entries(LAB_FEATURES).map(([key, f]) => (
        <section key={key} className="lab-tool">
          <header>
            <h2>
              {f.name} <span className="bc-stage" data-stage={f.stage}>{STAGE_LABELS[f.stage]}</span>
            </h2>
            <p>{f.pitch}</p>
            {f.notes && <p className="pe-help">Still to do: {f.notes}</p>}
          </header>
          {key === 'reactions' && (
            <div className="porch porch-dusk lab-stage-frame">
              <Reactions postId="lab-bench" live={false} />
            </div>
          )}
          {key === 'takeover' && (
            <p className="pe-help">
              Turn it on in a post's “how this post presents itself” settings, then use “Preview the whole post”.
            </p>
          )}
        </section>
      ))}
    </div>
  );
}

function LabShell({ demo = false }: { demo?: boolean }) {
  return (
      <div className="ir-page pe-page">
        <SEOHead title="Porch Lab | SparkPoint" description="Experimental BackPorch tools." path="/internal/lab" noindex />
        <header className="ir-masthead">
          <Link className="ir-back-link" to={demo ? '/internal/backporch/demo' : '/internal/backporch'}>
            ← BackPorch editor
          </Link>
        </header>
        <div className="pe-hero">
          <div className="pe-hero-inner">
            <h1>
              The Porch <span>Lab</span>
            </h1>
            <p>Experimental tools for BackPorch posts. Play with them here; the good ones graduate.</p>
          </div>
        </div>
        <LabBench />
      </div>
  );
}

export default function InternalLabPage() {
  return (
    <RequireInternalAuth>
      <LabShell />
    </RequireInternalAuth>
  );
}

/** /internal/lab/demo: the bench without sign-in, on the local dev server only. */
export function InternalLabDemoPage() {
  return <LabShell demo />;
}

export { LabBench };
