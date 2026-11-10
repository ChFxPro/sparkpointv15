import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { SEOHead } from '../components/SEOHead';
import { RequireInternalAuth } from '../components/RequireInternalAuth';
import { useInternalAuth } from '../hooks/useInternalAuth';
import { supabase } from '../lib/supabaseClient';
import './internalReports.css';

// /internal: the staff portal. Staff sign-in lands here (unless they were headed to a
// particular tool), and every internal tool's header links back. Behind the same
// Supabase Auth as the tools themselves; each tool still enforces its own access
// (the BackPorch, for one, checks porch_editors in the database).
//
// To add a back-end tool, add an entry to TOOLS.

const PAGE_PATH = '/internal';
const SPARKPOINT_LOGO = `${import.meta.env.BASE_URL}logo-wordmark.webp`;

interface Tool {
  href: string;
  group: string;
  title: string;
  about: string;
  /** Who can use it, beyond being signed in. */
  access?: 'porchEditor';
  /** Its local demo, if it has one (dev server only). */
  demoHref?: string;
}

export const TOOLS: Tool[] = [
  {
    href: '/internal/backporch',
    group: 'The BackPorch',
    title: 'BackPorch editor',
    about: 'Write, schedule, pin, and take down posts, and make the Facebook kit for each one.',
    access: 'porchEditor',
    demoHref: '/internal/backporch/demo',
  },
  {
    href: '/internal/lab',
    group: 'The BackPorch',
    title: 'Porch Lab',
    about: 'Try the experimental post tools on sample content and see what stage each one is at.',
    access: 'porchEditor',
    demoHref: '/internal/lab/demo',
  },
  {
    href: '/internal/reports',
    group: 'Reports',
    title: 'Internal reports',
    about: 'Monthly reports for leadership and partners, such as social media.',
  },
];

/** Whether this login is a BackPorch editor (null while checking). */
function usePorchEditor() {
  const [isEditor, setIsEditor] = useState<boolean | null>(null);
  useEffect(() => {
    let cancelled = false;
    supabase.rpc('is_porch_editor').then(({ data, error }) => {
      if (!cancelled) setIsEditor(!error && data === true);
    });
    return () => {
      cancelled = true;
    };
  }, []);
  return isEditor;
}

function PortalContent({ demo = false }: { demo?: boolean }) {
  const { user, signOut } = useInternalAuth();
  const checked = usePorchEditor();
  const isEditor = demo ? true : checked;

  return (
    <div className="ir-page">
      <SEOHead title="Staff portal — SparkPoint" description="SparkPoint's staff tools." path={PAGE_PATH} noindex />

      <header className="ir-masthead">
        <Link className="ir-back-link" to="/">
          <img src={SPARKPOINT_LOGO} alt="SparkPoint" style={{ height: 22 }} />
        </Link>
        {demo ? (
          <span className="ir-masthead-tag">Local demo</span>
        ) : (
          <span className="ir-portal-user">
            {user?.email && <span className="ir-portal-email">{user.email}</span>}
            <button type="button" className="ir-forgot-link" style={{ marginTop: 0 }} onClick={() => void signOut()}>
              Sign out
            </button>
          </span>
        )}
      </header>

      <div className="ir-hero-band">
        <div className="ir-hero-band-inner">
          <span className="ir-eyebrow">SparkPoint</span>
          <h1>Staff portal</h1>
          <p>Everything behind the staff sign-in, in one place.</p>
        </div>
      </div>

      <div className="ir-shell">
        <ul className="ir-card-grid ir-portal-grid">
          {TOOLS.map((tool) => {
            const locked = tool.access === 'porchEditor' && isEditor === false;
            return (
              <li key={tool.href}>
                <Link className="ir-report-card ir-portal-card" to={demo && tool.demoHref ? tool.demoHref : tool.href}>
                  <span className="ir-report-card-eyebrow">{tool.group}</span>
                  <h2>{tool.title}</h2>
                  <p>{tool.about}</p>
                  {locked && <p className="ir-portal-note">BackPorch editors only. Ask Jeff to add your email.</p>}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

/** /internal/demo: the portal without signing in, on the dev server only. */
export function InternalPortalDemoPage() {
  return <PortalContent demo />;
}

export default function InternalPortalPage() {
  return (
    <RequireInternalAuth>
      <PortalContent />
    </RequireInternalAuth>
  );
}
