import { Helmet } from 'react-helmet-async';
import { SEOHead } from '../../components/SEOHead';
import { PorchWordmark } from '../../components/backporch/PorchParts';
import { ContourTerrain, Journal, Signal } from '../../components/backporch/fieldKit';
import { PorchView } from '../../components/backporch/PorchView';
import '../../components/backporch/lab/lab.css';
import { usePorchPosts } from '../../hooks/usePorchPosts';
import { PORCH_PATH } from '../../lib/backporch';
import { PorchBoard } from './feed/PorchBoard';

const NEWSLETTER_URL = 'https://secure.yoursparkpoint.org/newsletter';
const FEED_RSS = `${import.meta.env.BASE_URL}backporch/feed.xml`;
const FEED_JSON = `${import.meta.env.BASE_URL}backporch/feed.json`;

export default function BackPorchPage() {
  const posts = usePorchPosts();

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

      <div className="porch-shell porch-shell-board">
        <PorchBoard posts={posts} />

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
