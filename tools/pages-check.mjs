// Validate the real output uploaded to Cloudflare Pages (Free limits).
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const files = fs.readdirSync('dist', { recursive: true, withFileTypes: true })
  .filter((entry) => entry.isFile()).map((entry) => path.join(entry.parentPath, entry.name));
assert(files.length <= 20_000, 'Pages Free supports at most 20,000 files');
for (const file of files) assert(fs.statSync(file).size <= 25 * 1024 * 1024, `Asset exceeds 25 MiB: ${file}`);
for (const file of ['_headers', '_redirects']) {
  assert.equal(fs.readFileSync(`dist/${file}`, 'utf8'), fs.readFileSync(`public/${file}`, 'utf8'), `${file} must be copied unchanged`);
}
assert(fs.existsSync('dist/404.html'), 'A top-level 404.html prevents accidental SPA fallback');
assert(!fs.existsSync('dist/_worker.js') && !fs.existsSync('functions'), 'This deployment must stay static');
const htmls = files.filter((file) => file.endsWith('.html'));
for (const file of htmls) {
  const html = fs.readFileSync(file, 'utf8');
  if (file.replaceAll('\\', '/').endsWith('/admin/index.html')) continue;
  const canonical = html.match(/<link\s+rel="canonical"\s+href="([^"]+)"/);
  assert(canonical, `Missing canonical: ${file}`);
  assert(canonical[1].startsWith('https://rongvanghoanggia.com/'), `Unexpected canonical: ${file}`);
  assert(!html.includes('https://www.rongvanghoanggia.com'), `Stale www URL in rendered output: ${file}`);
}
for (const file of ['sitemap-index.xml', 'sitemap-0.xml', 'robots.txt', 'llms.txt', 'llms-full.txt']) {
  const value = fs.readFileSync(`dist/${file}`, 'utf8');
  assert(value.includes('https://rongvanghoanggia.com/'), `Missing production origin: ${file}`);
  assert(!value.includes('https://www.rongvanghoanggia.com'), `Stale www origin: ${file}`);
}
const cutoff = new Date(process.env.PUBLIC_PUBLISH_AS_OF || Date.now());
let unpublished = 0;
for (const file of fs.readdirSync('src/content/posts')) {
  if (!/\.mdx?$/.test(file)) continue;
  const source = fs.readFileSync(`src/content/posts/${file}`, 'utf8');
  const frontmatter = source.split(/^---\s*$/m)[1] ?? '';
  const date = frontmatter.match(/^publishDate:\s*['"]?([^'"\r\n]+)/m)?.[1];
  const draft = /^draft:\s*true\s*$/m.test(frontmatter);
  if (!draft && (!date || new Date(date) <= cutoff)) continue;
  const slug = frontmatter.match(/^slug:\s*['"]?([^'"\r\n]+)/m)?.[1] ?? file.replace(/\.mdx?$/, '');
  assert(!fs.existsSync(`dist/${slug}/index.html`), `Unpublished article leaked: ${slug}`);
  unpublished++;
}
const largest = Math.max(...files.map((file) => fs.statSync(file).size));
console.log(`Pages output OK: ${files.length} files, ${htmls.length} HTML pages, largest ${(largest / 1024 / 1024).toFixed(2)} MiB; ${unpublished} unpublished posts excluded; apex SEO verified.`);
