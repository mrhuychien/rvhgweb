/**
 * Sinh biến thể WebP responsive cho ảnh trong public/images/.
 *
 * Chạy tự động trước mỗi build (npm script `prebuild`). Kết quả nằm ở
 * public/_img/ và KHÔNG commit — build lại là có, nên repo không phình.
 *
 *   public/images/legacy/hero-home.jpg
 *     → public/_img/legacy/hero-home-640.webp, -960.webp, …
 *     → public/_img/manifest.json  { "/images/legacy/hero-home.jpg": {w,h,v:[…]} }
 *
 * LegacyImg.astro đọc manifest để phát <picture>. Không có manifest thì
 * component tự lui về <img> thường — build vẫn chạy.
 */
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const SRC_DIR = 'public/images';
const OUT_DIR = 'public/_img';
const MANIFEST = path.join(OUT_DIR, 'manifest.json');
// 128/192 phục vụ các ảnh hiển thị rất nhỏ (con dấu ở header/footer chỉ
// 62–84px nhưng file gốc 512px / 182 KB).
const WIDTHS = [128, 192, 320, 480, 640, 960, 1280, 1600];
const QUALITY = 75;
const EXT = /\.(jpe?g|png)$/i;
const CONFIG_KEY = `${WIDTHS.join('-')}q${QUALITY}`;

const files = [];
(function walk(d) {
  if (!fs.existsSync(d)) return;
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p);
    else if (EXT.test(e.name)) files.push(p);
  }
})(SRC_DIR);

// Manifest cũ cho phép bỏ qua ảnh chưa đổi (mtime + size) giữa các lần build.
let prev = {};
try {
  prev = JSON.parse(fs.readFileSync(MANIFEST, 'utf8'));
} catch {}

const manifest = {};
let made = 0;
let skipped = 0;

for (const file of files) {
  const rel = '/' + path.relative('public', file).replace(/\\/g, '/'); // /images/…
  const stat = fs.statSync(file);
  // Danh sách width + chất lượng nằm trong stamp: đổi cấu hình là cache tự
  // hết hiệu lực, không phải nhớ xoá public/_img bằng tay.
  const stamp = `${stat.size}:${Math.round(stat.mtimeMs)}:${CONFIG_KEY}`;

  let meta;
  try {
    meta = await sharp(file).metadata();
  } catch {
    continue; // file hỏng → để nguyên ảnh gốc
  }
  if (!meta.width || !meta.height) continue;

  const widths = WIDTHS.filter((w) => w < meta.width);
  if (meta.width <= WIDTHS[0]) {
    // Ảnh đã nhỏ hơn mức nhỏ nhất → không cần biến thể.
    manifest[rel] = { w: meta.width, h: meta.height, v: [], stamp };
    continue;
  }
  widths.push(meta.width); // luôn có một bản đúng kích thước gốc

  const cached = prev[rel];
  const outBase = path.join(OUT_DIR, path.relative('public/images', file)).replace(EXT, '');
  const allExist = cached?.stamp === stamp && cached.v?.every((w) => fs.existsSync(`${outBase}-${w}.webp`));
  if (allExist) {
    manifest[rel] = cached;
    skipped++;
    continue;
  }

  fs.mkdirSync(path.dirname(outBase), { recursive: true });
  for (const w of widths) {
    await sharp(file).resize({ width: w, withoutEnlargement: true }).webp({ quality: QUALITY }).toFile(`${outBase}-${w}.webp`);
  }
  manifest[rel] = { w: meta.width, h: meta.height, v: widths, stamp };
  made++;
}

fs.mkdirSync(OUT_DIR, { recursive: true });
fs.writeFileSync(MANIFEST, JSON.stringify(manifest, null, 0));
console.log(`responsive images: ${made} ảnh xử lý, ${skipped} bỏ qua (đã có), ${Object.keys(manifest).length} mục trong manifest.`);
