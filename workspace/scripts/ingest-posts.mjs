#!/usr/bin/env node
// Take selected new posts from workspace/content-raw/post/ and write
// them to src/content/posts/ with a valid frontmatter per the Astro
// posts schema (title, description, publishDate, oldUrl, etc.).
// Skips files that already exist in src/content/posts/.

import fs from 'node:fs';
import path from 'node:path';
import { load } from 'cheerio';

const PROJECT = path.resolve(new URL('../../', import.meta.url).pathname);
const RAW = path.join(PROJECT, 'workspace/content-raw/post');
const CLONE = path.join(PROJECT, 'workspace/clone/www.rongvanghoanggia.com');
const DEST = path.join(PROJECT, 'src/content/posts');

// Curated list of new posts worth ingesting (skip pagination/duplicates).
const INGEST = [
  '5-cach-doc-dao-de-thuong-thuc-banh-dau-xanh-cach-thu-5-ban-co-nam-mo-cung-chua-chac-da-nghi-den',
  'banh-dau-tra-xanh-hoang-gia',
  'banh-dau-xanh-co-beo-khong-dap-tan-noi-am-anh',
  'banh-dau-xanh-hai-duong-dac-san-van-hoa-noi-tieng',
  'banh-dau-xanh-hai-duong-huong-vi-truyen-thong-vuot-thoi-gian',
  'banh-dau-xanh-hai-duong-mon-qua-bieu-y-nghia-cho-moi-dip-dac-biet',
  'banh-dau-xanh-hai-duong-tai-tphcm-dac-san-bac-ky-lam-nuc-long-sai-thanh',
  'banh-dau-xanh-ngon-khong-phai-cu-ve-den-hai-duong-la-mua-duoc',
  'banh-dau-xanh-o-ha-noi',
  'banh-dau-xanh-rong-vang-tiet-lo-cau-chuyen-lich-su',
  'banh-dau-xanh-tet-tan-suu-2021-rong-vang-hoang-gia',
  'banh-dau-xanh-tra-xanh-rong-vang-them-mot-nguyen-lieu-say-dam-ca-van-nguoi',
  'dac-san-mien-bac',
  'gia-1-hop-banh-dau-xanh-la-bao-nhieu-mua-o-dau-thi-uy-tin',
  'lam-banh-dau-xanh-hai-duong-cong-thuc-bi-truyen-bat-mi-boi-nghe-nhan',
  'loi-ich-suc-khoe-bat-ngo-tu-viec-an-banh-dau-xanh-moi-ngay',
  'mua-banh-dau-xanh-o-sai-gon-nhanh-chong-so-huu-san-pham-chinh-goc-doc-dao',
  'thong-cao-bao-chi-rong-vang-hoang-gia-banh-dau-xanh-duy-nhat-dat-ocop-5-sao-quoc-gia',
  'thong-cao-bao-chi-su-kien-le-don-nhan-chung-nhan-san-pham-ocop-5-sao-quoc-gia-banh-dau-xanh-rong-vang-hoang-gia-va-khai-truong-showroom',
];

function parseFrontmatter(md) {
  const m = md.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!m) return { fm: {}, body: md };
  const fmLines = m[1].split('\n');
  const fm = {};
  for (const line of fmLines) {
    const i = line.indexOf(':');
    if (i < 0) continue;
    const key = line.slice(0, i).trim();
    let val = line.slice(i + 1).trim();
    if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
    fm[key] = val;
  }
  return { fm, body: m[2] };
}

