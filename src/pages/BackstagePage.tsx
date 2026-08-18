import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { ArrowUpRight, KeyRound, Lock } from 'lucide-react';
import { SEOHead } from '../components/SEOHead';
import { useInternalAuth } from '../hooks/useInternalAuth';
import {
  GATED_LANES,
  OPEN_LANES,
  type BackstageAccess,
  type BackstageDestination,
  type BackstageLane,
} from '../data/backstage';
import './backstage.css';

const PAGE_PATH = '/internal';
const BASE = import.meta.env.BASE_URL;
const SPARKPOINT_LOGO = `${BASE}logo-wordmark.webp`;

const ACCESS_LABEL: Record<BackstageAccess, string> = {
  open: 'Open link',
  shared: 'Signed-in partners',
  member: 'Staff + board',
  board: 'Board only',
};

const ROLE_LABEL: Record<string, string> = {
  staff: 'Staff',
  board: 'Board member',
  partner: 'Partner',
};

/* The glow tracks the pointer so the console reads as a lit surface rather
   than a flat page. Written straight to CSS custom properties on the element —
   putting cursor position in React state would re-render the whole board on
   every mouse move. */
function usePointerGlow(enabled: boolean) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node || !enabled) return;

    const fine = window.matchMedia('(pointer: fine)');
    const calm = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!fine.matches || calm.matches) return;

    let frame = 0;

    const onMove = (event: PointerEvent) => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        const box = node.getBoundingClientRect();
        node.style.setProperty('--bs-glow-x', `${event.clientX - box.left}px`);
        node.style.setProperty('--bs-glow-y', `${event.clientY - box.top}px`);
      });
    };

    node.addEventListener('pointermove', onMove);
    return () => {
      node.removeEventListener('pointermove', onMove);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [enabled]);

  return ref;
}

function DestinationCard({
  destination,
  unlocked,
  access,
}: {
  destination: BackstageDestination;
  unlocked: boolean;
  access: BackstageAccess;
}) {
  const target = destination.to ?? destination.href;
  const soon = destination.status === 'soon' || !target;

  const inner = (
    <>
      <div className="bs-card-head">
        <h3>{destination.title}</h3>
        {unlocked && !soon && <ArrowUpRight className="bs-card-arrow" aria-hidden="true" />}
        {!unlocked && <Lock className="bs-card-lock" aria-hidden="true" />}
      </div>
      <p className="bs-card-body">{destination.description}</p>
      <div className="bs-card-foot">
        {!unlocked ? (
          <span className="bs-chip bs-chip-locked">
            {access === 'board' ? 'Board access required' : 'Sign in to open'}
          </span>
        ) : soon ? (
          <span className="bs-chip bs-chip-soon">In progress</span>
        ) : (
          <>
            {destination.requires && (
              <span className="bs-chip bs-chip-requires">Needs {destination.requires}</span>
            )}
            {destination.meta && <span className="bs-card-meta">{destination.meta}</span>}
          </>
        )}
      </div>
    </>
  );

  if (unlocked && !soon) {
    /* External systems (the Brain on the NAS) open in a new tab and keep their
       own login — Backstage links to them, it never fronts them. */
    if (destination.href) {
      return (
        <a
          className="bs-card is-open"
          href={destination.href}
          target="_blank"
          rel="noreferrer noopener"
        >
          {inner}
        </a>
      );
    }
    if (destination.to) {
      return (
        <Link className="bs-card is-open" to={destination.to}>
          {inner}
        </Link>
      );
    }
  }

  return <div className={`bs-card${unlocked ? ' is-soon' : ' is-locked'}`}>{inner}</div>;
}

function Lane({ lane, unlocked }: { lane: BackstageLane; unlocked: boolean }) {
  return (
    <section
      className={`bs-lane${unlocked ? '' : ' is-locked'}`}
      data-accent={lane.accent}
      aria-labelledby={`bs-lane-${lane.id}`}
    >
      <div className="bs-lane-head">
        <div>
          <h2 id={`bs-lane-${lane.id}`}>{lane.name}</h2>
          <p>{lane.tagline}</p>
        </div>
        <span className="bs-access-chip">{ACCESS_LABEL[lane.access]}</span>
      </div>
      <div className="bs-card-grid">
        {lane.destinations.map((destination) => (
          <DestinationCard
            key={destination.id}
            destination={destination}
            unlocked={unlocked}
            access={lane.access}
          />
        ))}
      </div>
    </section>
  );
}

