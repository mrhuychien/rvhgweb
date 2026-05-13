#!/usr/bin/env node
// Produce two inventory CSVs:
//   workspace/inventory/urls.csv     — every URL discovered in the mirror
//                                      mapped to its new Astro route +
//                                      build status (built / extracted /
//                                      not-built).
//   workspace/inventory/images.csv   — every image present in
//                                      workspace/images/legacy/ with
//                                      size, dimensions placeholder,
//                                      usage_count, alt text and on-disk
//                                      flag for public/images/legacy/.

import fs from 'node:fs';
import path from 'node:path';
import { load } from 'cheerio';

const PROJECT = path.resolve(new URL('../../', import.meta.url).pathname);
const CLONE_HTML_ROOT = path.join(PROJECT, 'workspace/clone/www.rongvanghoanggia.com');
const WP_IMAGES = path.join(PROJECT, 'workspace/images/legacy');
const PUBLIC_IMAGES = path.join(PROJECT, 'public/images/legacy');
const INVENTORY = path.join(PROJECT, 'workspace/inventory');

function csvCell(s) {
  s = String(s ?? '');
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}
function writeCsv(filename, rows) {
  fs.writeFileSync(
    path.join(INVENTORY, filename),
    rows.map((r) => r.map(csvCell).join(',')).join('\n') + '\n'
  );
}

// ----- urls.csv -----
function pageKind(p) {
  if (p === '/') return 'home';
  if (p.startsWith('/san-pham/')) {
    if (p === '/san-pham/') return 'page';
    return 'product';
  }
  if (p.startsWith('/danh-muc-san-pham/')) return 'product_category';
  if (p.startsWith('/chinh-sach-') || p.startsWith('/ban-tu-cong-bo-')) return 'policy';
  if (p === '/gioi-thieu/' || p === '/lien-he/' || p === '/diem-ban-rong-vang-hoang-gia/' ||
      p === '/tin-tuc/' || p === '/cong-bo/' || p === '/cau-chuyen-san-pham-rong-vang-hoang-gia-2/') {
    return 'page';
  }
  return 'post';
}

function* walkHtml(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) yield* walkHtml(p);
    else if (e.isFile() && /\.html?$/i.test(e.name)) yield p;
  }
}

function urlPathFromFile(file) {
  let rel = path.relative(CLONE_HTML_ROOT, file).replace(/\\/g, '/');
  if (rel === 'index.html') return '/';
  rel = rel.replace(/index\.html$/i, '').replace(/\.html$/i, '/');
  if (!rel.startsWith('/')) rel = '/' + rel;
  if (!rel.endsWith('/')) rel += '/';
  return rel;
}

// Pages we have built in Astro (look at src/pages/, src/content/)
const astroPages = new Set([
  '/',
  '/gioi-thieu/',
  '/lien-he/',
  '/diem-ban-rong-vang-hoang-gia/',
  '/tin-tuc/',
  '/cong-bo/',
  '/san-pham/',
  '/404/',
  '/cau-chuyen-san-pham-rong-vang-hoang-gia-2/',
]);
for (const f of fs.readdirSync(path.join(PROJECT, 'src/content/products'))) {
  if (f.endsWith('.md')) astroPages.add(`/san-pham/${f.replace(/\.md$/, '')}/`);
}
for (const f of fs.readdirSync(path.join(PROJECT, 'src/content/product-categories'))) {
  if (f.endsWith('.md')) astroPages.add(`/danh-muc-san-pham/${f.replace(/\.md$/, '')}/`);
}
for (const f of fs.readdirSync(path.join(PROJECT, 'src/content/posts'))) {
  if (f.endsWith('.md')) astroPages.add(`/${f.replace(/\.md$/, '')}/`);
}
for (const f of fs.readdirSync(path.join(PROJECT, 'src/content/policies'))) {
  if (f.endsWith('.md')) astroPages.add(`/${f.replace(/\.md$/, '')}/`);
}

const urlRows = [['old_url', 'new_route', 'content_type', 'title', 'status', 'notes']];
const seen = new Set();

for (const file of walkHtml(CLONE_HTML_ROOT)) {
  const p = urlPathFromFile(file);
  if (seen.has(p)) continue;
  // Filter noise
  if (/^\/(wp-admin|wp-login|wp-json|wp-content|wp-includes|feed|cart|checkout|my-account|attachment|author|comments)/i.test(p)) continue;
  if (/\?(add-to-cart|p|s|amp)=/i.test(p)) continue;
  if (p.includes('?')) continue;
  seen.add(p);

  const html = fs.readFileSync(file, 'utf8');
  const $ = load(html);
  const title = (
    $('meta[property="og:title"]').attr('content') ||
    $('title').text().trim() ||
    ''
  ).replace(/\s*[–-]\s*Rồng Vàng Hoàng Gia.*$/i, '').trim();
  const kind = pageKind(p);
  const status = astroPages.has(p) ? 'built' : 'discovered';
  const notes = status === 'built' ? '' : `extracted to workspace/content-raw/${kind}/`;
  urlRows.push([
    `https://www.rongvanghoanggia.com${p}`,
    p,
    kind,
    title,
    status,
    notes,
  ]);
}

// Sort by content_type then route
const header = urlRows[0];
const body = urlRows.slice(1).sort((a, b) => {
  if (a[2] !== b[2]) return a[2].localeCompare(b[2]);
  return a[1].localeCompare(b[1]);
});
writeCsv('urls.csv', [header, ...body]);
console.log(`urls.csv: ${body.length} rows (${body.filter((r) => r[4] === 'built').length} built / ${body.filter((r) => r[4] === 'discovered').length} discovered)`);

// ----- images.csv -----
const usagePath = path.join(INVENTORY, 'image-usage.json');
const usage = fs.existsSync(usagePath) ? JSON.parse(fs.readFileSync(usagePath, 'utf8')) : {};

// Build basename -> usage info from image-usage.json
const byBase = new Map();
for (const [url, info] of Object.entries(usage)) {
  let base;
  try {
    base = path.basename(decodeURIComponent(new URL(url).pathname));
  } catch {
    continue;
  }
  const prev = byBase.get(base) || { count: 0, alts: new Set(), sources: new Set(), urls: new Set() };
  prev.count += info.count || 1;
  for (const a of info.alts || []) prev.alts.add(a);
  for (const s of info.sources || []) prev.sources.add(s);
  prev.urls.add(url);
  byBase.set(base, prev);
}

const inPublic = new Set(
  fs.existsSync(PUBLIC_IMAGES) ? fs.readdirSync(PUBLIC_IMAGES) : []
);

const imgRows = [[
  'filename', 'size_kb', 'usage_count', 'in_public_legacy',
  'original_urls', 'alt_text_first', 'sources',
]];

const wpFiles = fs.readdirSync(WP_IMAGES).sort();
for (const f of wpFiles) {
  const full = path.join(WP_IMAGES, f);
  const stat = fs.statSync(full);
  const meta = byBase.get(f) || { count: 0, alts: new Set(), sources: new Set(), urls: new Set() };
  imgRows.push([
    f,
    (stat.size / 1024).toFixed(1),
    meta.count,
    inPublic.has(f) ? 'yes' : 'no',
    [...meta.urls].slice(0, 3).join(' | '),
    [...meta.alts][0] || '',
    [...meta.sources].slice(0, 3).join(' | '),
  ]);
}
writeCsv('images.csv', imgRows);
console.log(`images.csv: ${wpFiles.length} rows  (${inPublic.size} present in public/images/legacy/)`);
