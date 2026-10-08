/**
 * Soát link Google Drive của hồ sơ tự công bố.
 *
 *   pnpm drivecheck
 *
 * Bản gốc các văn bản tự công bố nằm trên Drive của công ty, không host trong
 * repo (xem src/data/declarations.ts). Markdown không import được TypeScript
 * nên URL Drive bị viết tay ở nhiều nơi — frontmatter danh mục sản phẩm, thân
 * bài trang pháp lý. Đây là chốt chặn để chúng không lệch nhau:
 *
 *   1. Mọi file ID xuất hiện trong src/ phải có trong sổ đăng ký.
 *   2. Mọi mục trong sổ đăng ký phải được dùng ít nhất một lần (không để link
 *      chết nằm lại sau khi đổi nội dung).
 *   3. Không còn link tới PDF đã chuyển sang Drive (public/cong-bo/...) —
 *      file vẫn giữ trong repo làm bản dự phòng nhưng không được dẫn tới nữa.
 *   4. Link Drive phải đúng dạng /file/d/<id>/view (dạng ?id= hay /open?
 *      không hiển thị bản xem trước trên di động).
 *
 * Không gọi mạng: chỉ đối chiếu văn bản trong repo. Tính công khai của file
 * (anyone-with-link) phải kiểm bằng tay khi thêm văn bản mới.
 *
 * Exit code 1 nếu có sai lệch.
 */
import fs from 'node:fs';
import path from 'node:path';

const REGISTRY = 'src/data/declarations.ts';
const ID = '[A-Za-z0-9_-]{25,}';

const read = (p) => fs.readFileSync(p, 'utf8');

const files = [];
(function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else if (/\.(ts|astro|md|mdx|txt)$/.test(e.name)) files.push(p);
  }
})('src');
files.push('public/llms.txt');

const registry = read(REGISTRY);
const known = new Set([...registry.matchAll(new RegExp(`id: '(${ID})'`, 'g'))].map((m) => m[1]));
if (!known.size) {
  console.error(`drivecheck: không đọc được file ID nào trong ${REGISTRY} — sổ đăng ký đổi định dạng?`);
  process.exit(1);
}

const used = new Set();
const errors = [];

for (const f of files) {
  const src = read(f);
  const lines = src.split('\n');
  lines.forEach((line, i) => {
    const at = `${f}:${i + 1}`;

    for (const m of line.matchAll(new RegExp(`drive\\.google\\.com/file/d/(${ID})`, 'g'))) {
      used.add(m[1]);
      if (f !== REGISTRY && !known.has(m[1])) {
        errors.push(`${at}  file ID không có trong ${REGISTRY}: ${m[1]}`);
      }
    }
    // Dạng link Drive khác → chuẩn hoá về /file/d/<id>/view
    // (chỉ xét URL thật — tên miền viết trong code như `h.includes(...)` không tính)
    if (/https?:\/\/drive\.google\.com/.test(line) && !/\/file\/d\/|\/drive\/folders\//.test(line)) {
      errors.push(`${at}  link Drive sai dạng, dùng /file/d/<id>/view: ${line.trim().slice(0, 90)}`);
    }
    // PDF đã chuyển sang Drive thì không được dẫn tới bản host nữa.
    // Bỏ qua chính sổ đăng ký: ở đó `local:` là bản đồ "văn bản này thay PDF nào".
    if (f !== REGISTRY) {
      for (const m of line.matchAll(/["'(](\/cong-bo\/[^"')\s]*\.pdf)/gi)) {
        const local = decodeURIComponent(m[1]);
        if (registry.includes(`local: '${local}'`)) {
          errors.push(`${at}  còn dẫn tới PDF đã chuyển sang Drive: ${local}`);
        }
      }
    }
  });
}

for (const id of known) {
  if (!used.has(id)) errors.push(`${REGISTRY}  mục không được dùng ở đâu cả: ${id}`);
}

if (errors.length) {
  for (const e of errors) console.error(`DRIVE  ${e}`);
  console.error(`\n${errors.length} sai lệch link Drive.`);
  process.exit(1);
}
console.log(`drive check OK — ${known.size} văn bản trên Drive, ${files.length} file đã soát.`);
