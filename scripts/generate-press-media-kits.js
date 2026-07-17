import fs from 'node:fs';
import path from 'node:path';
import { deflateRawSync } from 'node:zlib';

const projectRoot = process.cwd();
const contentPath = path.join(projectRoot, 'src/data/pressReleases.json');
const outputRoot = path.join(projectRoot, 'public/downloads/press');
const content = JSON.parse(fs.readFileSync(contentPath, 'utf8'));

function escapeHtml(value = '') {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function releaseQuoteMap(release) {
  return new Map((release.quotes ?? []).map((quote) => [quote.id, quote]));
}

function renderBodyText(release) {
  const quotes = releaseQuoteMap(release);
  return release.body.map((block) => {
    if (block.type === 'paragraph') return block.text;
    const quote = quotes.get(block.quoteId);
    return quote ? `“${quote.text}”\n— ${quote.attribution}${quote.role ? `, ${quote.role}` : ''}` : '';
  }).filter(Boolean).join('\n\n');
}

function renderBodyMarkdown(release) {
  const quotes = releaseQuoteMap(release);
  return release.body.map((block) => {
    if (block.type === 'paragraph') return block.text;
    const quote = quotes.get(block.quoteId);
    return quote ? `> “${quote.text}”\n>\n> — **${quote.attribution}**${quote.role ? `, ${quote.role}` : ''}` : '';
  }).filter(Boolean).join('\n\n');
}

function renderBodyHtml(release) {
  const quotes = releaseQuoteMap(release);
  return release.body.map((block) => {
    if (block.type === 'paragraph') return `<p>${escapeHtml(block.text)}</p>`;
    const quote = quotes.get(block.quoteId);
    return quote ? `<blockquote><p>“${escapeHtml(quote.text)}”</p><footer>— <strong>${escapeHtml(quote.attribution)}</strong>${quote.role ? `, ${escapeHtml(quote.role)}` : ''}</footer></blockquote>` : '';
  }).filter(Boolean).join('\n');
}

function renderEventText(event) {
  if (!event) return '';
  return `${event.title}\n${event.dateLabel}\n${event.timeLabel}\n\n${event.venue}\n${event.streetAddress}\n${event.locality}, ${event.region} ${event.postalCode}${event.url ? `\n\nEvent page: ${event.url}` : ''}`;
}

function renderContact(contact) {
  return [contact.name, contact.title, contact.organization, contact.email, contact.phone].filter(Boolean).join('\n');
}

function releaseFileBase(release) {
  return release.slug.split('-').map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join('-');
}

function writeFile(root, relativePath, data) {
  const destination = path.join(root, relativePath);
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.writeFileSync(destination, data);
}

const crcTable = Array.from({ length: 256 }, (_, index) => {
  let value = index;
  for (let bit = 0; bit < 8; bit += 1) value = (value & 1) ? (0xedb88320 ^ (value >>> 1)) : (value >>> 1);
  return value >>> 0;
});

function crc32(buffer) {
  let crc = 0xffffffff;
  for (const byte of buffer) crc = crcTable[(crc ^ byte) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}

function dosDateTime(date = new Date()) {
  const year = Math.max(date.getFullYear(), 1980);
  return {
    time: (date.getHours() << 11) | (date.getMinutes() << 5) | Math.floor(date.getSeconds() / 2),
    date: ((year - 1980) << 9) | ((date.getMonth() + 1) << 5) | date.getDate(),
  };
}

function createZip(entries) {
  const localParts = [];
  const centralParts = [];
  let offset = 0;
  const timestamp = dosDateTime();

  entries.forEach(({ name, data }) => {
    const nameBuffer = Buffer.from(name.replace(/\\/g, '/'));
    const sourceBuffer = Buffer.isBuffer(data) ? data : Buffer.from(data);
    const compressed = deflateRawSync(sourceBuffer, { level: 9 });
    const checksum = crc32(sourceBuffer);
    const localHeader = Buffer.alloc(30);
    localHeader.writeUInt32LE(0x04034b50, 0);
    localHeader.writeUInt16LE(20, 4);
    localHeader.writeUInt16LE(0, 6);
    localHeader.writeUInt16LE(8, 8);
    localHeader.writeUInt16LE(timestamp.time, 10);
    localHeader.writeUInt16LE(timestamp.date, 12);
    localHeader.writeUInt32LE(checksum, 14);
    localHeader.writeUInt32LE(compressed.length, 18);
    localHeader.writeUInt32LE(sourceBuffer.length, 22);
    localHeader.writeUInt16LE(nameBuffer.length, 26);
    localParts.push(localHeader, nameBuffer, compressed);

    const centralHeader = Buffer.alloc(46);
    centralHeader.writeUInt32LE(0x02014b50, 0);
    centralHeader.writeUInt16LE(20, 4);
    centralHeader.writeUInt16LE(20, 6);
    centralHeader.writeUInt16LE(0, 8);
    centralHeader.writeUInt16LE(8, 10);
    centralHeader.writeUInt16LE(timestamp.time, 12);
    centralHeader.writeUInt16LE(timestamp.date, 14);
    centralHeader.writeUInt32LE(checksum, 16);
    centralHeader.writeUInt32LE(compressed.length, 20);
    centralHeader.writeUInt32LE(sourceBuffer.length, 24);
    centralHeader.writeUInt16LE(nameBuffer.length, 28);
    centralHeader.writeUInt32LE(offset, 42);
    centralParts.push(centralHeader, nameBuffer);
    offset += localHeader.length + nameBuffer.length + compressed.length;
  });

  const centralDirectory = Buffer.concat(centralParts);
  const end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50, 0);
  end.writeUInt16LE(entries.length, 8);
  end.writeUInt16LE(entries.length, 10);
  end.writeUInt32LE(centralDirectory.length, 12);
  end.writeUInt32LE(offset, 16);
  return Buffer.concat([...localParts, centralDirectory, end]);
}

fs.mkdirSync(outputRoot, { recursive: true });

for (const release of content.releases) {
  if (!release.mediaKitFile) continue;
  const fileBase = releaseFileBase(release);
  const kitRootName = release.mediaKitFile.replace(/\.zip$/i, '');
  const kitRoot = path.join(outputRoot, kitRootName);
  fs.rmSync(kitRoot, { recursive: true, force: true });
  fs.mkdirSync(kitRoot, { recursive: true });

  const eventText = renderEventText(release.event);
  const bodyText = renderBodyText(release);
  const bodyMarkdown = renderBodyMarkdown(release);
  const contactText = renderContact(release.mediaContact);
  const publishedDate = new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${release.datePublished}T00:00:00Z`));
  const releaseText = `${release.releaseStatus}\n\n${release.title}\n${release.subtitle ?? ''}\n\nPublished ${publishedDate}\n\n${release.location ? `${release.location} — ` : ''}${bodyText}${eventText ? `\n\n${eventText}` : ''}\n\nABOUT SPARKPOINT\n${content.portal.boilerplate}\n\nMEDIA CONTACT\n${contactText}\n`;
  const releaseMarkdown = `# ${release.title}\n\n${release.subtitle ? `_${release.subtitle}_\n\n` : ''}**${release.releaseStatus}**\n\nPublished ${publishedDate}\n\n${release.location ? `**${release.location} —** ` : ''}${bodyMarkdown}${eventText ? `\n\n## Event details\n\n${eventText.replace(/\n/g, '  \n')}` : ''}\n\n## About SparkPoint\n\n${content.portal.boilerplate}\n\n## Media contact\n\n${contactText.replace(/\n/g, '  \n')}\n`;
  const releaseHtml = `<!doctype html>\n<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${escapeHtml(release.title)} | SparkPoint Press Release</title><style>body{max-width:760px;margin:40px auto;padding:0 24px;font:17px/1.7 Arial,sans-serif;color:#1a1a1a}h1{font-size:42px;line-height:1.1}h2{margin-top:40px}blockquote{margin:36px 0;padding:20px 28px;border-left:4px solid #e03694;background:#f8f8f8}footer{margin-top:16px}@media print{body{margin:0;max-width:none}}</style></head><body><p><strong>${escapeHtml(release.releaseStatus)}</strong></p><h1>${escapeHtml(release.title)}</h1>${release.subtitle ? `<p><strong>${escapeHtml(release.subtitle)}</strong></p>` : ''}<p>Published ${escapeHtml(publishedDate)}</p>${release.location ? `<p><strong>${escapeHtml(release.location)} —</strong></p>` : ''}${renderBodyHtml(release)}${release.event ? `<h2>${escapeHtml(release.event.title)}</h2><p>${escapeHtml(release.event.dateLabel)}<br>${escapeHtml(release.event.timeLabel)}<br><br>${escapeHtml(release.event.venue)}<br>${escapeHtml(release.event.streetAddress)}<br>${escapeHtml(`${release.event.locality}, ${release.event.region} ${release.event.postalCode}`)}${release.event.url ? `<br><br><a href="${escapeHtml(release.event.url)}">Facebook event</a>` : ''}</p>` : ''}<h2>About SparkPoint</h2><p>${escapeHtml(content.portal.boilerplate)}</p><h2>Media contact</h2><p>${contactText.split('\n').map(escapeHtml).join('<br>')}</p></body></html>\n`;

  const captions = release.images.map((asset) => [path.basename(asset.src), `Title: ${asset.title}`, `Caption: ${asset.caption}`, `Alt text: ${asset.alt}`, asset.credit ? `Credit: ${asset.credit}` : 'Credit: No photographer credit supplied.', asset.usageNote ? `Usage note: ${asset.usageNote}` : ''].filter(Boolean).join('\n')).join('\n\n---\n\n');
  const partnership = (release.partnershipHistory ?? []).map((item) => `${item.year}\n${item.title}\n${item.description}`).join('\n\n');
  const startHere = `${release.title.toUpperCase()}\nMEDIA KIT\n\nThis package contains SparkPoint’s official press release, supplied high-resolution images, publication-ready captions and usage notes, organizational background, partnership history, and media contact information.\n\nPlease retain captions and all asset-specific usage notes. Conceptual renderings must always be published with their included disclaimers.\n\nFor questions, contact:\n${contactText}\n`;

  writeFile(kitRoot, 'START-HERE.txt', startHere);
  writeFile(kitRoot, `Press-Release/${fileBase}-Press-Release.txt`, releaseText);
  writeFile(kitRoot, `Press-Release/${fileBase}-Press-Release.md`, releaseMarkdown);
  writeFile(kitRoot, `Press-Release/${fileBase}-Press-Release.html`, releaseHtml);
  writeFile(kitRoot, 'Captions-and-Credits/image-captions-and-usage.txt', `${captions}\n`);
  writeFile(kitRoot, 'Background/SparkPoint-Boilerplate.txt', `${content.portal.boilerplate}\n`);
  writeFile(kitRoot, 'Background/Partnership-History.txt', `${partnership}\n`);
  writeFile(kitRoot, 'Contact/Media-Contact.txt', `${contactText}\n`);
  for (const asset of release.images) writeFile(kitRoot, `Images/${path.basename(asset.src)}`, fs.readFileSync(path.join(projectRoot, asset.src)));

  const entries = [];
  const collect = (directory) => {
    for (const item of fs.readdirSync(directory, { withFileTypes: true })) {
      const fullPath = path.join(directory, item.name);
      if (item.isDirectory()) collect(fullPath);
      else entries.push({ name: `${kitRootName}/${path.relative(kitRoot, fullPath).replace(/\\/g, '/')}`, data: fs.readFileSync(fullPath) });
    }
  };
  collect(kitRoot);
  entries.sort((a, b) => a.name.localeCompare(b.name));
  fs.writeFileSync(path.join(outputRoot, release.mediaKitFile), createZip(entries));
}

const sitemapPath = path.join(projectRoot, 'public/sitemap.xml');
const sitemapStart = '  <!-- PRESS_RELEASE_URLS:START -->';
const sitemapEnd = '  <!-- PRESS_RELEASE_URLS:END -->';
const releaseSitemapEntries = content.releases
  .map((release) => `  <url>\n    <loc>__SITE_ORIGIN__/press/${release.slug}</loc>\n    <lastmod>${release.dateModified ?? release.datePublished}</lastmod>\n  </url>`)
  .join('\n');
const pressSitemapBlock = `${sitemapStart}\n  <url>\n    <loc>__SITE_ORIGIN__/press</loc>\n  </url>${releaseSitemapEntries ? `\n${releaseSitemapEntries}` : ''}\n${sitemapEnd}`;
const sitemap = fs.readFileSync(sitemapPath, 'utf8');
const updatedSitemap = sitemap.replace(
  /  <!-- PRESS_RELEASE_URLS:START -->[\s\S]*?  <!-- PRESS_RELEASE_URLS:END -->/,
  pressSitemapBlock
);

if (updatedSitemap === sitemap && !sitemap.includes(sitemapStart)) {
  throw new Error('Press sitemap markers are missing from public/sitemap.xml.');
}

fs.writeFileSync(sitemapPath, updatedSitemap, 'utf8');

console.log(`Generated ${content.releases.filter((release) => release.mediaKitFile).length} press media kit(s).`);
