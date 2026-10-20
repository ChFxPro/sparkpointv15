// The /backporch board: blaze filters, then Coming up (tickets), the months, the
// gatherings held, and Earlier on the porch. Renders from the posts it's given
// (baked first, then the live list), so the static HTML is the whole board.
import { useMemo, useState } from 'react';
import { BlazeMark, KIND_BLAZE } from '../../../components/backporch/fieldKit';
import type { PorchKind, PorchPost } from '../../../lib/backporch';
import { buildFeed, type FeedFilter } from '../../../lib/porchFeed';
import { Marker } from './FeedParts';
import { EarlierRow, HeldRow, LeadTicket, PostShape, SeriesCard, SmallTicket } from './FeedShapes';
import './feed.css';

const KIND_ORDER: PorchKind[] = ['gathering', 'news', 'ask', 'story'];
const PLURAL: Record<PorchKind, string> = { gathering: 'Gatherings', news: 'News', ask: 'Asks', story: 'Stories' };
const EMPTY: Record<FeedFilter, string> = {
  all: 'Nothing on the porch yet. Check back soon.',
  gathering: 'No gatherings on the porch right now.',
  news: 'No news on the porch right now.',
  ask: "We're not asking for anything right now.",
  story: 'No stories on the porch right now.',
};

function ComingUp({ posts }: { posts: PorchPost[] }) {
  const [lead, ...others] = posts;
  const allGatherings = posts.every((p) => p.kind === 'gathering' && p.event_start);
  return (
    <section className="pf-section" aria-labelledby="pf-up">
      <div className="pf-section-head">
        <h2 id="pf-up">{allGatherings ? 'Coming up' : 'On the porch now'}</h2>
        {posts.some((p) => p.pinned) && (
          <span className="pf-pinned">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 2l2.9 6.9 7.1.6-5.4 4.7 1.7 7-6.3-3.9-6.3 3.9 1.7-7L2 9.5l7.1-.6z" />
            </svg>
            Pinned
          </span>
        )}
      </div>
      <div className="pf-spread-row">
        <div className="pf-lead">{lead.kind === 'gathering' && lead.event_start && lead.presentation.layout !== 'takeover' ? <LeadTicket post={lead} /> : <PostShape post={lead} />}</div>
        {others.map((p) => (
          <div className="pf-side" key={p.id}>
            {p.kind === 'gathering' && p.event_start ? <SmallTicket post={p} /> : <PostShape post={p} />}
          </div>
        ))}
      </div>
    </section>
  );
}

export function PorchBoard({ posts }: { posts: PorchPost[] }) {
  const [filter, setFilter] = useState<FeedFilter>('all');
  const feed = useMemo(() => buildFeed(posts, filter), [posts, filter]);
  const counts = useMemo(() => {
    const c: Partial<Record<PorchKind, number>> = {};
    for (const p of posts) c[p.kind] = (c[p.kind] ?? 0) + 1;
    return c;
  }, [posts]);
  const kinds = KIND_ORDER.filter((k) => counts[k]);
  const empty = !feed.comingUp.length && !feed.months.length && !feed.held.length && !feed.earlier.length;

  return (
    <div className="pf">
      {kinds.length > 1 && (
        <nav className="pf-filters" aria-label="Show posts by kind">
          <button type="button" className="pf-chip" aria-pressed={filter === 'all'} onClick={() => setFilter('all')}>
            Everything <small>{posts.length}</small>
          </button>
          {kinds.map((k) => (
            <button key={k} type="button" className="pf-chip" aria-pressed={filter === k} onClick={() => setFilter(k)}>
              <BlazeMark blaze={KIND_BLAZE[k]} size={14} />
              {PLURAL[k]} <small>{counts[k]}</small>
            </button>
          ))}
        </nav>
      )}

      {feed.comingUp.length > 0 && <ComingUp posts={feed.comingUp} />}

      {feed.months.map((month) => (
        <section className="pf-section" key={month.key} aria-labelledby={`pf-m-${month.key.replace('/', '-')}`}>
          <Marker id={`pf-m-${month.key.replace('/', '-')}`}>{month.label}</Marker>
          <div className="pf-items">
            {month.items.map((item) =>
              item.type === 'series' ? (
                <SeriesCard key={item.key} name={item.name} about={item.about} posts={item.posts} />
              ) : (
                <PostShape key={item.key} post={item.post} />
              ),
            )}
          </div>
        </section>
      ))}

      {feed.held.length > 0 && (
        <section className="pf-section" aria-labelledby="pf-held">
          <Marker id="pf-held">Gatherings we've held</Marker>
          <div className="pf-rows">
            {feed.held.map((p) => (
              <HeldRow key={p.id} post={p} />
            ))}
          </div>
        </section>
      )}

      {feed.earlier.length > 0 && (
        <section className="pf-section" aria-labelledby="pf-earlier">
          <Marker id="pf-earlier">Earlier on the porch</Marker>
          <div className="pf-rows">
            {feed.earlier.map((p) => (
              <EarlierRow key={p.id} post={p} />
            ))}
          </div>
        </section>
      )}

      {empty && (
        <p className="pf-empty" role="status">
          {EMPTY[filter]}
        </p>
      )}
    </div>
  );
}
