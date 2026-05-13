#!/usr/bin/env node
// Sweep newly-ingested posts and clean common WP cruft:
//   • Strip "Để lại một bình luận [Huỷ trả lời](/index.html)" footer.
//   • Strip malformed banhdautraxanh.com image refs.
//   • Strip any remaining `/wp-content/` URLs in img/href.
//   • Strip `[Bình luận](.*)` blocks.
//   • Strip trailing comment links / "Lưu Trữ" prefixes.

import fs from 'node:fs';
import path from 'node:path';

const PROJECT = path.resolve(new URL('../../', import.meta.url).pathname);
const POSTS = path.join(PROJECT, 'src/content/posts');

// Only touch the 19 ingested posts (skip the 5 hand-written ones).
const INGEST_LIST = JSON.parse(
  fs.readFileSync(path.join(PROJECT, 'workspace/inventory/post-ingest.json'), 'utf8')
);
const ingestSlugs = new Set(INGEST_LIST.written.map((x) => x.slug));

const CLEAN_RULES = [
  // The trailing comment form
  /### Để lại một bình luận[\s\S]*$/m,
  /### Bình luận[\s\S]*$/m,
  // Malformed image references like ![""](/.../%22http://...%22)
  /!\[\\?"\\?"\]\([^)]*?%22[^)]*?\)/g,
  // Any leftover image whose URL contains banhdautraxanh.com
  /!\[[^\]]*\]\([^)]*?banhdautraxanh\.com[^)]*?\)/g,
  // Any leftover image whose URL contains /wp-content/
  /!\[[^\]]*\]\([^)]*?\/wp-content\/[^)]*?\)/g,
  // Stray empty link to /index.html
  /\[[^\]]*?\]\(\/?index\.html\)/g,
  // "Lưu Trữ" archive header that appears in some posts
  /^Lưu Trữ.*\n/gm,
];

let changed = 0;
let scanned = 0;
for (const file of fs.readdirSync(POSTS)) {
  if (!file.endsWith('.md')) continue;
  const slug = file.replace(/\.md$/, '');
  if (!ingestSlugs.has(slug)) continue;
  scanned++;
  const fp = path.join(POSTS, file);
  const before = fs.readFileSync(fp, 'utf8');
  let after = before;
  for (const re of CLEAN_RULES) after = after.replace(re, '');
  // Collapse triple newlines
  after = after.replace(/\n{3,}/g, '\n\n').trimEnd() + '\n';
  if (after !== before) {
    fs.writeFileSync(fp, after);
    changed++;
    console.log(`cleaned ${slug}`);
  }
}
console.log(`\nscanned ${scanned} ingested posts, cleaned ${changed}`);
