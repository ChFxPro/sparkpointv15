// Turns database and storage errors into something an editor can act on. The
// original message is kept at the end of the fallback, for whoever helps debug.
export function plainError(err: unknown, doing: string): string {
  const raw =
    err instanceof Error ? err.message : typeof err === 'object' && err && 'message' in err ? String((err as { message: unknown }).message) : String(err ?? '');
  const code = typeof err === 'object' && err && 'code' in err ? String((err as { code: unknown }).code) : '';
  const m = raw.toLowerCase();
  if (/jwt|token.*expired|not authenticated|invalid claim|session/.test(m) || code === 'PGRST301' || code === 'PGRST303') {
    return "You've been signed out. Sign in again (a new tab is fine) and save once more. Your draft is kept on this computer.";
  }
  if (/row-level security|permission denied|unauthorized|not allowed/.test(m) || code === '42501') {
    return "Your account isn't set up to post on the BackPorch. Ask Jeff to add you.";
  }
  if (/payload too large|maximum allowed size|exceeded|entity too large/.test(m) || code === '413') {
    return 'That file is too big. Photos and clips can be up to 150 MB; a longer video belongs on YouTube or Vimeo.';
  }
  if (/mime|content type|invalid.*type/.test(m)) {
    return "That kind of file can't go on the porch. Use a photo (JPEG, PNG, WebP), an MP4 clip, an audio file, or a PDF.";
  }
  if (/failed to fetch|network|load failed|timed? ?out/.test(m)) {
    return "Couldn't reach the server. Check the connection and try again.";
  }
  return raw ? `${doing} didn't work. (${raw})` : `${doing} didn't work. Try again in a moment.`;
}
