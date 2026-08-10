import { useState, type FormEvent } from 'react';
import { Link, Navigate, useLocation } from 'react-router';
import { SEOHead } from '../components/SEOHead';
import { useInternalAuth } from '../hooks/useInternalAuth';
import './internalReports.css';

const PAGE_PATH = '/internal/login';
const BASE = import.meta.env.BASE_URL;
const SPARKPOINT_LOGO = `${BASE}logo-wordmark.webp`;

export default function InternalLoginPage() {
  const { user, loading, signIn, resetPassword } = useInternalAuth();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from || '/internal/reports';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  if (!loading && user) {
    return <Navigate to={from} replace />;
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    setStatusMessage(null);

    const { error: signInError } = await signIn(email, password);

    setSubmitting(false);
    if (signInError) {
      setError('Email or password not recognized. Contact SparkPoint staff for access.');
    }
  }

  async function handleForgotPassword() {
    if (!email) {
      setError('Enter your email above first, then click "Forgot password".');
      return;
    }
    setError(null);
    const { error: resetError } = await resetPassword(email);
    setStatusMessage(
      resetError
        ? null
        : `If ${email} has access, a password reset link is on its way.`
    );
    if (resetError) {
      setError('Could not send a reset link right now. Try again shortly.');
    }
  }

  return (
    <div className="ir-page">
      <SEOHead
        title="Internal Reports Login — SparkPoint"
        description="Sign in to the SparkPoint internal reports portal."
        path={PAGE_PATH}
        noindex
      />

      <header className="ir-masthead">
        <Link className="ir-back-link" to="/">
          <img src={SPARKPOINT_LOGO} alt="SparkPoint" style={{ height: 22 }} />
        </Link>
        <span className="ir-masthead-tag">Internal reports</span>
      </header>

      <div className="ir-hero-band">
        <div className="ir-hero-band-inner">
          <span className="ir-eyebrow">SparkPoint</span>
          <h1>Sign in</h1>
          <p>Access is granted individually — contact SparkPoint staff if you need a login.</p>
        </div>
      </div>

      <div className="ir-shell ir-shell-narrow">
        <div className="ir-login-card">
          {error && (
            <p className="ir-error" role="alert">
              {error}
            </p>
          )}
          {statusMessage && <p className="ir-status-message">{statusMessage}</p>}

          <form onSubmit={handleSubmit}>
            <div className="ir-field">
              <label htmlFor="ir-email">Email</label>
              <input
                id="ir-email"
                className="ir-input"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>
            <div className="ir-field">
              <label htmlFor="ir-password">Password</label>
              <input
                id="ir-password"
                className="ir-input"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </div>
            <button className="ir-submit" type="submit" disabled={submitting}>
              {submitting ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <button className="ir-forgot-link" type="button" onClick={handleForgotPassword}>
            Forgot password?
          </button>
        </div>
      </div>
    </div>
  );
}
