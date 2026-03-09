import { useEffect } from 'react';
import { Link } from 'react-router';

interface ExternalRedirectProps {
  to: string;
}

export function ExternalRedirect({ to }: ExternalRedirectProps) {
  useEffect(() => {
    window.location.replace(to);
  }, [to]);

  return (
    <div className="p-6 text-center space-y-3">
      <p>Redirecting...</p>
      <p className="text-sm text-slate-600">
        If you are not redirected, continue to{' '}
        <a href={to} className="text-[#E03694] hover:underline">
          the destination page
        </a>
        .
      </p>
      <p className="text-sm">
        <Link to="/" className="text-[#E03694] hover:underline">
          Return to SparkPoint home
        </Link>
      </p>
    </div>
  );
}
