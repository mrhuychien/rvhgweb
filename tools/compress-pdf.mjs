/**
 * Nén PDF công bố/chứng nhận về 150 dpi bằng Ghostscript.
 *
 * Chạy thủ công khi thêm PDF mới:  node tools/compress-pdf.mjs [--apply]
 * Không --apply thì chỉ báo cáo, không ghi đè.
 *
 * 150 dpi giữ nguyên độ đọc của bản scan (đã kiểm bằng mắt trên phiếu kiểm
 * nghiệm Eurofins — chữ, số, mã vạch đều rõ). Bỏ qua file nào nén xong lại
 * không nhỏ hơn ít nhất 8%.
 */
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import os from 'node:os';

const APPLY = process.argv.includes('--apply');
const MIN_GAIN = 0.08;

const files = [];
(function walk(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p);
    else if (e.name.toLowerCase().endsWith('.pdf')) files.push(p);
  }
})('public');

const GS = [
  '-sDEVICE=pdfwrite', '-dCompatibilityLevel=1.5', '-dNOPAUSE', '-dQUIET', '-dBATCH',
  '-dDownsampleColorImages=true', '-dColorImageDownsampleType=/Bicubic', '-dColorImageResolution=150',
  '-dDownsampleGrayImages=true', '-dGrayImageDownsampleType=/Bicubic', '-dGrayImageResolution=150',
  '-dDownsampleMonoImages=true', '-dMonoImageDownsampleType=/Subsample', '-dMonoImageResolution=300',
  '-dColorImageDownsampleThreshold=1.0', '-dGrayImageDownsampleThreshold=1.0',
  '-dAutoFilterColorImages=false', '-dColorImageFilter=/DCTEncode',
  '-dAutoFilterGrayImages=false', '-dGrayImageFilter=/DCTEncode',
  '-dJPEGQ=72',
];

const mb = (n) => (n / 1048576).toFixed(2);
let before = 0, after = 0, changed = 0, skipped = 0;

for (const f of files) {
  const b = fs.statSync(f).size;
  const tmp = path.join(os.tmpdir(), `rvhg-${path.basename(f)}`);
  try {
    execFileSync('gs', [...GS, `-sOutputFile=${tmp}`, f], { stdio: 'pipe' });
  } catch {
    console.log(`  LỖI   ${f}`);
    before += b; after += b;
    continue;
  }
  const a = fs.statSync(tmp).size;
  const gain = 1 - a / b;
  before += b;

  if (gain < MIN_GAIN) {
    after += b;
    skipped++;
    fs.rmSync(tmp);
    continue;
  }
  after += a;
  changed++;
  console.log(`  ${mb(b).padStart(6)} → ${mb(a).padStart(6)} MB  (−${(gain * 100).toFixed(0)}%)  ${f}`);
  if (APPLY) fs.copyFileSync(tmp, f);
  fs.rmSync(tmp);
}

console.log(
  `\n${files.length} file · nén ${changed} · giữ nguyên ${skipped}` +
    `\ntổng ${mb(before)} MB → ${mb(after)} MB  (−${((1 - after / before) * 100).toFixed(0)}%)` +
    (APPLY ? '\nĐÃ GHI ĐÈ.' : '\n(chạy lại với --apply để ghi đè)'),
);
