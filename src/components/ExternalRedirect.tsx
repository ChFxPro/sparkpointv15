import { useEffect } from 'react';

interface ExternalRedirectProps {
  to: string;
}

export function ExternalRedirect({ to }: ExternalRedirectProps) {
  useEffect(() => {
    window.location.replace(to);
  }, [to]);

  return <p className="p-6 text-center">Redirecting...</p>;
}
