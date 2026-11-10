import { Component, type ReactNode } from 'react';

// Keeps a page that fails to load or render from turning into a blank white screen.
//
// The usual cause is a deploy: pages load their code in pieces with hashed names, and
// each deploy replaces them. A tab opened before the deploy then asks for a piece that
// no longer exists. For that case the page reloads itself once, which fetches the new
// version; any other error shows a short message with a way to reload.

const RELOADED_AT = 'sp-stale-reload-at';
const STALE_CODE = /dynamically imported module|Importing a module script failed|error loading dynamically imported module|Failed to fetch|ChunkLoadError|Loading chunk/i;

/** Reloads the page once to pick up a new deploy; false if it already did that very recently. */
export function reloadForNewDeploy(): boolean {
  try {
    const last = Number(sessionStorage.getItem(RELOADED_AT) ?? 0);
    if (Date.now() - last < 30_000) return false; // already tried: don't loop
    sessionStorage.setItem(RELOADED_AT, String(Date.now()));
  } catch {
    return false; // no storage: can't guard against a loop, so show the message instead
  }
  window.location.reload();
  return true;
}

export const isStaleCodeError = (error: unknown) => STALE_CODE.test(String((error as Error)?.message ?? error));

interface Props {
  children: ReactNode;
  /** Changing this (the path) clears the error, so moving to another page works. */
  resetKey: string;
}

export class RouteErrorBoundary extends Component<Props, { error: unknown }> {
  state = { error: null as unknown };

  static getDerivedStateFromError(error: unknown) {
    return { error };
  }

  componentDidCatch(error: unknown) {
    if (isStaleCodeError(error)) reloadForNewDeploy();
    else console.error(error);
  }

  componentDidUpdate(prev: Props) {
    if (prev.resetKey !== this.props.resetKey && this.state.error) this.setState({ error: null });
  }

  render() {
    if (!this.state.error) return this.props.children;
    return (
      <div role="alert" style={{ maxWidth: 560, margin: '18vh auto', padding: '0 24px', textAlign: 'center', fontFamily: 'Manrope, system-ui, sans-serif', color: '#2a1430' }}>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: 12 }}>This page didn’t load</h1>
        <p style={{ lineHeight: 1.6, color: '#5c5258', marginBottom: 24 }}>
          The site may have just been updated. Reloading usually fixes it.
        </p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          style={{ padding: '12px 22px', borderRadius: 999, border: 0, background: '#e03694', color: '#fff', fontWeight: 700, fontSize: '1rem', cursor: 'pointer' }}
        >
          Reload the page
        </button>
        <p style={{ marginTop: 18 }}>
          <a href={import.meta.env.BASE_URL} style={{ color: '#9e509f', fontWeight: 600 }}>Go to the homepage</a>
        </p>
      </div>
    );
  }
}
