/**
 * Link checker cho site tĩnh Astro.
 * Chạy sau `pnpm build`:  node tools/linkcheck.mjs
 * Exit code 1 nếu có link nội bộ không giải được.
 */
import fs from 'node:fs';
import path from 'node:path';

const DIST = 'dist';
const files = [];
(function walk(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    e.isDirectory() ? walk(p) : files.push(p);
  }
})(DIST);

const htmls = files.filter((f) => f.endsWith('.html'));

// Tập route + asset thật sự tồn tại trong dist
const routes = new Set();
const assets = new Set();
for (const f of files) {
  const rel = '/' + path.relative(DIST, f).replace(/\\/g, '/');
  assets.add(rel);
  try { assets.add(decodeURIComponent(rel)); } catch {}
  if (f.endsWith('.html')) routes.add(rel.replace(/index\.html$/, ''));
}

// Redirect trong vercel.json: tách loại tĩnh và loại có :param
const vercel = JSON.parse(fs.readFileSync('vercel.json', 'utf8'));
const redirects = vercel.redirects ?? [];
const redirStatic = new Set(redirects.filter((r) => !r.source.includes(':')).map((r) => r.source));
const redirPattern = redirects
  .filter((r) => r.source.includes(':'))
  .map((r) => new RegExp('^' + r.source.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/:\w+/g, '[^/]+') + '$'));

const resolves = (u) => {
  let d = u;
  try { d = decodeURIComponent(u); } catch {}
  return routes.has(u) || routes.has(d) || assets.has(u) || assets.has(d)
    || redirStatic.has(u) || redirPattern.some((re) => re.test(u));
};

const bad = new Map();
for (const f of htmls) {
  const page = '/' + path.relative(DIST, f).replace(/\\/g, '/').replace(/index\.html$/, '');
  const html = fs.readFileSync(f, 'utf8');
  for (const m of html.matchAll(/(?:href|src)="(\/[^"]*)"/g)) {
    const u = m[1].split('#')[0].split('?')[0];
    if (!u || resolves(u)) continue;
    if (!bad.has(u)) bad.set(u, new Set());
    bad.get(u).add(page);
  }
}

if (bad.size) {
  for (const [u, pages] of [...bad].sort()) {
    console.error('DEAD  ' + u + '\n      ← ' + [...pages].slice(0, 5).join(', ') + (pages.size > 5 ? ` (+${pages.size - 5})` : ''));
  }
  console.error(`\n${bad.size} link nội bộ không giải được.`);
  process.exit(1);
}
console.log(`link check OK — ${htmls.length} trang, 0 dead link.`);
