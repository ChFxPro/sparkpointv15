import fs from 'fs';
import path from 'path';

const defaultOrigin = 'https://www.yoursparkpoint.org';
const siteOrigin = (process.env.SITE_ORIGIN ?? process.env.PUBLIC_ORIGIN ?? process.env.VITE_SITE_ORIGIN ?? defaultOrigin).replace(/\/+$/, '');

const communityConnectorsMeta = {
  title: 'Community Connectors | SparkPoint',
  description:
    'Community Connectors is a SparkPoint initiative supporting trusted local leaders who help neighbors find information, resources, care, and calm when it matters most.',
  canonical: 'https://yoursparkpoint.org/community-connectors',
  socialDescription:
    'Rooted in connection. Ready for what’s next. Learn about SparkPoint’s Community Connectors initiative in Transylvania County.',
  image: 'https://yoursparkpoint.org/assets/commconn/imgs/comcon_endcard.jpg',
  imageAlt:
    'Community Connectors of Transylvania County graphic with SparkPoint, FWRD Transylvania, and American Red Cross logos.',
};

const outputDirs = Array.from(
  new Set(
    [process.env.BUILD_OUT_DIR, process.env.VITE_OUT_DIR, 'build', 'dist'].filter(Boolean)
  )
);

const files = outputDirs.flatMap((outDir) => [
  path.join(process.cwd(), outDir, 'robots.txt'),
  path.join(process.cwd(), outDir, 'sitemap.xml'),
]);

for (const filePath of files) {
  if (!fs.existsSync(filePath)) {
    continue;
  }

  const content = fs.readFileSync(filePath, 'utf8');
  const updated = content.replace(/__SITE_ORIGIN__/g, siteOrigin);
  fs.writeFileSync(filePath, updated, 'utf8');
}

function escapeHtml(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function upsertTag(html, matcher, tag) {
  if (matcher.test(html)) {
    return html.replace(matcher, tag);
  }

  return html.replace('</head>', `      ${tag}\n</head>`);
}

function createCommunityConnectorsRoute(outDir) {
  const indexPath = path.join(process.cwd(), outDir, 'index.html');
  if (!fs.existsSync(indexPath)) {
    return;
  }

  const routeDir = path.join(process.cwd(), outDir, 'community-connectors');
  fs.mkdirSync(routeDir, { recursive: true });

  let html = fs.readFileSync(indexPath, 'utf8');
  const title = escapeHtml(communityConnectorsMeta.title);
  const description = escapeHtml(communityConnectorsMeta.description);
  const socialDescription = escapeHtml(communityConnectorsMeta.socialDescription);
  const canonical = escapeHtml(communityConnectorsMeta.canonical);
  const image = escapeHtml(communityConnectorsMeta.image);
  const imageAlt = escapeHtml(communityConnectorsMeta.imageAlt);

  html = upsertTag(html, /<title>[\s\S]*?<\/title>/i, `<title>${title}</title>`);
  html = upsertTag(html, /<meta\s+name="description"[^>]*>/i, `<meta name="description" content="${description}" />`);
  html = upsertTag(html, /<link\s+rel="canonical"[^>]*>/i, `<link rel="canonical" href="${canonical}" />`);
  html = upsertTag(html, /<meta\s+property="og:title"[^>]*>/i, `<meta property="og:title" content="${title}" />`);
  html = upsertTag(html, /<meta\s+property="og:description"[^>]*>/i, `<meta property="og:description" content="${socialDescription}" />`);
  html = upsertTag(html, /<meta\s+property="og:type"[^>]*>/i, '<meta property="og:type" content="website" />');
  html = upsertTag(html, /<meta\s+property="og:url"[^>]*>/i, `<meta property="og:url" content="${canonical}" />`);
  html = upsertTag(html, /<meta\s+property="og:image"[^>]*>/i, `<meta property="og:image" content="${image}" />`);
  html = upsertTag(html, /<meta\s+property="og:image:secure_url"[^>]*>/i, `<meta property="og:image:secure_url" content="${image}" />`);
  html = upsertTag(html, /<meta\s+property="og:image:type"[^>]*>/i, '<meta property="og:image:type" content="image/jpeg" />');
  html = upsertTag(html, /<meta\s+property="og:image:alt"[^>]*>/i, `<meta property="og:image:alt" content="${imageAlt}" />`);
  html = upsertTag(html, /<meta\s+name="twitter:card"[^>]*>/i, '<meta name="twitter:card" content="summary_large_image" />');
  html = upsertTag(html, /<meta\s+name="twitter:title"[^>]*>/i, `<meta name="twitter:title" content="${title}" />`);
  html = upsertTag(html, /<meta\s+name="twitter:description"[^>]*>/i, `<meta name="twitter:description" content="${socialDescription}" />`);
  html = upsertTag(html, /<meta\s+name="twitter:image"[^>]*>/i, `<meta name="twitter:image" content="${image}" />`);
  html = upsertTag(html, /<meta\s+name="twitter:image:alt"[^>]*>/i, `<meta name="twitter:image:alt" content="${imageAlt}" />`);

  fs.writeFileSync(path.join(routeDir, 'index.html'), html, 'utf8');
}

for (const outDir of outputDirs) {
  createCommunityConnectorsRoute(outDir);
}
