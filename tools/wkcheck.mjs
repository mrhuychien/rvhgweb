/**
 * Soát vỡ bố cục trên WebKit (engine của Safari / mọi trình duyệt trên iOS).
 *
 *   pnpm build && node tools/wkcheck.mjs [--width 390]
 *
 * CHẠY TAY, không nằm trong CI: cần Playwright + WebKit (~200 MB) và một mớ
 * thư viện hệ thống (`npx playwright install --with-deps webkit`).
 *
 * Vì sao cần riêng WebKit: Chromium và WebKit phân giải khác nhau khi gặp
 * tham chiếu vòng — ảnh đặt `height: 100%` bên trong khung có `aspect-ratio`.
 * Chromium tự chặn; WebKit lấy tỉ lệ nội tại của ảnh và cho ảnh nở ra. Cộng
 * thêm `min-width: auto` mặc định của flex item, một thẻ sản phẩm phình từ
 * 280px lên 757px và cả dải slider vỡ — Chromium hoàn toàn không thấy gì.
 *
 * Phát hiện hai thứ:
 *   1. phần tử rộng hơn viewport mà không nằm trong vùng cuộn ngang cố ý
 *   2. phần tử phình > 1,5× khung cuộn chứa nó (slider bị vỡ)
 *
 * Exit code 1 nếu có trang vỡ.
 */
import { webkit, devices } from 'playwright';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const arg = (n, d) => { const i = process.argv.indexOf(`--${n}`); return i > -1 && process.argv[i + 1] ? Number(process.argv[i + 1]) : d; };
const WIDTH = arg('width', 0); // 0 = dùng nguyên preset iPhone 13
const DIST = 'dist';
const PORT = 4772;
const TYPES = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.woff2': 'font/woff2' };

const server = http.createServer((req, res) => {
  let f = path.join(DIST, decodeURIComponent(req.url.split('?')[0]));
  try { if (fs.statSync(f).isDirectory()) f = path.join(f, 'index.html'); } catch {}
  if (!fs.existsSync(f)) { res.writeHead(404); res.end(); return; }
  res.writeHead(200, { 'content-type': TYPES[path.extname(f)] ?? 'application/octet-stream' });
  res.end(fs.readFileSync(f));
});
await new Promise((r) => server.listen(PORT, r));

const routes = [];
(function walk(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p);
    else if (e.name === 'index.html') routes.push('/' + path.relative(DIST, p).replace(/index\.html$/, ''));
  }
})(DIST);
routes.sort();

const browser = await webkit.launch();
const device = devices['iPhone 13'];
const ctx = await browser.newContext({ ...device, ...(WIDTH ? { viewport: { ...device.viewport, width: WIDTH } } : {}) });
// Chặn request ra ngoài: GA / Google Translate / poster YouTube treo rất lâu
// sau proxy và không liên quan tới phép đo bố cục.
await ctx.route('**/*', (r) => (r.request().url().startsWith(`http://127.0.0.1:${PORT}`) ? r.continue() : r.abort()));
const page = await ctx.newPage();

let bad = 0;
for (const url of routes) {
  await page.goto(`http://127.0.0.1:${PORT}${url}`, { waitUntil: 'load' });
  await page.evaluate(async () => {
    document.querySelectorAll('img[loading="lazy"]').forEach((i) => i.setAttribute('loading', 'eager'));
    await Promise.all([...document.images].map((i) => (i.complete ? null : new Promise((r) => {
      i.addEventListener('load', r, { once: true });
      i.addEventListener('error', r, { once: true });
    }))));
  });
  await page.waitForTimeout(100);

  const r = await page.evaluate(() => {
    const vw = innerWidth;
    const label = (e) => `${e.tagName.toLowerCase()}.${(e.className || '').toString().split(' ')[0] || '-'}`;

    const scrollable = (e) => ['auto', 'scroll'].includes(getComputedStyle(e).overflowX);
    const overflowing = [...document.querySelectorAll('body *')].filter((e) => {
      if (e.getBoundingClientRect().width <= vw + 1) return false;
      for (let a = e.parentElement; a && a !== document.body; a = a.parentElement) if (scrollable(a)) return false;
      return true;
    }).map((e) => `${Math.round(e.getBoundingClientRect().width)}px  ${label(e)}`);

    const blown = [];
    for (const t of [...document.querySelectorAll('*')].filter(scrollable)) {
      const tw = t.getBoundingClientRect().width;
      if (tw <= 0) continue;
      for (const ch of t.children) {
        const cw = ch.getBoundingClientRect().width;
        if (cw > tw * 1.5) blown.push(`${Math.round(cw)}px trong khung ${Math.round(tw)}px  ${label(ch)}`);
      }
    }
    return { overflowing: [...new Set(overflowing)].slice(0, 5), blown: [...new Set(blown)].slice(0, 4), scrollW: document.documentElement.scrollWidth, vw };
  });

  if (!r.overflowing.length && !r.blown.length && r.scrollW <= r.vw + 1) continue;
  bad++;
  console.error(`BROKEN  ${url}   (scrollWidth ${r.scrollW} / viewport ${r.vw})`);
  r.overflowing.forEach((x) => console.error(`        tràn viewport:      ${x}`));
  r.blown.forEach((x) => console.error(`        phình trong slider: ${x}`));
}

await browser.close();
server.close();

if (bad) {
  console.error(`\nWebKit / iPhone 13 — ${bad}/${routes.length} trang vỡ bố cục.`);
  process.exit(1);
}
console.log(`webkit layout OK — ${routes.length} trang, 0 trang vỡ (WebKit, iPhone 13).`);