function SignInPanel({ redirectTo }: { redirectTo: string | null }) {
  const { signIn, resetPassword } = useInternalAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    setStatusMessage(null);

    const { error: signInError } = await signIn(email, password);

    setSubmitting(false);
    if (signInError) {
      setError('Email or password not recognized. Contact SparkPoint staff for access.');
      return;
    }
    if (redirectTo) {
      navigate(redirectTo, { replace: true });
    }
  }

  async function handleForgotPassword() {
    if (!email) {
      setError('Enter your email above first, then choose “Forgot password”.');
      return;
    }
    setError(null);
    const { error: resetError } = await resetPassword(email);
    if (resetError) {
      setError('Could not send a reset link right now. Try again shortly.');
      return;
    }
    setStatusMessage(`If ${email} has access, a password reset link is on its way.`);
  }

  return (
    <div className="bs-threshold">
      <div className="bs-threshold-intro">
        <KeyRound className="bs-threshold-icon" aria-hidden="true" />
        <h2>Everything below is internal only</h2>
        <p>
          Reports, board material, and work in progress are for SparkPoint staff and board members.
          Access is granted individually — contact SparkPoint staff if you need a login.
        </p>
        {redirectTo && (
          <p className="bs-threshold-return">Sign in to continue to the page you requested.</p>
        )}
      </div>

      <form className="bs-form" onSubmit={handleSubmit}>
        {error && (
          <p className="bs-form-error" role="alert">
            {error}
          </p>
        )}
        {statusMessage && (
          <p className="bs-form-status" role="status">
            {statusMessage}
          </p>
        )}

        <div className="bs-field">
          <label htmlFor="bs-email">Email</label>
          <input
            id="bs-email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>
        <div className="bs-field">
          <label htmlFor="bs-password">Password</label>
          <input
            id="bs-password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>
        <button className="bs-submit" type="submit" disabled={submitting}>
          {submitting ? 'Signing in…' : 'Sign in'}
        </button>
        <button className="bs-text-button" type="button" onClick={handleForgotPassword}>
          Forgot password?
        </button>
      </form>
    </div>
  );
}

export default function BackstagePage() {
  const { user, role, loading, roleLoading, canAccess, signOut } = useInternalAuth();
  const location = useLocation();
  const redirectTo = (location.state as { from?: string } | null)?.from ?? null;

  const signedIn = Boolean(user);
  const resolving = loading || (signedIn && roleLoading);

  /* One-shot flourish: the board lights up when a sign-in lands, rather than
     the gated lanes silently swapping from grey to color. */
  const [justUnlocked, setJustUnlocked] = useState(false);
  const wasSignedIn = useRef(signedIn);

  useEffect(() => {
    if (signedIn && !wasSignedIn.current) {
      setJustUnlocked(true);
      const timer = window.setTimeout(() => setJustUnlocked(false), 1500);
      wasSignedIn.current = signedIn;
      return () => window.clearTimeout(timer);
    }
    wasSignedIn.current = signedIn;
  }, [signedIn]);

  const consoleRef = usePointerGlow(!resolving);

  return (
    <div className="bs-page">
      <SEOHead
        title="Backstage — SparkPoint"
        description="SparkPoint's internal portal for live boards, report libraries, and partner shares."
        path={PAGE_PATH}
        noindex
      />

      <header className="bs-masthead">
        <Link className="bs-masthead-logo" to="/">
          <img src={SPARKPOINT_LOGO} alt="SparkPoint" />
        </Link>
        {signedIn ? (
          <div className="bs-identity">
            <span className="bs-identity-text">
              {user?.email}
              {role && <span className="bs-identity-role">{ROLE_LABEL[role] ?? role}</span>}
            </span>
            <button type="button" className="bs-text-button" onClick={() => void signOut()}>
              Sign out
            </button>
          </div>
        ) : (
          <span className="bs-masthead-tag">Internal</span>
        )}
      </header>

      <div
        className={`bs-console${justUnlocked ? ' is-unlocking' : ''}`}
        ref={consoleRef}
      >
        <div className="bs-glow" aria-hidden="true" />

        <div className="bs-inner">
          <section className="bs-hero">
            <span className="bs-eyebrow">SparkPoint</span>
            <h1>Backstage</h1>
            <p>
              The working side of SparkPoint — live boards, report libraries, and things still being
              built. Some of it opens to partners by link; the rest needs a sign-in.
            </p>
          </section>

          {OPEN_LANES.map((lane) => (
            <Lane key={lane.id} lane={lane} unlocked />
          ))}

          {resolving ? (
            <div className="bs-resolving" role="status" aria-live="polite">
              Checking access…
            </div>
          ) : (
            !signedIn && <SignInPanel redirectTo={redirectTo} />
          )}

          {!resolving &&
            GATED_LANES.map((lane) => (
              <Lane key={lane.id} lane={lane} unlocked={canAccess(lane.access)} />
            ))}
        </div>
      </div>

      <footer className="bs-footer">
        <Link to="/">Back to yoursparkpoint.org</Link>
        <span>Not indexed. Links are unlisted, not private — keep sensitive material behind sign-in.</span>
      </footer>
    </div>
  );
}
