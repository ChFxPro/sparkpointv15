import fs from 'fs';
import path from 'path';

const defaultOrigin = 'https://chfxpro.github.io/sparkpointv15';
const siteOrigin = (process.env.SITE_ORIGIN ?? process.env.PUBLIC_ORIGIN ?? process.env.VITE_SITE_ORIGIN ?? defaultOrigin).replace(/\/+$/, '');

const files = [
  path.join(process.cwd(), 'build', 'robots.txt'),
  path.join(process.cwd(), 'build', 'sitemap.xml'),
];

for (const filePath of files) {
  if (!fs.existsSync(filePath)) {
    continue;
  }

  const content = fs.readFileSync(filePath, 'utf8');
  const updated = content.replace(/__SITE_ORIGIN__/g, siteOrigin);
  fs.writeFileSync(filePath, updated, 'utf8');
}
