import { useEffect, useState } from 'react';
import bakedIndex from '../data/backporch.index.generated.json';
import { fetchPublishedPosts, isListed, normalizePresentation, sortPosts, type PorchPost } from '../lib/backporch';

// Baked at build time without blocks (lists never show them).
const BAKED = (bakedIndex.posts as Omit<PorchPost, 'blocks'>[]).map((p) => ({ ...p, blocks: [], presentation: normalizePresentation((p as { presentation?: unknown }).presentation) })) as PorchPost[];

/**
 * Listed BackPorch posts, pinned first. Renders the baked posts immediately (so
 * prerendered HTML and the first paint match, with no layout shift), then quietly
 * swaps in the live list from Supabase. If the live fetch fails, the baked list stays.
 */
export function usePorchPosts(): PorchPost[] {
  const [posts, setPosts] = useState<PorchPost[]>(() => sortPosts(BAKED.filter((p) => isListed(p))));

  useEffect(() => {
    // Local preview with sample posts (`npm run dev:samples`): keep them, skip the live list.
    if ((bakedIndex as { samples?: boolean }).samples) return;
    let cancelled = false;
    fetchPublishedPosts()
      .then((live) => {
        if (cancelled) return;
        // The live list has no blocks, so each post keeps the feed hints baked for it
        // (a post published since the build has none until the next build).
        const hints = new Map(BAKED.map((p) => [p.id, p.hints]));
        setPosts(sortPosts(live.filter((p) => isListed(p)).map((p) => ({ ...p, hints: hints.get(p.id) }))));
      })
      .catch(() => {
        /* keep the baked list */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return posts;
}
