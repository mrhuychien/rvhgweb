#!/usr/bin/env node
// Replace SVG placeholders in public/images/legacy/ with real images
// mirrored to workspace/images/legacy/. We copy the real WP file under
// the placeholder filename (extension preserved as-is, per owner's
// decision — browsers tolerate MIME/ext mismatch). No src/ updates.

import fs from 'node:fs';
import path from 'node:path';

const PROJECT = path.resolve(new URL('../../', import.meta.url).pathname);
const SRC = path.join(PROJECT, 'workspace/images/legacy');
const DEST = path.join(PROJECT, 'public/images/legacy');

// referenced filename (in src/* and public/*) -> real WP filename
const MAP = {
  // 1:1 — same name on disk
  'logo-web-120x120.png':                                            'logo-web-120x120.png',
  'cropped-logo-web-270x270.png':                                    'cropped-logo-web-270x270.png',
  'th300-web.jpg':                                                   'th300-web.jpg',
  'tx300-web.jpg':                                                   'tx300-web.jpg',
  'sr300-web.jpg':                                                   'sr300-web.jpg',
  'hop-5-sao-web.jpg':                                               'hop-5-sao-web.jpg',
  'catalogue24-15-2.png':                                            'catalogue24-15-2.png',
  'banh-dau-xanh-hop-tre-cao-cap-rong-vang-hoang-gia.jpg':           'banh-dau-xanh-hop-tre-cao-cap-rong-vang-hoang-gia.jpg',
  'bx-web.jpg':                                                      'bx-web.jpg',
  'cd-web.jpg':                                                      'cd-web.jpg',

  // synthetic placeholder name -> real WP file (ext kept as-is per owner)
  'banh-chung-vang-web.jpg':       'CCV-WEB.jpg',
  'cau-chuyen-khai-dinh-1918.jpg': 'cau-chuyen-san-pham-banh-dau-xanh-rong-vang-hoang-gia.jpg',
  'cat-thuong-hang.jpg':           'HOP-TIEN-VUA-1.png',
  'cat-tet.jpg':                   'CCV-WEB.jpg',
  'cat-truyen-thong.jpg':          'HG20-web.jpg',
  'cat-trai-cay.jpg':              '24-s-web.jpg',
  'cat-bot-dau.jpg':               'bx-web.jpg',
  'hero-home.jpg':                 'Banh-dau-tra-xanh-Rong-Vang-Hoang-Gia-2-scaled.jpg',
  'nha-may-rvhg.jpg':              'lich-su-cong-ty-rong-vang-hoang-gia.jpg',
  'post-cau-chuyen-sau-rieng.jpg': '1.png',
  'post-cau-chuyen-tra-xanh.jpg':  'image-1.png',
  'post-tra-xanh-bien-tau.jpg':    'ChatGPT-Image-16_09_06-25-thg-4-2025.png',
  'post-tra-xanh-ocop.jpg':        'Banh-dau-tra-xanh-Rong-Vang-Hoang-Gia-2-scaled.jpg',
};

const audit = [];
for (const [refName, wpName] of Object.entries(MAP)) {
  const fromPath = path.join(SRC, wpName);
  const toPath = path.join(DEST, refName);

  if (!fs.existsSync(fromPath)) {
    console.error(`MISSING SRC: ${wpName} (for placeholder ${refName})`);
    audit.push({ placeholder: refName, wp: wpName, status: 'missing-src' });
    continue;
  }
  fs.copyFileSync(fromPath, toPath);
  const bytes = fs.statSync(toPath).size;
  audit.push({
    placeholder: refName,
    wp: wpName,
    bytes,
    extMismatch: path.extname(refName).toLowerCase() !== path.extname(wpName).toLowerCase(),
    status: 'ok',
  });
  console.log(`ok  ${wpName}  ->  ${refName}  (${(bytes / 1024).toFixed(1)} KB)`);
}

fs.writeFileSync(
  path.join(PROJECT, 'workspace/inventory/swap-audit.json'),
  JSON.stringify({ map: MAP, audit }, null, 2)
);
console.log('\nwrote workspace/inventory/swap-audit.json');
