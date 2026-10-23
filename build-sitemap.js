
const fs = require('fs');
const path = require('path');

const DOMAIN = 'https://devsyntax.pages.dev';
const ROOT = __dirname;
const PUBLIC_DIR = path.join(ROOT, 'public');
const URLS_FILE = path.join(ROOT, 'urls.txt');
const SITEMAP_FILE = path.join(PUBLIC_DIR, 'sitemap.xml');
const REDIRECTS_FILE = path.join(PUBLIC_DIR, '_redirects');

function normalizeUrl(line) {
  const value = line.trim();

  if (!value) return null;

  let url;

  try {
    url = new URL(value);
  } catch {
    throw new Error(`Invalid URL in urls.txt: ${value}`);
  }

  if (url.origin !== DOMAIN) {
    throw new Error(`Unexpected URL domain: ${value}`);
  }

  // Remove duplicate slashes from the path only.
  url.pathname =
    '/' + url.pathname.split('/').filter(Boolean).join('/');

  return url.href;
}

function escapeXml(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function main() {
  fs.mkdirSync(PUBLIC_DIR, { recursive: true });

  // Protect the original redirect rules.
  if (!fs.existsSync(REDIRECTS_FILE)) {
    throw new Error(
      'STOP: public/_redirects is missing. Deployment must not proceed.'
    );
  }

  const redirectText = fs.readFileSync(REDIRECTS_FILE, 'utf8');

  const rules = redirectText
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(line => line && !line.startsWith('#'));

  if (rules.length === 0 || rules.length > 2000) {
    throw new Error(`Invalid static redirect count: ${rules.length}`);
  }

  if (!fs.existsSync(URLS_FILE)) {
    throw new Error('STOP: urls.txt is missing.');
  }

  const urls = [
    ...new Set(
      fs.readFileSync(URLS_FILE, 'utf8')
        .split(/\r?\n/)
        .map(normalizeUrl)
        .filter(Boolean)
    )
  ];

  if (urls.length === 0) {
    throw new Error('STOP: urls.txt contains no valid URLs.');
  }

  if (urls.length > 50000) {
    throw new Error(
      'STOP: Sitemap exceeds 50,000 URLs. Use a sitemap index.'
    );
  }

  const entries = urls.map(url =>
    `  <url>\n    <loc>${escapeXml(url)}</loc>\n  </url>`
  );

  const xml =
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    entries.join('\n') +
    '\n</urlset>\n';

  const tempFile = SITEMAP_FILE + '.tmp';

  fs.writeFileSync(tempFile, xml, 'utf8');
  fs.renameSync(tempFile, SITEMAP_FILE);

  if (!fs.existsSync(REDIRECTS_FILE)) {
    throw new Error('STOP: _redirects disappeared during generation.');
  }

  console.log(`Sitemap generated: ${urls.length} URLs`);
  console.log(`Redirect rules preserved: ${rules.length}`);
  console.log(`Output: ${SITEMAP_FILE}`);
}

main();
