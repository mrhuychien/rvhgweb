/**
 * Dung lượng của một file trong public/, định dạng sẵn để hiển thị.
 * Dùng cho link tải PDF trong các file .astro (bản markdown do
 * tools/rehype-file-size.mjs lo). Trả về null nếu không tìm thấy file.
 */
import fs from 'node:fs';
import path from 'node:path';

const cache = new Map<string, string | null>();

export function pdfSize(href: string): string | null {
  if (cache.has(href)) return cache.get(href)!;
  let out: string | null = null;
  try {
    const rel = decodeURIComponent(href.split('?')[0].split('#')[0]).replace(/^\//, '');
    const bytes = fs.statSync(path.join(process.cwd(), 'public', rel)).size;
    const mb = bytes / 1048576;
    out = mb >= 1 ? `${mb.toFixed(1).replace('.', ',')} MB` : `${Math.round(bytes / 1024)} KB`;
  } catch {
    out = null;
  }
  cache.set(href, out);
  return out;
}
