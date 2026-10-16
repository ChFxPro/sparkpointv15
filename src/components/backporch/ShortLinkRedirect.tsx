import { Navigate, useParams } from 'react-router';
import { postPath } from '../../lib/backporch';

// /p/<slug> -> /backporch/<slug>. Production also gets a static stub per post
// (scripts/prerender.mjs) so link previews and QR scanners never hit a 404 first.
export function ShortLinkRedirect() {
  const { slug = '' } = useParams();
  return <Navigate to={postPath(slug)} replace />;
}
