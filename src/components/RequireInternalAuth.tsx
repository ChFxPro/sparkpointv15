import type { ReactNode } from 'react';
import { Link, Navigate, useLocation } from 'react-router';
import { useInternalAuth } from '../hooks/useInternalAuth';
import type { BackstageAccess } from '../data/backstage';

interface RequireInternalAuthProps {
  children: ReactNode;
  /** Minimum access level. Defaults to any signed-in staff or board member. */
  access?: Exclude<BackstageAccess, 'open'>;
}

export function RequireInternalAuth({ children, access = 'member' }: RequireInternalAuthProps) {
  const { user, loading, roleLoading, canAccess } = useInternalAuth();
  const location = useLocation();

  if (loading || (user && roleLoading)) {
    return (
      <div className="ir-page">
        <div className="ir-loading" role="status" aria-live="polite">
          Checking access…
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/internal" state={{ from: location.pathname }} replace />;
  }

  if (!canAccess(access)) {
    return (
      <div className="ir-page">
        <div className="ir-loading" role="status">
          <p>Your account doesn’t have access to this area.</p>
          <p style={{ marginTop: 12 }}>
            <Link to="/internal">Back to Backstage</Link>
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
