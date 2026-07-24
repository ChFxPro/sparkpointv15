// Generates QR code assets for active Story Collections (src/pages/StoryCollectionDetailPage.tsx).
// Add a line to QR_TARGETS whenever a new collection goes active, then run:
//   node scripts/generate-story-collection-qr.mjs
// Outputs an on-page SVG (src/assets/story-collections) and a print-quality PNG (public/downloads/story-collections).
import QRCode from 'qrcode';
import fs from 'node:fs';
import path from 'node:path';

const QR_TARGETS = [
  {
    id: 'rural-healthcare',
    url: 'https://yoursparkpoint.org/healthcare-story',
    downloadName: 'SparkPoint-Rural-Healthcare-Story-QR.png',
  },
];

const projectRoot = process.cwd();
const svgDir = path.join(projectRoot, 'src/assets/story-collections');
const pngDir = path.join(projectRoot, 'public/downloads/story-collections');

fs.mkdirSync(svgDir, { recursive: true });
fs.mkdirSync(pngDir, { recursive: true });

const opts = { errorCorrectionLevel: 'H', margin: 2, color: { dark: '#1A1A1A', light: '#FFFFFF' } };

for (const target of QR_TARGETS) {
  const svg = await QRCode.toString(target.url, { ...opts, type: 'svg' });
  fs.writeFileSync(path.join(svgDir, `${target.id}-qr.svg`), svg);

  await QRCode.toFile(path.join(pngDir, target.downloadName), target.url, { ...opts, type: 'png', width: 1024 });

  console.log(`Generated QR for ${target.id} -> ${target.url}`);
}
