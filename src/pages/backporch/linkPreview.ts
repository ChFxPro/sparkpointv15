// Fetches a link's own preview (title, description, site, image) for a Link block,
// then stores a copy of the image in our `porch-media` bucket, so the public card
// never loads anything from the other site.
//
// Live: the `porch-unfurl` edge function (editors only).
// Local demo: the dev server's stand-in at /__dev/porch-unfurl (vite.config.mts),
// which saves the image under public/assets/backporch/dev-unfurl/.
import { supabase } from '../../lib/supabaseClient';
import { projectId, publicAnonKey } from '../../utils/supabase/info';
import { uploadPorchImage } from './porchImages';

export interface FetchedPreview {
  title?: string;
  description?: string;
  site?: string;
  /** Our stored copy of the page's preview image. */
  imagePath?: string;
}

interface RawPreview {
  url: string;
  title?: string;
  description?: string;
  site?: string;
  image?: string;
}

const FUNCTION_URL = `https://${projectId}.supabase.co/functions/v1/porch-unfurl`;

async function callFunction(body: object): Promise<Response> {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  if (!token) throw new Error('Sign in again to fetch link previews.');
  return fetch(FUNCTION_URL, {
    method: 'POST',
    headers: { apikey: publicAnonKey, Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

export async function fetchLinkPreview(url: string, slug: string, demo: boolean): Promise<FetchedPreview> {
  if (import.meta.env.DEV && demo) {
    const res = await fetch(`${import.meta.env.BASE_URL}__dev/porch-unfurl`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url }),
    });
    const out = (await res.json()) as { preview?: RawPreview; imagePath?: string; error?: string };
    if (!res.ok || !out.preview) throw new Error(out.error ?? 'Could not fetch a preview for that link.');
    const { title, description, site } = out.preview;
    return { title, description, site, imagePath: out.imagePath };
  }

  const res = await callFunction({ url });
  const out = (await res.json().catch(() => ({}))) as { preview?: RawPreview; error?: string };
  if (!res.ok || !out.preview) {
    throw new Error(
      res.status === 404 ? 'Link previews are not switched on yet.' : out.error ?? 'Could not fetch a preview for that link.',
    );
  }
  const { title, description, site, image } = out.preview;
  let imagePath: string | undefined;
  if (image) {
    try {
      const imgRes = await callFunction({ image });
      if (imgRes.ok) {
        const blob = await imgRes.blob();
        const file = new File([blob], 'preview', { type: blob.type || 'image/jpeg' });
        imagePath = await uploadPorchImage(file, slug || 'link');
      }
    } catch {
      /* a preview without its image is still useful */
    }
  }
  return { title, description, site, imagePath };
}
