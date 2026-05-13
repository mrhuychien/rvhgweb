#!/usr/bin/env node
// Newly-ingested posts reference WP-style image filenames in their
// markdown (e.g. /images/legacy/36252859720_9028188217_3k-3.jpeg).
// Re-run the legacy-refs scan, then for every filename that exists in
// workspace/images/legacy/ but NOT in public/images/legacy/, copy it
// across so build doesn't 404.

import fs from 'node:fs';
import path from 'node:path';

const PROJECT = path.resolve(new URL('../../', import.meta.url).pathname);
const WP = path.join(PROJECT, 'workspace/images/legacy');
const PUB = path.join(PROJECT, 'public/images/legacy');

const EXT_OK = /\.(astro|ts|tsx|js|mjs|md|mdx|json)$/i;
function* walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (e.name === 'node_modules' || e.name === 'dist') continue;
      yield* walk(p);
    } else if (e.isFile() && EXT_OK.test(e.name)) yield p;
  }
}

const filenames = new Set();
const re = /\/images\/legacy\/([A-Za-z0-9._\-]+\.(?:jpe?g|png|gif|webp|svg|ico|avif))/gi;
for (const root of ['src', 'public'].map((r) => path.join(PROJECT, r))) {
  for (const f of walk(root)) {
    const txt = fs.readFileSync(f, 'utf8');
    let m;
    while ((m = re.exec(txt)) !== null) filenames.add(m[1]);
  }
}

let copied = 0;
let already = 0;
let missing = 0;
const missingList = [];
for (const f of filenames) {
  const src = path.join(WP, f);
  const dst = path.join(PUB, f);
  if (fs.existsSync(dst)) {
    already++;
    continue;
  }
  if (!fs.existsSync(src)) {
    missing++;
    missingList.push(f);
    continue;
  }
  fs.copyFileSync(src, dst);
  copied++;
}

console.log(`copied:  ${copied}`);
console.log(`already: ${already}`);
console.log(`missing: ${missing}`);
if (missing) {
  console.log('  missing files (not in WP mirror):');
  for (const f of missingList) console.log(`    ${f}`);
}
