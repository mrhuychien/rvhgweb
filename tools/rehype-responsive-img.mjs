/**
 * Rehype plugin: bọc ảnh nội dung (markdown/MDX) trong <picture> kèm srcset WebP.
 *
 * Dùng cùng manifest với LegacyImg.astro (public/_img/manifest.json, do
 * tools/gen-responsive.mjs sinh ở bước prebuild). Ảnh không có trong manifest
 * — ảnh ngoài site, SVG, GIF — được giữ nguyên.
 *
 * Ngoài srcset, plugin còn bổ sung width/height thật (chống CLS), loading và
 * decoding cho mọi ảnh nội dung.
 */
import fs from 'node:fs';
import path from 'node:path';

let manifest = null;
let loaded = false;

function load() {
  if (loaded) return manifest;
  loaded = true;
  try {
    manifest = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'public/_img/manifest.json'), 'utf8'));
  } catch {
    manifest = null;
  }
  return manifest;
}

/** Ảnh trong bài viết chiếm gần trọn cột chữ; cột tối đa ~46rem. */
const CONTENT_SIZES = '(max-width: 768px) 100vw, 46rem';

export default function rehypeResponsiveImg() {
  return (tree) => {
    const m = load();

    const walk = (node) => {
      const kids = node.children;
      if (!Array.isArray(kids)) return;

      for (let i = 0; i < kids.length; i++) {
        const child = kids[i];
        if (child.type !== 'element') continue;

        // Đã bọc rồi thì không bọc lại (chạy lại plugin, hoặc <picture> viết tay).
        if (child.tagName === 'picture') continue;

        if (child.tagName !== 'img') {
          walk(child);
          continue;
        }

        const src = child.properties?.src;
        if (typeof src !== 'string' || !src.startsWith('/images/')) continue;

        // Luôn thêm loading/decoding, kể cả khi không có biến thể WebP.
        child.properties.loading ??= 'lazy';
        child.properties.decoding ??= 'async';

        const key = src.split('?')[0].split('#')[0];
        const entry = m?.[key];
        if (!entry) continue;

        child.properties.width ??= entry.w;
        child.properties.height ??= entry.h;
        if (!entry.v?.length) continue;

        const base = '/_img/' + key.replace(/^\/images\//, '').replace(/\.(jpe?g|png)$/i, '');
        const srcSet = entry.v.map((w) => `${base}-${w}.webp ${w}w`).join(', ');

        kids[i] = {
          type: 'element',
          tagName: 'picture',
          properties: {},
          children: [
            { type: 'element', tagName: 'source', properties: { type: 'image/webp', srcSet, sizes: CONTENT_SIZES }, children: [] },
            child,
          ],
        };
      }
    };

    walk(tree);
  };
}
