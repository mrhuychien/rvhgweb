/**
 * Rehype plugin: gắn dung lượng vào link tải file nội bộ (PDF).
 *
 *   [Bản tự công bố 01 (PDF)](/cong-bo/01-banh-dau-xanh.pdf)
 *   → Bản tự công bố 01 (PDF) <span class="rvhg-filesize">4,7 MB</span>
 *
 * Trên 4G, bấm nhầm một link 4 MB là mất tiền và mất kiên nhẫn — người đọc
 * cần biết trước. Dung lượng đọc thẳng từ file trong public/ lúc build nên
 * không bao giờ lệch với file thật.
 */
import fs from 'node:fs';
import path from 'node:path';

const cache = new Map();

function sizeOf(href) {
  if (cache.has(href)) return cache.get(href);
  let out = null;
  try {
    const rel = decodeURIComponent(href.split('?')[0].split('#')[0]).replace(/^\//, '');
    const bytes = fs.statSync(path.join(process.cwd(), 'public', rel)).size;
    const mb = bytes / 1048576;
    out = mb >= 1
      ? `${mb.toFixed(1).replace('.', ',')} MB`
      : `${Math.round(bytes / 1024)} KB`;
  } catch {
    out = null;
  }
  cache.set(href, out);
  return out;
}

export default function rehypeFileSize() {
  return (tree) => {
    const walk = (node) => {
      if (!Array.isArray(node.children)) return;
      for (const child of node.children) {
        if (child.type !== 'element') continue;
        if (child.tagName !== 'a') { walk(child); continue; }

        const href = child.properties?.href;
        if (typeof href !== 'string' || !/^\/.*\.pdf$/i.test(href)) continue;
        // đã gắn rồi thì thôi
        if (child.children?.some((c) => c.type === 'element' && c.properties?.className?.includes?.('rvhg-filesize'))) continue;

        const label = sizeOf(href);
        if (!label) continue;

        child.properties.className = [...(child.properties.className ?? []), 'rvhg-filelink'];
        child.children.push({
          type: 'element',
          tagName: 'span',
          properties: { className: ['rvhg-filesize'] },
          children: [{ type: 'text', value: ` · ${label}` }],
        });
      }
    };
    walk(tree);
  };
}
