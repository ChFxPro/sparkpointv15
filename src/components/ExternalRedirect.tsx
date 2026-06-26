import { useEffect } from 'react';
import { Link } from 'react-router';
import { SEOHead } from './SEOHead';

interface ExternalRedirectProps {
  to: string;
  title?: string;
  description?: string;
  path?: string;
  heading?: string;
  body?: string;
  linkText?: string;
}

export function ExternalRedirect({
  to,
  title,
  description,
  path,
  heading = 'Redirecting...',
  body = 'If you are not redirected, continue to',
  linkText = 'the destination page',
}: ExternalRedirectProps) {
  useEffect(() => {
    window.location.replace(to);
  }, [to]);

  return (
    <div className="p-6 text-center space-y-3">
      {title && description && path ? (
        <SEOHead title={title} description={description} path={path} noindex />
      ) : null}
      <h1 className="text-2xl font-semibold text-slate-900">{heading}</h1>
      <p className="text-sm text-slate-600">
        {body}{' '}
        <a href={to} className="text-[#E03694] hover:underline">
          {linkText}
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
