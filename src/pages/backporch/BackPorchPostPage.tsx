import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router';
import { SEOHead } from '../../components/SEOHead';
import { DateChip, PorchImage, PorchRow, PostMarks } from '../../components/backporch/PorchParts';
import { Cairn, ContourRule, ContourTerrain, TopoPin, Waymark, WaymarkBack } from '../../components/backporch/fieldKit';
import { usePorchPosts } from '../../hooks/usePorchPosts';
import bakedFull from '../../data/backporch.generated.json';
import {
  clockTime,
  fetchPublishedPost,
  isListed,
  longDate,
  PORCH_PATH,
  porchImageUrl,
  postPath,
  shortAddress,
  type PorchPost,
  withBlocks,
} from '../../lib/backporch';
import { blockImages } from '../../lib/porchBlocks';
import { PostView } from '../../components/backporch/PostView';
import { experimentMeta } from '../../experiments/backporch/registry';
import { canonicalUrl } from '../../lib/siteOrigin';
import { PorchView } from '../../components/backporch/PorchView';

const BAKED = (bakedFull.posts as unknown as PorchPost[]).map(withBlocks);

// Only a listed post has a page: a scheduled one isn't up yet, and a taken-down or
// expired one is gone (the build drops it too; this covers the time until then).
const bakedListed = (slug: string) => BAKED.find((p) => p.slug === slug && isListed(p)) ?? null;

function usePost(slug: string) {
  const baked = bakedListed(slug);
  const [post, setPost] = useState<PorchPost | null>(baked);
  const [state, setState] = useState<'ready' | 'loading' | 'missing'>(baked ? 'ready' : 'loading');

  useEffect(() => {
    let cancelled = false;
    const fallback = bakedListed(slug);
    setPost(fallback);
    setState(fallback ? 'ready' : 'loading');
    // Local preview with sample posts: don't let the real database overrule them.
    if ((bakedFull as { samples?: boolean }).samples) {
      if (!fallback) setState('missing');
      return;
    }
    fetchPublishedPost(slug)
      .then((live) => {
        if (cancelled) return;
        if (live && isListed(live)) {
          setPost(live);
          setState('ready');
        } else {
          // Taken down, expired, or never existed. (A baked copy stays visible
          // until the next build only if the live check itself fails.)
          setPost(null);
          setState('missing');
        }
      })
      .catch(() => {
        if (!cancelled && !fallback) setState('missing');
      });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  return { post, state };
}

function CopyAddress({ slug }: { slug: string }) {
  const [copied, setCopied] = useState(false);
  const address = shortAddress(slug);
  return (
    <button
      type="button"
      className="porch-copy"
      onClick={() => {
        void navigator.clipboard?.writeText(`https://${address}`).then(() => {
          setCopied(true);
          window.setTimeout(() => setCopied(false), 2000);
        });
      }}
    >
      <span aria-live="polite">{copied ? 'Copied' : 'Copy link'}</span>
    </button>
  );
}

export default function BackPorchPostPage() {
  const { slug = '' } = useParams();
  const { post, state } = usePost(slug);
  const listed = usePorchPosts();
  const related = listed.filter((p) => p.slug !== slug).slice(0, 3);

  if (!post) {
    return (
      <div className="porch porch-page porch-dusk">
        <SEOHead
          title="The BackPorch | SparkPoint"
          description="News, gatherings, and asks from SparkPoint in Transylvania County, North Carolina."
          path={postPath(slug)}
          noindex
        />
        <div className="porch-article">
          <Link className="porch-back" to={PORCH_PATH}>
            <WaymarkBack size={18} /> The BackPorch
          </Link>
          {state === 'loading' ? (
            <p className="porch-empty" role="status">
              Loading…
            </p>
          ) : (
            <div className="porch-empty">
              <strong>This post isn't on the porch anymore.</strong>
              <p>
                It may have been taken down. <Link to={PORCH_PATH}>See what's on the BackPorch now.</Link>
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Share image: the cover, else the first photo in the post, else an experiment's own.
  const firstPhoto = blockImages(post.blocks)[0]?.path ?? null;
  const experimentId = post.blocks.find((b) => b.type === 'experiment');
  const ogImage =
    porchImageUrl(post.image_path, 1600) ??
    porchImageUrl(firstPhoto, 1600) ??
    (experimentId?.type === 'experiment' ? experimentMeta(experimentId.experiment)?.shareImage ?? null : null);
  const isGathering = post.kind === 'gathering' && post.event_start;
  const asEvent = Boolean(isGathering && post.event_place);
  const online = /\b(zoom|online|virtual|webinar)\b/i.test(post.event_place ?? '');

  return (
    <>
      <SEOHead
        title={`${post.title} | The BackPorch | SparkPoint`}
        description={post.summary}
        path={postPath(post.slug)}
        type="article"
        {...(ogImage ? { image: ogImage, imageAlt: post.image_alt ?? '' } : {})}
        publishedTime={post.published_at ?? undefined}
        modifiedTime={post.updated_at}
        jsonLd={{
          '@context': 'https://schema.org',
          // An Event needs a location to be valid, so a gathering with no place is an Article.
          '@type': asEvent ? 'Event' : 'Article',
          ...(asEvent
            ? {
                name: post.title,
                startDate: post.event_start,
                ...(post.event_end ? { endDate: post.event_end } : {}),
                ...(online
                  ? {
                      eventAttendanceMode: 'https://schema.org/OnlineEventAttendanceMode',
                      location: { '@type': 'VirtualLocation', url: post.link_url ?? canonicalUrl(postPath(post.slug)) },
                    }
                  : {
                      eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
                      location: { '@type': 'Place', name: post.event_place },
                    }),
                organizer: { '@type': 'Organization', name: 'SparkPoint', url: canonicalUrl('/') },
              }
            : {
                headline: post.title,
                datePublished: post.published_at,
                dateModified: post.updated_at,
                author: { '@type': 'Organization', name: 'SparkPoint' },
              }),
          description: post.summary,
          url: canonicalUrl(postPath(post.slug)),
          ...(ogImage ? { image: ogImage } : {}),
        }}
      />
      <PostView
        post={post}
        footer={
          <>
            <div className="porch-share">
              <span className="porch-short">
                <Cairn size={18} />
                {shortAddress(post.slug)}
              </span>
              <CopyAddress slug={post.slug} />
            </div>

            {related.length > 0 && (
              <section className="porch-related" aria-labelledby="porch-related-title">
                <div className="porch-log-head">
                  <h2 id="porch-related-title">More from the BackPorch</h2>
                  <ContourRule variant={2} />
                </div>
                <ul className="porch-log-list">
                  {related.map((p) => (
                    <li key={p.id}>
                      <PorchRow post={p} />
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </>
        }
      />
    </>
  );
}
