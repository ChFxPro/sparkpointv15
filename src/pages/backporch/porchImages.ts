// Media uploads for the BackPorch editor. Photos: resize in the browser to the three
// widths the site serves, then upload them side by side to the `porch-media` bucket.
import { supabase } from '../../lib/supabaseClient';
import { IMAGE_WIDTHS, PORCH_BUCKET } from '../../lib/backporch';

const MAX_SOURCE_BYTES = 25 * 1024 * 1024;

async function loadBitmap(file: File): Promise<ImageBitmap | HTMLImageElement> {
  if ('createImageBitmap' in window) {
    try {
      return await createImageBitmap(file, { imageOrientation: 'from-image' });
    } catch {
      /* fall through to <img> */
    }
  }
  const url = URL.createObjectURL(file);
  try {
    const img = new Image();
    img.src = url;
    await img.decode();
    return img;
  } finally {
    URL.revokeObjectURL(url);
  }
}

function toBlob(canvas: HTMLCanvasElement, type: string, quality: number): Promise<Blob | null> {
  return new Promise((resolve) => canvas.toBlob(resolve, type, quality));
}

/** Encodes as WebP where the browser can (Chrome, Edge, Firefox) and JPEG where it can't (Safari). */
async function encode(canvas: HTMLCanvasElement): Promise<{ blob: Blob; ext: 'webp' | 'jpg' }> {
  const webp = await toBlob(canvas, 'image/webp', 0.82);
  if (webp && webp.type === 'image/webp') return { blob: webp, ext: 'webp' };
  const jpeg = await toBlob(canvas, 'image/jpeg', 0.85);
  if (!jpeg) throw new Error('This browser could not prepare the photo.');
  return { blob: jpeg, ext: 'jpg' };
}

/**
 * Resizes a photo to 480, 960, and 1600 pixels wide (never upscaling) and uploads
 * all three. Returns the 960 path, which is what `porch_posts.image_path` stores.
 */
export async function uploadPorchImage(file: File, slug: string): Promise<string> {
  if (!/^image\//.test(file.type) && !/\.(jpe?g|png|webp|heic|gif|avif)$/i.test(file.name)) {
    throw new Error('Choose a JPEG, PNG, or WebP photo.');
  }
  if (file.size > MAX_SOURCE_BYTES) throw new Error('That photo is over 25 MB. Try a smaller copy.');

  const source = await loadBitmap(file);
  const naturalWidth = 'naturalWidth' in source ? source.naturalWidth : source.width;
  const naturalHeight = 'naturalHeight' in source ? source.naturalHeight : source.height;
  if (!naturalWidth || !naturalHeight) throw new Error('That file could not be read as a photo.');

  const stamp = Date.now().toString(36);
  const base = `posts/${slug || 'post'}-${stamp}`;
  let mainPath = '';

  for (const width of IMAGE_WIDTHS) {
    const w = Math.min(width, naturalWidth);
    const h = Math.round((naturalHeight / naturalWidth) * w);
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('This browser could not prepare the photo.');
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(source, 0, 0, w, h);
    const { blob, ext } = await encode(canvas);
    const path = `${base}-${width}.${ext}`;
    const { error } = await supabase.storage.from(PORCH_BUCKET).upload(path, blob, {
      contentType: blob.type,
      cacheControl: '31536000',
      upsert: false,
    });
    if (error) throw new Error(`Upload failed: ${error.message}`);
    if (width === 960) mainPath = path;
  }
  if ('close' in source) source.close();
  return mainPath;
}

// ── Video, audio, and files ─────────────────────────────────────────────

const MAX_VIDEO_BYTES = 150 * 1024 * 1024;
const MAX_AUDIO_BYTES = 40 * 1024 * 1024;
const MAX_FILE_BYTES = 20 * 1024 * 1024;

function uniquePath(slug: string, ext: string): string {
  const stamp = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  return `posts/${slug || 'post'}-${stamp}.${ext}`;
}

function extension(file: File, fallback: string): string {
  const m = /\.([a-z0-9]{2,5})$/i.exec(file.name);
  return (m ? m[1] : fallback).toLowerCase();
}

