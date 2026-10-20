import { useMemo, useState } from 'react';
import { Link } from 'react-router';
import { Helmet } from 'react-helmet-async';
import { SEOHead } from '../../components/SEOHead';
import { DateChip, PorchImage, PorchWordmark, PostMarks } from '../../components/backporch/PorchParts';
import {
  BlazeMark,
  Cairn,
  ContourTerrain,
  Journal,
  KIND_BLAZE,
  Signal,
} from '../../components/backporch/fieldKit';
import { PorchView } from '../../components/backporch/PorchView';
import { Backdrop } from '../../components/backporch/lab/Backdrop';
import { porchImageSrcSet, porchImageUrl, type PorchPost } from '../../lib/backporch';
import '../../components/backporch/lab/lab.css';
import { usePorchPosts } from '../../hooks/usePorchPosts';
import { PORCH_PATH, postPath, shortAddress, type PorchKind } from '../../lib/backporch';

const NEWSLETTER_URL = 'https://secure.yoursparkpoint.org/newsletter';
const FEED_RSS = `${import.meta.env.BASE_URL}backporch/feed.xml`;
const FEED_JSON = `${import.meta.env.BASE_URL}backporch/feed.json`;
const KIND_ORDER: PorchKind[] = ['gathering', 'news', 'ask', 'story'];

/** A takeover post breaks out of the list: full width, its scene behind the title. */
function Breakout({ post }: { post: PorchPost }) {
  const scene = post.presentation.scene;
  return (
    <Link className="porch-breakout" to={postPath(post.slug)}>
      {scene ? (
        <Backdrop scene={scene} still />
      ) : post.image_path ? (
        <img src={porchImageUrl(post.image_path, 1600) ?? ''} srcSet={porchImageSrcSet(post.image_path)} sizes="100vw" alt="" loading="lazy" />
      ) : (
        <Backdrop scene="ridges" still />
      )}
      <div className="porch-breakout-text">
        <PostMarks post={post} />
        <h2>{post.title}</h2>
        <p>{post.summary}</p>
      </div>
    </Link>
  );
}

export default function BackPorchPage() {
  const posts = usePorchPosts();
  const [filter, setFilter] = useState<PorchKind | 'all'>('all');
  const shown = useMemo(() => (filter === 'all' ? posts : posts.filter((p) => p.kind === filter)), [posts, filter]);
  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    for (const p of posts) c[p.kind] = (c[p.kind] ?? 0) + 1;
    return c;
  }, [posts]);
  // Only offer the blazes that would show something.
  const kinds = KIND_ORDER.filter((k) => counts[k]);

  return (
    <div className="porch porch-page porch-dusk">
      <SEOHead
        title="The BackPorch | SparkPoint"
        description="SparkPoint's news, gatherings, asks, and stories from Transylvania County, North Carolina, posted here first. Pull up a chair."
        path={PORCH_PATH}
      />
      <Helmet>
        <link rel="alternate" type="application/rss+xml" title="The BackPorch (RSS)" href={FEED_RSS} />
        <link rel="alternate" type="application/feed+json" title="The BackPorch (JSON Feed)" href={FEED_JSON} />
      </Helmet>

      <header className="porch-hero">
        <figure className="porch-hero-view">
          <PorchView variant="hero" eager />
        </figure>
        <div className="porch-hero-inner">
          <PorchWordmark as="h1" />
          <p className="porch-hero-lede">
            SparkPoint's news, gatherings, asks, and stories, in our own words. We post here first, so
            you never have to scroll a social feed to find out what's happening. Pull up a chair.
          </p>
          <nav className="porch-feeds" aria-label="Follow the BackPorch">
            <a className="porch-sign" href={NEWSLETTER_URL}>
              <Journal size={18} /> Get updates by email
            </a>
            <a className="porch-sign porch-sign-quiet" href={FEED_RSS}>
              <Signal size={18} /> RSS
            </a>
            <a className="porch-sign porch-sign-quiet" href={FEED_JSON}>
              <Signal size={18} /> JSON Feed
            </a>
          </nav>
        </div>
        <ContourTerrain className="porch-hero-terrain" />
      </header>

      <div className="porch-shell">
        <div className="porch-sheet">
          {kinds.length > 1 ? (
            <aside className="porch-legend" aria-labelledby="porch-legend-title">
              <h2 id="porch-legend-title">Follow the blazes</h2>
              <ul>
                <li>
                  <button
                    type="button"
                    className="porch-filter"
                    aria-pressed={filter === 'all'}
                    onClick={() => setFilter('all')}
                  >
                    Everything <small>{posts.length}</small>
                  </button>
                </li>
                {kinds.map((k) => (
                  <li key={k}>
                    <button
                      type="button"
                      className="porch-filter"
                      aria-pressed={filter === k}
                      onClick={() => setFilter(k)}
                    >
                      <BlazeMark blaze={KIND_BLAZE[k]} size={16} />
                      {KIND_BLAZE[k].label}
                      <small>{counts[k]}</small>
                    </button>
                  </li>
                ))}
              </ul>
            </aside>
          ) : (
            <div />
          )}

          {shown.length === 0 ? (
            <div className="porch-empty">
              <strong>Nothing on the porch yet.</strong>
              <p>
                Check back soon, or <a href={NEWSLETTER_URL}>get updates by email</a>.
              </p>
            </div>
          ) : (
            <ol className="porch-list">
              {shown.map((post, i) =>
                post.presentation.layout === 'takeover' ? (
                  <li key={post.id} className="porch-breakout-item">
                    <Breakout post={post} />
                  </li>
                ) : (
                <li key={post.id} className="porch-entry" data-has-image={Boolean(post.image_path)}>
                  <div>
                    <PostMarks post={post} />
                    <div className="porch-entry-head">
                      {post.kind === 'gathering' && post.event_start && <DateChip iso={post.event_start} />}
                      <h2>
                        <Link to={postPath(post.slug)}>{post.title}</Link>
                      </h2>
                    </div>
                    <p className="porch-entry-summary">{post.summary}</p>
                    <p className="porch-entry-foot">
                      <span className="porch-short">
                        <Cairn size={16} />
                        {shortAddress(post.slug)}
                      </span>
                    </p>
                  </div>
                  {post.image_path && (
                    <PorchImage post={post} sizes="(min-width: 720px) 224px, 100vw" eager={i < 2} />
                  )}
                </li>
                ),
              )}
            </ol>
          )}
        </div>

        <section className="porch-about" aria-labelledby="porch-about-title">
          <h2 id="porch-about-title">About the BackPorch</h2>
          <p>
            Every community has a back porch: the place people stop by to catch up. This is SparkPoint's. We
            share our news, gatherings, asks, and stories here first, on our own site, and then pass them along.
            No ads, and no algorithm deciding what you see.
          </p>
          <p>
            Each post carries a trail blaze for its kind: a gathering, news, an ask, or a story. Follow along{' '}
            <a href={NEWSLETTER_URL}>by email</a> or with the <a href={FEED_RSS}>RSS feed</a>.
          </p>
        </section>
      </div>
    </div>
  );
}
