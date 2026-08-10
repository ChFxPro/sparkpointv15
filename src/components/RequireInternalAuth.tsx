import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router';
import { useInternalAuth } from '../hooks/useInternalAuth';

export function RequireInternalAuth({ children }: { children: ReactNode }) {
  const { user, loading } = useInternalAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="ir-page">
        <div className="ir-loading" role="status" aria-live="polite">
          Checking access…
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/internal/login" state={{ from: location.pathname }} replace />;
  }

  return <>{children}</>;
}
