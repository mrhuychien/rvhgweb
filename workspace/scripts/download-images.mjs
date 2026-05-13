#!/usr/bin/env node
// Read workspace/inventory/image-urls.txt and download every on-site
// image (host == www.rongvanghoanggia.com) into workspace/images/legacy/.
// Filename = basename of URL path. Sequential with a tiny delay; leaves
// manifest in workspace/inventory/image-download.json.
import fs from 'node:fs';
import path from 'node:path';

const INVENTORY = path.resolve(new URL('../inventory', import.meta.url).pathname);
const OUT = path.resolve(new URL('../images/legacy', import.meta.url).pathname);
const URLS_FILE = path.join(INVENTORY, 'image-urls.txt');
const SITE_HOSTS = new Set(['www.rongvanghoanggia.com', 'rongvanghoanggia.com']);

fs.mkdirSync(OUT, { recursive: true });

const urls = fs
  .readFileSync(URLS_FILE, 'utf8')
  .split('\n')
  .map((s) => s.trim())
  .filter(Boolean);

const manifest = [];
let ok = 0;
let skip = 0;
let fail = 0;

for (const url of urls) {
  let host;
  let filename;
  try {
    const u = new URL(url);
    host = u.host;
    filename = path.basename(decodeURIComponent(u.pathname));
  } catch {
    fail++;
    manifest.push({ url, status: 'invalid' });
    continue;
  }
  if (!SITE_HOSTS.has(host)) {
    skip++;
    manifest.push({ url, status: 'off-site', host });
    continue;
  }
  if (!filename || !/\.(jpe?g|png|gif|webp|svg|ico|avif)$/i.test(filename)) {
    skip++;
    manifest.push({ url, status: 'no-filename' });
    continue;
  }
  const dest = path.join(OUT, filename);
  if (fs.existsSync(dest) && fs.statSync(dest).size > 0) {
    ok++;
    manifest.push({ url, filename, status: 'cached', bytes: fs.statSync(dest).size });
    continue;
  }
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; RVHGMigration/1.0)',
        Accept: 'image/avif,image/webp,image/png,image/jpeg,image/svg+xml,image/*;q=0.8',
      },
    });
    if (!res.ok) {
      fail++;
      manifest.push({ url, filename, status: 'http-' + res.status });
      console.error(`FAIL ${res.status} ${url}`);
      continue;
    }
    const buf = Buffer.from(await res.arrayBuffer());
    fs.writeFileSync(dest, buf);
    ok++;
    manifest.push({ url, filename, status: 'ok', bytes: buf.length });
    if (ok % 25 === 0) console.log(`...${ok} downloaded`);
  } catch (e) {
    fail++;
    manifest.push({ url, filename, status: 'error', error: String(e) });
    console.error(`ERROR ${url} :: ${e}`);
  }
  await new Promise((r) => setTimeout(r, 100));
}

fs.writeFileSync(path.join(INVENTORY, 'image-download.json'), JSON.stringify(manifest, null, 2));

console.log(`\nDONE  ok=${ok}  skip=${skip}  fail=${fail}  total=${urls.length}`);
