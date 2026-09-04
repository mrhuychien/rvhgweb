/**
 * Đọc manifest ảnh responsive do tools/gen-responsive.mjs sinh ra.
 *
 * Manifest được tạo ở bước `prebuild`; nếu vì lý do nào đó không có
 * (chạy `astro dev` lần đầu, hoặc bước prebuild lỗi) thì mọi hàm ở đây trả
 * về null và component gọi nó lui về <img> thường — build không bao giờ vỡ
 * chỉ vì thiếu ảnh tối ưu.
 */
import fs from 'node:fs';
import path from 'node:path';

type Entry = { w: number; h: number; v: number[] };

let manifest: Record<string, Entry> | null = null;
let loaded = false;

function load(): Record<string, Entry> | null {
  if (loaded) return manifest;
  loaded = true;
  try {
    manifest = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'public/_img/manifest.json'), 'utf8'));
  } catch {
    manifest = null;
  }
  return manifest;
}

export type Responsive = {
  /** srcset WebP, ví dụ "/_img/legacy/hero-home-640.webp 640w, …" */
  srcset: string;
  /** Kích thước gốc — dùng làm width/height khi call site không truyền. */
  width: number;
  height: number;
};

/** `src` là đường dẫn public tuyệt đối, ví dụ `/images/legacy/hero-home.jpg`. */
export function responsive(src: string): Responsive | null {
  const m = load();
  if (!m) return null;
  const key = src.split('?')[0].split('#')[0];
  const e = m[key];
  if (!e || !e.v?.length) return null;

  const base = '/_img/' + key.replace(/^\/images\//, '').replace(/\.(jpe?g|png)$/i, '');
  return {
    srcset: e.v.map((w) => `${base}-${w}.webp ${w}w`).join(', '),
    width: e.w,
    height: e.h,
  };
}
