#!/usr/bin/env node
// Enumerate every /images/legacy/<filename> reference inside src and
// public dirs of the Astro project. Output JSON list to
// workspace/inventory/legacy-refs.json.
import fs from 'node:fs';
import path from 'node:path';

const PROJECT = path.resolve(new URL('../../', import.meta.url).pathname);

const ROOTS = ['src', 'public'].map((r) => path.join(PROJECT, r));
const EXT_OK = /\.(astro|ts|tsx|js|mjs|md|mdx|json)$/i;

function* walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name === 'dist') continue;
      yield* walk(p);
    } else if (entry.isFile() && EXT_OK.test(entry.name)) {
      yield p;
    }
  }
}

const refs = [];
const filenames = new Set();
const re = /\/images\/legacy\/([A-Za-z0-9._\-]+\.(?:jpe?g|png|gif|webp|svg|ico|avif))/gi;

for (const root of ROOTS) {
  for (const f of walk(root)) {
    const txt = fs.readFileSync(f, 'utf8');
    let m;
    while ((m = re.exec(txt)) !== null) {
      refs.push({ file: path.relative(PROJECT, f), filename: m[1] });
      filenames.add(m[1]);
    }
  }
}

const out = {
  filenames: [...filenames].sort(),
  refs: refs.sort((a, b) => a.filename.localeCompare(b.filename)),
};

fs.mkdirSync(path.join(PROJECT, 'workspace/inventory'), { recursive: true });
fs.writeFileSync(
  path.join(PROJECT, 'workspace/inventory/legacy-refs.json'),
  JSON.stringify(out, null, 2)
);

console.log(`unique filenames referenced: ${filenames.size}`);
console.log(`total reference sites      : ${refs.length}`);
console.log(`written                    : workspace/inventory/legacy-refs.json`);
