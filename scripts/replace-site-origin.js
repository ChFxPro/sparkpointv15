import fs from 'fs';
import path from 'path';

const defaultOrigin = 'https://www.yoursparkpoint.org';
const siteOrigin = (process.env.SITE_ORIGIN ?? process.env.PUBLIC_ORIGIN ?? process.env.VITE_SITE_ORIGIN ?? defaultOrigin).replace(/\/+$/, '');

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