function trimBody(body) {
  return body
    .replace(/^\s*Lưu Trữ.*?Tin t.{1,8}c\n/s, '')
    .replace(/^\s*Tin t.{1,8}c\s*\n/, '')
    .replace(/^[\s\S]*?(##\s|\!\[|\*\*|[A-ZĐ])/, (full, _first, offset) => full.slice(offset))
    .trim();
}

function describeFrom(body) {
  // First non-heading paragraph, max 160 chars
  for (const para of body.split(/\n\n+/)) {
    const text = para.replace(/[*_>#`\[\]\(\)!]/g, '').replace(/\s+/g, ' ').trim();
    if (!text || text.length < 60) continue;
    if (/^!?\[/.test(para)) continue;
    if (/^##/.test(para)) continue;
    if (text.length <= 160) return text;
    // Cut on a sentence boundary close to 155
    const cut = text.slice(0, 157);
    const lastDot = Math.max(cut.lastIndexOf('.'), cut.lastIndexOf('?'), cut.lastIndexOf('!'));
    return (lastDot > 80 ? cut.slice(0, lastDot + 1) : cut + '…');
  }
  return '';
}

function firstImageFrom(body) {
  const m = body.match(/!\[[^\]]*\]\(([^)]+)\)/);
  return m ? m[1] : '';
}

function pickPublishedFromHtml(htmlPath) {
  if (!fs.existsSync(htmlPath)) return '';
  const html = fs.readFileSync(htmlPath, 'utf8');
  const $ = load(html);
  return (
    $('meta[property="article:published_time"]').attr('content') ||
    $('time.entry-date').attr('datetime') ||
    $('time[datetime]').first().attr('datetime') ||
    ''
  );
}

function pickModifiedFromHtml(htmlPath) {
  if (!fs.existsSync(htmlPath)) return '';
  const html = fs.readFileSync(htmlPath, 'utf8');
  const $ = load(html);
  return $('meta[property="article:modified_time"]').attr('content') || '';
}

function pickOgDescription(htmlPath) {
  if (!fs.existsSync(htmlPath)) return '';
  const html = fs.readFileSync(htmlPath, 'utf8');
  const $ = load(html);
  return (
    $('meta[name="description"]').attr('content') ||
    $('meta[property="og:description"]').attr('content') ||
    ''
  ).trim();
}

function yamlString(s) {
  // single-quoted YAML; escape single quotes by doubling
  return `'${String(s).replace(/'/g, "''")}'`;
}

const written = [];
const skipped = [];

for (const slug of INGEST) {
  const rawPath = path.join(RAW, slug + '.md');
  if (!fs.existsSync(rawPath)) {
    skipped.push({ slug, reason: 'no-raw' });
    continue;
  }
  const destPath = path.join(DEST, slug + '.md');
  if (fs.existsSync(destPath)) {
    skipped.push({ slug, reason: 'exists-in-src' });
    continue;
  }
  const raw = fs.readFileSync(rawPath, 'utf8');
  const { fm, body } = parseFrontmatter(raw);
  const cleanBody = trimBody(body);

  const htmlPath = path.join(CLONE, slug, 'index.html');
  const published =
    pickPublishedFromHtml(htmlPath).slice(0, 10) ||
    fm.publishDate ||
    '2024-10-01';
  const modified = pickModifiedFromHtml(htmlPath).slice(0, 10);
  const ogDesc = pickOgDescription(htmlPath);
  const description = ogDesc || describeFrom(cleanBody) || fm.title || '';
  const cover = firstImageFrom(cleanBody);

  const fmOut = [];
  fmOut.push('---');
  fmOut.push(`title: ${yamlString(fm.title || slug)}`);
  fmOut.push(`description: ${yamlString(description)}`);
  fmOut.push(`publishDate: ${published}`);
  if (modified && modified !== published) fmOut.push(`updated: ${modified}`);
  fmOut.push(`author: 'Rồng Vàng Hoàng Gia'`);
  if (cover) fmOut.push(`cover: ${yamlString(cover)}`);
  fmOut.push(`tags: []`);
  fmOut.push(`oldUrl: ${yamlString(fm.oldUrl || '')}`);
  fmOut.push(`relatedProducts: []`);
  fmOut.push('---');

  fs.writeFileSync(destPath, fmOut.join('\n') + '\n\n' + cleanBody + '\n');
  written.push({ slug, published, description: description.length });
}

console.log(`written: ${written.length}`);
for (const w of written) console.log(`  + ${w.slug}  (${w.published})`);
console.log(`skipped: ${skipped.length}`);
for (const s of skipped) console.log(`  - ${s.slug}  (${s.reason})`);

fs.writeFileSync(
  path.join(PROJECT, 'workspace/inventory/post-ingest.json'),
  JSON.stringify({ written, skipped }, null, 2)
);
