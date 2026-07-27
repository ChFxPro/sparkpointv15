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
const REDIRECTS = {
  '/donations': 'https://cowbell-primrose-tet2.squarespace.com/donations',
  '/newsletter': 'https://cowbell-primrose-tet2.squarespace.com/newsletter',
};
// Client-side redirect aliases: leave to the SPA fallback, don't prerender.
const SKIP = new Set(['/volunteer', '/partner', '/contact', '/news-media', '/newsroom', '/commconn', '/resiliency-hub', '/healthcare-story']);
const STATIC = ['/', '/about', '/mission', '/impact', '/programs', '/programs/purpose-workshops',
  '/get-involved', '/community-connectors', '/sponsors', '/resilience-hub', '/directory', '/press', '/stories', '/events',
  '/trust', '/privacy', '/intake', '/resources/know-your-numbers', '/rural-health-convening'];

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
  const done = [], failed = [];
  const queue = [...seed], seen = new Set();

  while (queue.length) {
    const route = norm(queue.shift());
    if (seen.has(route) || SKIP.has(route) || REDIRECTS[route]) { seen.add(route); continue; }
    seen.add(route);
    const page = await browser.newPage();
    try {
      await page.goto(base + route, { waitUntil: 'networkidle0', timeout: 30000 });
      await page.waitForFunction(() => { const r = document.getElementById('root'); return r && r.children.length > 0; }, { timeout: 15000 }).catch(() => {});
      await page.waitForFunction(() => !/Loading page/i.test(document.body.innerText || ''), { timeout: 15000 }).catch(() => {});
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

  // QR-safe 200 redirect stubs for external redirect routes
  for (const [route, target] of Object.entries(REDIRECTS)) {
    const file = path.join(OUT, route.replace(/^\//, '') + '.html');
    await mkdir(path.dirname(file), { recursive: true });
    const stub = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="robots" content="noindex"><link rel="canonical" href="${target}"><meta http-equiv="refresh" content="0;url=${target}"><title>Redirecting…</title><script>location.replace(${JSON.stringify(target)})</script></head><body><p>Redirecting to <a href="${target}">${target}</a>…</p></body></html>`;
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
