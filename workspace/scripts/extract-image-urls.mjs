#!/usr/bin/env node
// Walk workspace/clone HTML and CSS files, extract every image URL
// referenced via <img src>, <img srcset>, <source srcset>, <link rel="icon">,
// CSS background-image. Write a unique sorted list to
// workspace/inventory/image-urls.txt and per-image usage data to
// workspace/inventory/image-usage.json.
import fs from 'node:fs';
import path from 'node:path';
import { load } from 'cheerio';

const ROOT = path.resolve(new URL('../clone', import.meta.url).pathname);
const INVENTORY = path.resolve(new URL('../inventory', import.meta.url).pathname);
const SITE_HOST = 'www.rongvanghoanggia.com';

function* walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(p);
    else if (entry.isFile() && /\.html?$/i.test(entry.name)) yield p;
  }
}

function normalize(u) {
  if (!u) return null;
  u = u.trim();
  if (!u || u.startsWith('data:') || u.startsWith('#') || u.startsWith('javascript:')) return null;
  // Protocol-relative
  if (u.startsWith('//')) u = 'https:' + u;
  // Site-relative
  if (u.startsWith('/')) u = `https://${SITE_HOST}${u}`;
  // Strip query and fragment
  try {
    const parsed = new URL(u);
    parsed.search = '';
    parsed.hash = '';
    return parsed.toString();
  } catch {
    return null;
  }
}

const usage = new Map(); // url -> { count, alts: Set, sources: Set }
function record(url, alt, source) {
  if (!url) return;
  if (!/\.(jpe?g|png|gif|webp|svg|ico|avif)$/i.test(new URL(url).pathname)) return;
  const cur = usage.get(url) || { count: 0, alts: new Set(), sources: new Set() };
  cur.count += 1;
  if (alt && alt.trim()) cur.alts.add(alt.trim());
  if (source) cur.sources.add(source);
  usage.set(url, cur);
}

function parseSrcset(s) {
  if (!s) return [];
  return s
    .split(',')
    .map((x) => x.trim().split(/\s+/)[0])
    .filter(Boolean);
}

function parseCssBackground(css) {
  const urls = [];
  const re = /url\(([^)]+)\)/gi;
  let m;
  while ((m = re.exec(css)) !== null) {
    urls.push(m[1].replace(/^['"]|['"]$/g, ''));
  }
  return urls;
}

let fileCount = 0;
for (const file of walk(ROOT)) {
  fileCount++;
  const html = fs.readFileSync(file, 'utf8');
  const $ = load(html);
  const rel = path.relative(ROOT, file);

  $('img').each((_, el) => {
    const alt = $(el).attr('alt') || '';
    record(normalize($(el).attr('src')), alt, rel);
    record(normalize($(el).attr('data-src')), alt, rel);
    record(normalize($(el).attr('data-lazy-src')), alt, rel);
    for (const u of parseSrcset($(el).attr('srcset'))) record(normalize(u), alt, rel);
    for (const u of parseSrcset($(el).attr('data-srcset'))) record(normalize(u), alt, rel);
  });

  $('source').each((_, el) => {
    for (const u of parseSrcset($(el).attr('srcset'))) record(normalize(u), '', rel);
  });

  $('link[rel*="icon"]').each((_, el) => {
    record(normalize($(el).attr('href')), '', rel);
  });
  $('meta[property="og:image"], meta[name="twitter:image"]').each((_, el) => {
    record(normalize($(el).attr('content')), '', rel);
  });

  $('[style]').each((_, el) => {
    const style = $(el).attr('style') || '';
    for (const u of parseCssBackground(style)) record(normalize(u), '', rel);
  });

  $('style').each((_, el) => {
    const css = $(el).html() || '';
    for (const u of parseCssBackground(css)) record(normalize(u), '', rel);
  });
}

// Also walk CSS files inside the mirror
function* walkCss(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walkCss(p);
    else if (entry.isFile() && /\.css$/i.test(entry.name)) yield p;
  }
}
let cssCount = 0;
for (const file of walkCss(ROOT)) {
  cssCount++;
  const css = fs.readFileSync(file, 'utf8');
  for (const u of parseCssBackground(css)) record(normalize(u), '', path.relative(ROOT, file));
}

fs.mkdirSync(INVENTORY, { recursive: true });

const urls = [...usage.keys()].sort();
fs.writeFileSync(path.join(INVENTORY, 'image-urls.txt'), urls.join('\n') + '\n');

const dump = {};
for (const [u, info] of usage) {
  dump[u] = {
    count: info.count,
    alts: [...info.alts],
    sources: [...info.sources],
  };
}
fs.writeFileSync(path.join(INVENTORY, 'image-usage.json'), JSON.stringify(dump, null, 2));

const onSite = urls.filter((u) => new URL(u).host === SITE_HOST);
const offSite = urls.filter((u) => new URL(u).host !== SITE_HOST);

console.log(`html files scanned : ${fileCount}`);
console.log(`css files scanned  : ${cssCount}`);
console.log(`total unique images: ${urls.length}`);
console.log(`  on-site          : ${onSite.length}`);
console.log(`  off-site         : ${offSite.length}`);
console.log(`written            : workspace/inventory/image-urls.txt`);
console.log(`written            : workspace/inventory/image-usage.json`);
