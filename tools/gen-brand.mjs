/**
 * Sinh toàn bộ asset thương hiệu từ logo vector.
 *
 *   node tools/gen-brand.mjs
 *
 * Nguồn duy nhất: public/images/brand/logo-seal.svg (bản tự chứa — vòng nền
 * oxblood + mark vàng, hiển thị như nhau trên mọi nền) và các biến thể một
 * màu logo-seal-{vang,do,den}.svg.
 *
 * Mark là một màu với rồng + chữ KHOÉT RỖNG, nên màu nền phía sau lộ qua.
 * Đó là lý do bản dùng cho favicon/apple-touch phải tự chứa: nếu để trong
 * suốt, phần rồng sẽ lấy màu thanh tab của trình duyệt và đổi theo theme.
 *
 * Chạy lại sau mỗi lần sửa SVG. Kết quả có commit (trình duyệt và mạng xã
 * hội cần file PNG thật, không build được lúc chạy).
 */
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const BRAND = 'public/images/brand';
const OXBLOOD = '#8B0000';
const CREAM = '#FAF5E9';
const GOLD = '#C8A04D';
const INK = '#1C1714';

const svg = (f) => fs.readFileSync(path.join(BRAND, f));
const VIEWBOX = 1268; // đơn vị viewBox của logo-seal*.svg

/** Rasterise ở 3× kích thước đích rồi thu nhỏ → cạnh mượt.
 *  sharp suy ra số pixel từ density: px = đơn-vị-viewBox / 96 * density,
 *  nên phải tính ngược density theo kích thước cần, không đặt cứng. */
const render = (file, size) =>
  sharp(svg(file), { density: Math.ceil((size * 3 * 96) / VIEWBOX) })
    .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png({ compressionLevel: 9 })
    .toBuffer();

const out = [];
const write = async (p, buf) => {
  fs.writeFileSync(p, buf);
  out.push([p, buf.length]);
};

// ---- favicon: phóng vào phần rồng ----
// Nguyên con dấu ở 16px chỉ còn một đốm vàng: vành chữ "RỒNG VÀNG HOÀNG GIA"
// không thể đọc ở cỡ đó mà vẫn ăn hết pixel. Cắt khung nhìn vào 50% lõi để
// con rồng chiếm trọn khung — vẫn đúng hoạ tiết gốc, chỉ đổi viewBox. Tràn
// viền (không bo tròn) vì ô favicon vốn vuông: bo tròn phí ~21% diện tích.
const ZOOM = 0.5;
const k = ((1 - ZOOM) / 2) * VIEWBOX;
const faviconSvg = fs
  .readFileSync(`${BRAND}/logo-seal.svg`, 'utf8')
  .replace(`viewBox="0 0 ${VIEWBOX} ${VIEWBOX}"`, `viewBox="${k} ${k} ${VIEWBOX * ZOOM} ${VIEWBOX * ZOOM}"`);
fs.writeFileSync(`${BRAND}/favicon-mark.svg`, faviconSvg);
await write('public/favicon.svg', Buffer.from(faviconSvg));

const renderFavicon = (size) =>
  sharp(Buffer.from(faviconSvg), { density: Math.ceil((size * 3 * 96) / (VIEWBOX * ZOOM)) })
    .resize(size, size)
    .png({ compressionLevel: 9 })
    .toBuffer();
for (const s of [16, 32]) await write(`public/favicon-${s}x${s}.png`, await renderFavicon(s));

// ---- apple-touch-icon: iOS tự bo góc, nên dùng ô vuông đặc + mark thụt vào ----
const TOUCH = 180;
const inset = Math.round(TOUCH * 0.12);
await write(
  'public/apple-touch-icon.png',
  await sharp({ create: { width: TOUCH, height: TOUCH, channels: 4, background: OXBLOOD } })
    .composite([{ input: await render('logo-seal-vang.svg', TOUCH - inset * 2), left: inset, top: inset }])
    .png({ compressionLevel: 9 })
    .toBuffer(),
);

// ---- logo vuông cho JSON-LD Organization (Google muốn ảnh raster) ----
await write(`${BRAND}/logo-512.png`, await render('logo-seal.svg', 512));

// ---- ảnh chia sẻ mạng xã hội 1200×630, nền kem → dùng biến thể ĐỎ ----
const W = 1200, H = 630, MARK = 190;
const text = `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${W}" height="16" fill="${GOLD}"/>
  <rect y="${H - 16}" width="${W}" height="16" fill="${OXBLOOD}"/>
  <text x="${W / 2}" y="420" text-anchor="middle" font-family="Georgia,'Times New Roman',serif"
        font-size="68" font-weight="700" fill="${INK}">Rồng Vàng Hoàng Gia</text>
  <text x="${W / 2}" y="474" text-anchor="middle" font-family="Arial,Helvetica,sans-serif"
        font-size="30" fill="#6F5F50">Đặc sản nức tiếng Hải Dương</text>
  <text x="${W / 2}" y="544" text-anchor="middle" font-family="Arial,Helvetica,sans-serif"
        font-size="24" fill="#94733F">Bánh đậu xanh OCOP 5 sao Quốc gia 2024 · ISO 22000:2018</text>
</svg>`;
await write(
  'public/og-default.png',
  await sharp({ create: { width: W, height: H, channels: 4, background: CREAM } })
    .composite([
      { input: await render('logo-seal-do.svg', MARK), left: (W - MARK) / 2, top: 110 },
      { input: Buffer.from(text), left: 0, top: 0 },
    ])
    .png({ compressionLevel: 9 })
    .toBuffer(),
);

for (const [p, n] of out) console.log(`  ${(n / 1024).toFixed(1).padStart(6)} KB  ${p}`);
console.log(`\n${out.length} file đã sinh từ ${BRAND}/logo-seal*.svg`);