async function put(path: string, body: Blob, contentType: string): Promise<void> {
  const { error } = await supabase.storage.from(PORCH_BUCKET).upload(path, body, {
    contentType,
    cacheControl: '31536000',
    upsert: false,
  });
  if (error) throw new Error(`Upload failed: ${error.message}`);
}

/** Reads a media file's length without uploading it. */
function mediaDuration(file: File, kind: 'video' | 'audio'): Promise<{ duration: number; el: HTMLVideoElement | HTMLAudioElement; url: string }> {
  return new Promise((resolve, reject) => {
    const el = document.createElement(kind);
    const url = URL.createObjectURL(file);
    el.preload = 'metadata';
    el.muted = true;
    if (el instanceof HTMLVideoElement) el.playsInline = true;
    el.onloadedmetadata = () => resolve({ duration: el.duration, el, url });
    el.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error(`This browser can't read that ${kind} file. Try exporting it as ${kind === 'video' ? 'MP4' : 'MP3 or M4A'}.`));
    };
    el.src = url;
  });
}

/** Grabs a frame about a second in, as a WebP/JPEG poster. */
async function posterFrame(video: HTMLVideoElement): Promise<Blob | null> {
  try {
    await new Promise<void>((resolve, reject) => {
      video.onseeked = () => resolve();
      video.onerror = () => reject(new Error('seek failed'));
      video.currentTime = Math.min(1, (video.duration || 2) / 2);
    });
    const w = Math.min(1600, video.videoWidth);
    const h = Math.round((video.videoHeight / video.videoWidth) * w);
    if (!w || !h) return null;
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    canvas.getContext('2d')?.drawImage(video, 0, 0, w, h);
    const webp = await toBlob(canvas, 'image/webp', 0.82);
    if (webp && webp.type === 'image/webp') return webp;
    return await toBlob(canvas, 'image/jpeg', 0.85);
  } catch {
    return null;
  }
}

/** Up to one minute (with a couple of seconds' grace). Returns paths and length. */
export async function uploadPorchVideo(file: File, slug: string): Promise<{ path: string; poster?: string; duration: number }> {
  if (!/^video\//.test(file.type)) throw new Error('Choose a video file (MP4 or MOV).');
  if (file.size > MAX_VIDEO_BYTES) {
    throw new Error('That clip is over 150 MB. Export it at 1080p, or post longer video to YouTube and paste the link.');
  }
  const { duration, el, url } = await mediaDuration(file, 'video');
  try {
    if (duration > 62) {
      throw new Error(`That clip is ${Math.round(duration)} seconds. Clips here can be up to a minute; for longer video, post it to YouTube or Vimeo and paste the link.`);
    }
    const poster = await posterFrame(el as HTMLVideoElement);
    const path = uniquePath(slug, extension(file, 'mp4'));
    await put(path, file, file.type);
    let posterPath: string | undefined;
    if (poster) {
      posterPath = uniquePath(slug, poster.type === 'image/webp' ? 'webp' : 'jpg');
      await put(posterPath, poster, poster.type);
    }
    return { path, poster: posterPath, duration };
  } finally {
    URL.revokeObjectURL(url);
  }
}

export async function uploadPorchAudio(file: File, slug: string): Promise<{ path: string; duration?: number }> {
  if (!/^audio\//.test(file.type)) throw new Error('Choose an audio file (MP3, M4A, or WAV).');
  if (file.size > MAX_AUDIO_BYTES) throw new Error('That audio file is over 40 MB. Try exporting it as MP3.');
  let duration: number | undefined;
  try {
    const read = await mediaDuration(file, 'audio');
    duration = Number.isFinite(read.duration) ? read.duration : undefined;
    URL.revokeObjectURL(read.url);
  } catch {
    /* length is optional */
  }
  const path = uniquePath(slug, extension(file, 'mp3'));
  await put(path, file, file.type);
  return { path, duration };
}

export async function uploadPorchFile(file: File, slug: string): Promise<{ path: string; size: number }> {
  if (file.type !== 'application/pdf') throw new Error('Files can be PDFs (flyers, handouts, forms).');
  if (file.size > MAX_FILE_BYTES) throw new Error('That PDF is over 20 MB.');
  const path = uniquePath(slug, 'pdf');
  await put(path, file, file.type);
  return { path, size: file.size };
}
