// Run against `pnpm pages:preview` or pass the actual Pages preview URL.
import assert from 'node:assert/strict';
import fs from 'node:fs';

const base = process.argv[2] ?? 'http://127.0.0.1:8788';
const request = (pathname, options = {}) => fetch(new URL(pathname, base), {
  redirect: 'manual', signal: AbortSignal.timeout(15_000), ...options,
});
const responseFor = async (pathname) => {
  const response = await request(pathname);
  await response.arrayBuffer();
  return response;
};
const rules = fs.readFileSync('dist/_redirects', 'utf8').split(/\r?\n/)
  .map((line) => line.trim()).filter((line) => line && !line.startsWith('#'));
for (const line of rules) {
  const [source, destination, code] = line.split(/\s+/);
  const pathname = source.replace(/:\w+/g, 'legacy-test-item');
  const response = await responseFor(pathname);
  assert.equal(response.status, Number(code), `Redirect status: ${pathname}`);
  assert.equal(new URL(response.headers.get('location'), base).pathname,
    destination.replace(/:\w+/g, 'legacy-test-item'), `Redirect destination: ${pathname}`);
}
const pages = ['/', '/gioi-thieu/', '/san-pham/', '/tin-tuc/', '/lien-he/', '/cong-bo/',
  '/danh-muc-san-pham/banh-dau-xanh-thuong-hang/', '/botdx-carot/', '/admin/',
  '/admin/config.yml', '/robots.txt', '/sitemap-index.xml', '/sitemap-0.xml', '/llms.txt', '/llms-full.txt'];
for (const pathname of pages) {
  const response = await responseFor(pathname);
  assert.equal(response.status, 200, `Page: ${pathname}`);
  assert.equal(response.headers.get('x-content-type-options'), 'nosniff', pathname);
  assert.equal(response.headers.get('x-frame-options'), 'SAMEORIGIN', pathname);
  assert.equal(response.headers.get('referrer-policy'), 'strict-origin-when-cross-origin', pathname);
  assert(!response.headers.get('cache-control')?.includes('immutable'), `HTML/text must not be immutable: ${pathname}`);
  if (new URL(base).hostname.endsWith('.pages.dev')) {
    assert(response.headers.get('x-robots-tag')?.includes('noindex'), `Preview must not be indexed: ${pathname}`);
  }
}
const missing = await request('/cloudflare-migration-missing-page/');
assert.equal(missing.status, 404, 'Missing paths must return 404, not the home page');
assert((await missing.text()).includes('404'), 'Custom 404 content');
const slash = await responseFor('/gioi-thieu');
assert([301, 308].includes(slash.status), 'Existing HTML paths must gain a trailing slash');
assert.equal(new URL(slash.headers.get('location'), base).pathname, '/gioi-thieu/');

const astro = fs.readdirSync('dist/_astro').filter((name) => /\.(css|js)$/.test(name)).map((name) => `/_astro/${name}`);
const assets = ['/images/legacy/hero-home.jpg', '/og-default.png', '/fonts/be-vietnam-pro-400-latin.woff2',
  '/favicon.svg', ...astro];
for (const pathname of assets) {
  const response = await responseFor(pathname);
  assert.equal(response.status, 200, pathname);
  assert.equal(response.headers.get('cache-control'), 'public, max-age=31536000, immutable', pathname);
}
const pdf = await responseFor('/cong-bo/01-banh-dau-xanh.pdf');
assert.equal(pdf.status, 200);
assert.equal(pdf.headers.get('cache-control'), 'public, max-age=2592000');
assert.equal(pdf.headers.get('content-disposition'), 'inline');
const legacy = await fetch(new URL('/san-pham/banh-dau-tra-xanh/index.html', base), { signal: AbortSignal.timeout(15_000) });
await legacy.arrayBuffer();
assert.equal(legacy.status, 200, 'Legacy index.html redirect chain must terminate');
assert.equal(new URL(legacy.url).pathname, '/danh-muc-san-pham/banh-dau-xanh-thuong-hang/');
console.log(`Pages HTTP smoke OK: ${rules.length} redirect variants, ${pages.length} routes, ${assets.length} cache checks, PDF headers, 404, slash normalization and legacy redirect chain.`);
