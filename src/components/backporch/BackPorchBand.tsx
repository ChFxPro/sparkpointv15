import { Link } from 'react-router';
import { usePorchPosts } from '../../hooks/usePorchPosts';
import { PORCH_PATH } from '../../lib/backporch';
import { PorchLead, PorchRow } from './PorchParts';
import { ContourRule, ContourTerrain, Waymark } from './fieldKit';
import { PorchView } from './PorchView';

const ROWS = 3;

/**
 * Homepage band, directly under the hero: the view from the porch across the top,
 * then the pinned post (or the newest), then the next three, each under its trail blaze.
 * Still by design: no rotation, no badges, and no empty state; with no posts the
 * band is simply not there.
 */
export function BackPorchBand() {
  const posts = usePorchPosts();
  if (posts.length === 0) return null;

  const [lead, ...rest] = posts;
  const rows = rest.slice(0, ROWS);

  return (
    <section className="porch porch-band-wrap" aria-labelledby="porch-band-title">
      <div className="porch-band porch-dusk">
        <ContourTerrain />
        <figure className="porch-band-view">
          <PorchView variant="band" />
          <figcaption>Illustrative image</figcaption>
        </figure>
        <div className="porch-band-inner">
          <div className="porch-band-top">
            <div className="porch-scene">
              <h2 id="porch-band-title" className="porch-wordmark porch-band-title">
                <span className="porch-wordmark-the">On the</span>
                <span>BackPorch</span>
              </h2>
              <p className="porch-band-sub">
                What's happening at SparkPoint, in our own words. Pull up a chair.
              </p>
              <div className="porch-band-actions">
                <Link className="porch-sign" to={PORCH_PATH}>
                  Everything on the BackPorch <Waymark size={18} />
                </Link>
              </div>
            </div>
            <PorchLead post={lead} />
          </div>

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
