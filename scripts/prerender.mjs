// SparkPoint static prerender — runs in postbuild. Renders every content route to
// static HTML (200 + real meta), emits QR-safe redirect stubs, regenerates sitemap.
// Route list is DERIVED from the app's own data so new stories/press/programs are
// picked up automatically. Pass --dry to preview (prints routes, renders to a temp
// folder, touches nothing in build/).
import puppeteer from 'puppeteer';
import { build } from 'esbuild';
import http from 'node:http';
import { readFile, writeFile, mkdir, stat, rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

const DRY = process.argv.includes('--dry');
const DIST = path.resolve(process.env.PRERENDER_DIST || 'build');
const ORIGIN = (process.env.SITE_ORIGIN || 'https://yoursparkpoint.org').replace(/\/$/, '');
const PORT = Number(process.env.PRERENDER_PORT || 4747);
const STORIES_FILE = process.env.STORIES_FILE || 'src/data/stories.ts';
const STORY_COLLECTIONS_FILE = process.env.STORY_COLLECTIONS_FILE || 'src/data/storyCollections.ts';
const PROGRAMS_FILE = process.env.PROGRAMS_FILE || 'src/pages/programs/programsData.ts';
const PRESS_FILE = process.env.PRESS_FILE || 'src/data/pressReleases.json';
const RESOURCES_FILE = process.env.RESOURCES_FILE || 'src/data/resources.ts';
const OUT = DRY ? path.resolve(DIST, '..', '.prerender-preview') : DIST;

// Routes that must NOT be SPA-prerendered — external redirects get clean 200 stubs.
// Every alias below used to sit in SKIP (left to the client-side SPA fallback), which
// meant a direct request or crawler hit GitHub Pages' 404.html first and got a real
// HTTP 404 before any JS ever ran the redirect — the same bug fixed for /sponsors,
// generalized to the rest of the retired/alias routes (GSC was reporting a batch of
// these as "Not found (404)" / "Page with redirect").
const REDIRECTS = {
  // Repointed to secure.yoursparkpoint.org (App.tsx, commit 2f0b17f) — this map had drifted
  // to the old raw Squarespace host, which GSC was still crawling as a live 404 target.
  '/donations': 'https://secure.yoursparkpoint.org/donations',
  '/newsletter': 'https://secure.yoursparkpoint.org/newsletter',
  '/rh_tickets': 'https://secure.yoursparkpoint.org/store/p/2026-rural-health-convening',
  '/pcr_collab': `${ORIGIN}/events/thrive-at-five`,
  '/sponsors': `${ORIGIN}/partners`,
  '/news-media': `${ORIGIN}/press`,
  '/newsroom': `${ORIGIN}/press`,
  '/media': `${ORIGIN}/press`,
  '/commconn': `${ORIGIN}/community-connectors`,
  '/resiliency-hub': `${ORIGIN}/resilience-hub`,
  '/volunteer': `${ORIGIN}/intake?intent=volunteer`,
  '/partner': `${ORIGIN}/intake?intent=partner`,
  '/contact': `${ORIGIN}/intake?intent=contact`,
  '/healthcare-story':
    'https://sparkconnection.org/wp-content/plugins/narrafirma/webapp/survey.html#project=Rural%20Health&survey=Rural%20Health%20Care%20Access',
  // Legacy Squarespace-era program/page URLs still showing up in GSC as 404s — redirect
  // the ones with a clear modern equivalent to preserve any lingering backlink equity.
  '/about-us': `${ORIGIN}/about`,
  '/sparkpurpose': `${ORIGIN}/programs/purpose-workshops`,
  '/leadership-wellbeing': `${ORIGIN}/programs/leadership-well-being`,
  '/voice-of-the-students': `${ORIGIN}/programs/voice-of-the-students-youth-leadership`,
  '/workforce-wellbeing': `${ORIGIN}/programs/workplace-well-being-positive-culture`,
  '/wellness-rooted-in-connection': `${ORIGIN}/programs/wellness-rooted-in-connection-collaborative-trcn`,
  '/wellnessrootedinconnection': `${ORIGIN}/programs/wellness-rooted-in-connection-collaborative-trcn`,
  '/helene-one-year-of-healing': `${ORIGIN}/stories/community-champions/helene-anniversary`,
  // Second batch, from the 8/13/26 GSC "Not found (404)" export. Targets verified
  // against the live route table in src/App.tsx — note /community-connectors sits at
  // the root, NOT under /programs/.
  '/community-connections': `${ORIGIN}/community-connectors`,
  '/home-impact': `${ORIGIN}/impact`,
  '/trauma-resilient-communities-partnership': `${ORIGIN}/programs/wellness-rooted-in-connection-collaborative-trcn`,
  '/cognitivehealthresources': `${ORIGIN}/resources/know-your-numbers`,
  // "/supported" is the retired Squarespace URL for SupportEd (Connected Classrooms &
  // Educator Well-Being) — not a "supporters" page. Confirmed against the 2026 program
  // inventory, which independently flagged this URL as a live 404 with a broken backlink.
  '/supported': `${ORIGIN}/programs/supported-connected-classrooms`,
  // Duplicate of the Helene one-year story. Both URLs were live and both were in the
  // sitemap; /stories/community-champions/helene-anniversary is canonical. Listing it
  // here also drops it from the generated sitemap and skips prerendering it.
  '/stories/disaster-recovery/helene-one-year': `${ORIGIN}/stories/community-champions/helene-anniversary`,
};
// Client-side redirect aliases with no static stub yet: leave to the SPA fallback.
// (Empty for now — keep as a hook for any future alias that shouldn't get a stub,
// e.g. a route intentionally left unindexable.)
const SKIP = new Set();
const STATIC = ['/', '/about', '/mission', '/impact', '/programs', '/programs/purpose-workshops',
  '/get-involved', '/community-connectors', '/partners', '/resilience-hub', '/directory', '/press', '/stories', '/events',
  '/trust', '/privacy', '/intake', '/resources/know-your-numbers', '/rural-health-convening',
  '/events/thrive-at-five',
  // Hand-written route in App.tsx (HeleneOneYearArticle) rather than a stories.ts entry,
  // so route derivation never picked it up and it had no build output — meaning the
  // /helene-one-year-of-healing redirect had been pointing at a hard 404 this whole time.
  '/stories/community-champions/helene-anniversary'];

const norm = (u) => { let x = u.split('#')[0].split('?')[0]; if (x.length > 1) x = x.replace(/\/+$/, ''); return x || '/'; };

async function importData(entry) {
  const r = await build({
    entryPoints: [entry], bundle: true, format: 'esm', platform: 'node', write: false, logLevel: 'silent',
    plugins: [{ name: 'stub-assets', setup(b) {
      b.onResolve({ filter: /\.(webp|png|jpe?g|avif|svg|gif|mp4)$/ }, () => ({ path: 'a', namespace: 'stub' }));
      b.onResolve({ filter: /^figma:asset\// }, () => ({ path: 'a', namespace: 'stub' }));
      b.onLoad({ filter: /.*/, namespace: 'stub' }, () => ({ contents: 'export default ""', loader: 'js' }));
    }}],
  });
  const url = 'data:text/javascript;base64,' + Buffer.from(r.outputFiles[0].text).toString('base64');
  return import(url);
}

async function deriveRoutes() {
  const routes = new Set(STATIC.map(norm));
  const { STORIES_DATA } = await importData(STORIES_FILE);
  for (const c of STORIES_DATA) {
    routes.add('/stories/' + c.id);
    for (const a of (c.articles || [])) routes.add('/stories/' + c.id + '/' + a.slug);
  }
  const { STORY_COLLECTIONS } = await importData(STORY_COLLECTIONS_FILE);
  routes.add('/stories/collections');
  for (const c of STORY_COLLECTIONS) routes.add('/stories/collections/' + c.id);
  const prog = await importData(PROGRAMS_FILE);
  const progList = prog.programsWithDetailPages || prog.allPrograms || [];
  for (const p of progList) routes.add('/programs/' + (p.slug || p.id));
  const press = JSON.parse(await readFile(PRESS_FILE, 'utf8'));
  for (const rel of (press.releases || [])) routes.add('/press/' + rel.slug);
  const resData = await importData(RESOURCES_FILE);
  for (const r of (resData.RESOURCES || [])) routes.add('/directory/' + r.id);
  return [...routes].map(norm).filter((r) => !SKIP.has(r) && !REDIRECTS[r]);
}

const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css',
  '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.avif': 'image/avif', '.ico': 'image/x-icon',
  '.woff2': 'font/woff2', '.woff': 'font/woff', '.xml': 'application/xml', '.txt': 'text/plain', '.mp4': 'video/mp4' };

function startServer() {
  const server = http.createServer(async (req, res) => {
    try {
      const p = norm(decodeURIComponent(req.url));
      const direct = path.join(DIST, p);
      if (existsSync(direct) && (await stat(direct)).isFile()) {
        res.writeHead(200, { 'Content-Type': MIME[path.extname(direct).toLowerCase()] || 'application/octet-stream' });
        return res.end(await readFile(direct));
      }
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(await readFile(path.join(DIST, 'index.html')));
    } catch (e) { res.writeHead(500); res.end(String(e)); }
  });
  return new Promise((resolve) => server.listen(PORT, () => resolve(server)));
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

(async () => {
  const seed = await deriveRoutes();
  console.log(`Derived ${seed.length} routes:\n` + seed.slice().sort().map((r) => '  ' + r).join('\n'));
  if (DRY) { console.log('\n[dry run] rendering to', OUT, '(build/ untouched)'); await rm(OUT, { recursive: true, force: true }); }

  const server = await startServer();
  const base = `http://localhost:${PORT}`;
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const done = [], failed = [], emptyRoutes = [];
  const queue = [...seed], seen = new Set();

  while (queue.length) {
    const route = norm(queue.shift());
    if (seen.has(route) || SKIP.has(route) || REDIRECTS[route]) { seen.add(route); continue; }
    seen.add(route);
    const page = await browser.newPage();
    try {
      // Never fetch media while prerendering. We only serialize the DOM, so video
      // bytes are pure cost — and an autoplaying <video> keeps a connection open,
      // so 'networkidle0' can never be reached on a route that has one. That is what
      // timed out /events/thrive-at-five once it gained an autoplay hero loop.
      // The <video>/<source> tags still serialize identically; only the bytes are skipped.
      await page.setRequestInterception(true);
      page.on('request', (req) => {
        const isMedia = req.resourceType() === 'media'
          || /\.(mp4|webm|mov|m4v|ogv)(\?|$)/i.test(req.url());
        if (isMedia) req.abort().catch(() => {});
        else req.continue().catch(() => {});
      });
      // A single slow-settling route used to fail the entire deploy. Fall back to a
      // weaker wait rather than losing every other page — but ONLY for slowness. A route
      // that took the fallback must still prove it rendered (see assertRendered below),
      // otherwise a genuinely broken page (e.g. an unresolved lazy chunk) would serialize
      // an empty "Loading page..." shell, be recorded as success, and enter the sitemap.
      let usedFallback = false;
      try {
        await page.goto(base + route, { waitUntil: 'networkidle0', timeout: 30000 });
      } catch (navErr) {
        if (!/timeout/i.test(navErr.message)) throw navErr;
        console.warn(`  ! ${route}: networkidle0 timed out, retrying with domcontentloaded`);
        usedFallback = true;
        await page.goto(base + route, { waitUntil: 'domcontentloaded', timeout: 30000 });
      }
      await page.waitForFunction(() => { const r = document.getElementById('root'); return r && r.children.length > 0; }, { timeout: 15000 }).catch(() => {});
      await page.waitForFunction(() => !/Loading page/i.test(document.body.innerText || ''), { timeout: 15000 }).catch(() => {});
      // The two waits above deliberately swallow their timeouts (pre-existing behaviour),
      // so they cannot be relied on to fail a build. Check readiness explicitly instead.
      const notReady = await page.evaluate(() => {
        const r = document.getElementById('root');
        if (!r || r.children.length === 0) return 'root is empty';
        if (/Loading page/i.test(document.body.innerText || '')) return 'still showing "Loading page..."';
        return null;
      });
      if (notReady && usedFallback) {
        // Restores the old contract: before the fallback existed, this route would have
        // failed the build outright. Slowness is tolerated; a page that never renders is not.
        throw new Error(`route did not render after domcontentloaded fallback (${notReady})`);
      }
      if (notReady) { emptyRoutes.push(route); console.warn(`  ! ${route}: ${notReady} (settled normally — writing anyway, pre-existing behaviour)`); }
      await sleep(250);
      const hrefs = await page.$$eval('a[href]', (as) => as.map((a) => a.getAttribute('href') || ''));
      for (const h of hrefs) {
        if (!h.startsWith('/') || h.startsWith('//')) continue;
        const r = norm(h);
        if (/\.[a-z0-9]{1,8}$/i.test(r)) continue;                       // skip files (images, .zip, .pdf, etc.)
        if (r.startsWith('/assets/') || r.startsWith('/downloads/')) continue; // skip build asset dirs
        if (!seen.has(r) && !SKIP.has(r) && !REDIRECTS[r]) queue.push(r);
      }
      const html = await page.content();
      if (route === '/') {
        await writeFile(path.join(OUT, 'index.html'), html);
      } else {
        const file = path.join(OUT, route.replace(/^\//, '') + '.html');
        await mkdir(path.dirname(file), { recursive: true });
        await writeFile(file, html);
      }
      done.push(route);
    } catch (e) { failed.push({ route, error: e.message }); }
    finally { await page.close(); }
  }
  await browser.close();
  server.close();

  // Guard against a silently useless prerender. Individual empty routes are tolerated
  // (the warning above), but if MOST routes render empty the app never booted at all —
  // and every page would be written as the same empty SPA shell while the build still
  // exited 0. The usual cause is a base-path mismatch: vite.config.mts defaults `base`
  // to '/sparkpointv15/', so a plain `npm run build` emits <script src="/sparkpointv15/...">
  // which this root-serving preview server cannot resolve, so no JS ever executes.
  // CI passes PUBLIC_BASE=/ (see .github/workflows/deploy.yml) and renders correctly.
  if (done.length && emptyRoutes.length > done.length / 2) {
    console.error(
      `\n✗ prerender produced empty HTML for ${emptyRoutes.length}/${done.length} routes.\n` +
      `  Every page would ship as an identical empty shell with no content or per-page meta.\n` +
      `  Most likely the asset base path does not match how these files are served.\n` +
      `  Rebuild the way CI does:  PUBLIC_BASE=/ npm run build`
    );
    process.exit(1);
  }

  // QR-safe 200 redirect stubs for external redirect routes
  for (const [route, target] of Object.entries(REDIRECTS)) {
    const file = path.join(OUT, route.replace(/^\//, '') + '.html');
    await mkdir(path.dirname(file), { recursive: true });
    // No `noindex` here, deliberately. GitHub Pages cannot issue a real 301, so the
    // canonical + 0s meta refresh is the ONLY signal that consolidates a retired URL's
    // ranking value onto its replacement. Adding `noindex` contradicts the canonical —
    // Google drops the URL instead of passing the equity forward, which is the opposite
    // of what these stubs exist to do. These pages stay out of sitemap.xml (see below),
    // so they still won't be crawled as standalone content.
    const stub = `<!doctype html><html lang="en"><head><meta charset="utf-8"><link rel="canonical" href="${target}"><meta http-equiv="refresh" content="0;url=${target}"><title>Redirecting…</title><script>location.replace(${JSON.stringify(target)})</script></head><body><p>Redirecting to <a href="${target}">${target}</a>…</p></body></html>`;
    await writeFile(file, stub);
    done.push(route);
  }

  // Regenerate sitemap (skip the noindex redirect stubs), only in a real run
  if (!DRY) {
    const urls = done.filter((r) => !REDIRECTS[r]).map(norm).filter((v, i, a) => a.indexOf(v) === i).sort();
    const sm = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((u) => `  <url><loc>${ORIGIN}${u === '/' ? '/' : u}</loc></url>`).join('\n')}\n</urlset>\n`;
    await writeFile(path.join(DIST, 'sitemap.xml'), sm);
  }
  console.log(`\n${DRY ? '[dry] ' : ''}prerendered ${done.length} pages, ${failed.length} failed`);
  if (failed.length) { console.log(JSON.stringify(failed, null, 1)); process.exitCode = 1; }
})();
