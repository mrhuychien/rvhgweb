/**
 * Soát ảnh render sai kích thước trên toàn site.
 *
 *   pnpm build && pnpm imgcheck
 *   node tools/imgcheck.mjs [--ratio 3] [--width 1440] [--dpr 1]
 *
 * CHẠY TAY, không nằm trong CI: cần Playwright + Chromium (~150 MB), mà
 * playwright không phải dependency của repo. Chạy trước khi merge những
 * thay đổi động tới ảnh hoặc tới <style> của component.
 *
 * Bắt đúng loại lỗi đã từng xảy ra: <img> do LegacyImg render không mang
 * hash scope của component gọi nó, nên rule kiểu `.rvhg-header__emblem img`
 * trong <style> không khớp và ảnh đổ về kích thước gốc (con dấu 512px hiển
 * thị ở chỗ đáng lẽ 76px). Không có gì báo lỗi — build vẫn xanh, link vẫn
 * sống, chỉ giao diện vỡ.
 *
 * Cách đo: naturalWidth / (chiều rộng hiển thị × DPR). Vượt ngưỡng nghĩa là
 * đang tải thừa độ phân giải — hoặc do thiếu `sizes`, hoặc do CSS không ăn.
 *
 * Exit code 1 nếu có ảnh vượt ngưỡng.
 */
import { chromium } from 'playwright';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const arg = (name, fallback) => {
  const i = process.argv.indexOf(`--${name}`);
  return i > -1 && process.argv[i + 1] ? Number(process.argv[i + 1]) : fallback;
};
const RATIO = arg('ratio', 3);
const WIDTH = arg('width', 1440);
// DPR thật của máy: điện thoại phổ biến là 2–3. Đo ở DPR 1 rồi kết luận
// "thừa 3×" là sai — cùng ảnh đó ở DPR 2 chỉ thừa 1,5×.
const DPR = arg('dpr', 1);
const CONCURRENCY = Number(process.env.IMGCHECK_CONCURRENCY || 2);
const DIST = 'dist';
const PORT = 4771;

const TYPES = {
  '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.webp': 'image/webp', '.svg': 'image/svg+xml', '.woff2': 'font/woff2',
};

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

const exe = process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const browser = await chromium.launch(fs.existsSync(exe) ? { executablePath: exe } : {});

/** Ép mọi ảnh tải ngay (bỏ lazy) rồi đo — nhanh hơn nhiều so với cuộn cả trang. */
const measure = async (page, url) => {
  await page.goto(`http://127.0.0.1:${PORT}${url}`, { waitUntil: 'domcontentloaded' });
  await page.evaluate(async () => {
    document.querySelectorAll('img[loading="lazy"]').forEach((i) => i.setAttribute('loading', 'eager'));
    await Promise.all(
      [...document.images].map((i) => (i.complete ? null : new Promise((r) => {
        i.addEventListener('load', r, { once: true });
        i.addEventListener('error', r, { once: true });
      }))),
    );
  });
  return page.evaluate((ratio) => {
    const dpr = devicePixelRatio;
    return [...document.images]
      .filter((i) => i.naturalWidth > 0)
      .map((i) => {
        const w = i.getBoundingClientRect().width;
        return { w: Math.round(w), nat: i.naturalWidth, r: +(i.naturalWidth / (w * dpr)).toFixed(1), src: i.currentSrc.split('/').pop() };
      })
      .filter((o) => o.w > 0 && o.r > ratio);
  }, RATIO);
};

const ctx = await browser.newContext({ viewport: { width: WIDTH, height: 900 }, deviceScaleFactor: DPR });

// Chặn mọi request ra ngoài (GA, Google Translate, poster YouTube…). Chúng
// không liên quan tới phép đo, mà lại treo hàng chục giây sau proxy.
await ctx.route('**/*', (route) => {
  const u = route.request().url();
  return u.startsWith(`http://127.0.0.1:${PORT}`) || u.startsWith('data:')
    ? route.continue()
    : route.abort();
});

const pages = await Promise.all(Array.from({ length: CONCURRENCY }, () => ctx.newPage()));

let bad = 0;
const queue = [...routes];
await Promise.all(pages.map(async (page) => {
  while (queue.length) {
    const url = queue.shift();
    const hits = await measure(page, url);
    if (!hits.length) continue;
    bad++;
    console.error(`OVERSIZED  ${url}`);
    for (const o of hits.slice(0, 5)) {
      console.error(`           ${o.nat}px → hiển thị ${o.w}px  (${o.r}× thừa)  ${o.src}`);
    }
  }
}));

await browser.close();
server.close();

if (bad) {
  console.error(`\n${bad}/${routes.length} trang có ảnh render lớn hơn ${RATIO}× kích thước hiển thị (viewport ${WIDTH}px @${DPR}x).`);
  process.exit(1);
}
console.log(`img check OK — ${routes.length} trang, 0 ảnh sai kích thước (ngưỡng ${RATIO}×, viewport ${WIDTH}px @${DPR}x).`);
