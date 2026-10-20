import { Link } from 'react-router';
import { usePorchPosts } from '../../hooks/usePorchPosts';
import { MAX_PINS, PORCH_PATH } from '../../lib/backporch';
import { PorchLead, PorchRow } from './PorchParts';
import { ContourRule, ContourTerrain, Waymark } from './fieldKit';
import { PorchView } from './PorchView';

const ROWS = 3;

/**
 * Homepage band, directly under the hero. It is also what the homepage features:
 * the pinned posts (up to three, most recently pinned first) lead, or the newest
 * post when nothing is pinned, then the next three, each under its trail blaze.
 * One lead sits beside the title; two or three sit side by side under it.
 * Still by design: no rotation, no badges, and no empty state; with no posts the
 * band is simply not there. `edge` (the homepage) makes it full width, the hero's
 * bottom edge; the only movement is the scroll parallax set by useHeroHandoff.
 */
export function BackPorchBand({ edge = false }: { edge?: boolean } = {}) {
  const posts = usePorchPosts();
  if (posts.length === 0) return null;

  const pinned = posts.filter((p) => p.pinned).slice(0, MAX_PINS);
  const leads = pinned.length > 0 ? pinned : posts.slice(0, 1);
  const rows = posts.filter((p) => !leads.includes(p)).slice(0, ROWS);
  const single = leads.length === 1;

  const intro = (
    <div className="porch-scene">
      <h2 id="porch-band-title" className="porch-wordmark porch-band-title">
        <span className="porch-wordmark-the">On the</span>
        <span>BackPorch</span>
      </h2>
      <p className="porch-band-sub">
        SparkPoint's news, gatherings, and stories, posted here first and in our own words. Pull up a chair.
      </p>
      <div className="porch-band-actions">
        <Link className="porch-sign" to={PORCH_PATH}>
          Everything on the BackPorch <Waymark size={18} />
        </Link>
      </div>
    </div>
  );

  return (
    <section className="porch porch-band-wrap" data-edge={edge || undefined} aria-labelledby="porch-band-title">
      <div className="porch-band porch-dusk">
        <ContourTerrain />
        <figure className="porch-band-view">
          <PorchView variant="band" />
        </figure>
        <div className="porch-band-inner">
          {single ? (
            <div className="porch-band-top">
              {intro}
              <PorchLead post={leads[0]} />
            </div>
          ) : (
            <>
              <div className="porch-band-head">{intro}</div>
              <ul className="porch-band-leads" data-count={leads.length}>
                {leads.map((post) => (
                  <li key={post.id}>
                    <PorchLead post={post} />
                  </li>
                ))}
              </ul>
            </>
          )}

          {rows.length > 0 && (
            <div className="porch-log">
              <div className="porch-log-head">
                <h3>Also on the porch</h3>
                <ContourRule variant={2} />
              </div>
              <ul className="porch-log-list">
                {rows.map((post) => (
                  <li key={post.id}>
                    <PorchRow post={post} />
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
