const fs = require('fs');
const path = require('path');

const DOMAIN = 'https://devsyntax.pages.dev';
const urlsFile = path.join(__dirname, 'urls.txt');
const outputPath = path.join(__dirname, 'public', 'sitemap.xml');

// Ensure public directory exists
if (!fs.existsSync(path.join(__dirname, 'public'))) {
    fs.mkdirSync(path.join(__dirname, 'public'), { recursive: true });
}

// 1. Read URLs and generate sitemap.xml
let urls = [];
if (fs.existsSync(urlsFile)) {
    urls = fs.readFileSync(urlsFile, 'utf8')
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0);
} else {
    urls = [`${DOMAIN}/`];
}

const now = new Date().toISOString();

let sitemapXML = `<?xml version="1.0" encoding="UTF-8"?>\n`;
sitemapXML += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

urls.forEach(url => {
    sitemapXML += `  <url>\n`;
    sitemapXML += `    <loc>${url}</loc>\n`;
    sitemapXML += `    <lastmod>${now}</lastmod>\n`;
    sitemapXML += `  </url>\n`;
});

sitemapXML += `</urlset>`;

fs.writeFileSync(outputPath, sitemapXML, 'utf8');
console.log(`Sitemap successfully generated with ${urls.length} URLs at ${now}`);

// 2. Automatically copy _redirects into the public folder
const sourceRedirects = path.join(__dirname, '_redirects');
const targetRedirects = path.join(__dirname, 'public', '_redirects');

if (fs.existsSync(sourceRedirects)) {
    fs.copyFileSync(sourceRedirects, targetRedirects);
    console.log('_redirects successfully copied to public folder!');
} else {
    console.log('Warning: _redirects file not found in the root directory.');
}
