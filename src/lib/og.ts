import sharp from 'sharp';

const escapeXml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** Wrap a Vietnamese title across N lines for the 1200×630 card. */
function wrapTitle(title: string, maxCharsPerLine = 26, maxLines = 3): string[] {
  const words = title.split(/\s+/);
  const lines: string[] = [];
  let cur = '';
  for (const w of words) {
    const next = cur ? cur + ' ' + w : w;
    if (next.length > maxCharsPerLine && cur) {
      lines.push(cur);
      cur = w;
      if (lines.length === maxLines - 1) {
        // last line — pack the rest
        const remaining = [w, ...words.slice(words.indexOf(w) + 1)].join(' ');
        if (remaining.length > maxCharsPerLine) {
          cur = remaining.slice(0, maxCharsPerLine - 1) + '…';
        } else {
          cur = remaining;
        }
        break;
      }
    } else {
      cur = next;
    }
  }
  if (cur) lines.push(cur);
  return lines.slice(0, maxLines);
}

export interface OgOptions {
  /** Top eyebrow label, e.g. "SẢN PHẨM · BÁNH ĐẬU XANH THƯỢNG HẠNG" or "TIN TỨC". */
  eyebrow?: string;
  /** Main title — wraps automatically. */
  title: string;
  /** Bottom byline, defaults to the brand tagline. */
  tagline?: string;
  /** When true, paint the OCOP 5★ ribbon. */
  ocop5?: boolean;
}

/** Build a 1200×630 OG card as a PNG Buffer. Pure sharp + SVG, no network. */
export async function renderOg(opts: OgOptions): Promise<Buffer> {
  const eyebrow = (opts.eyebrow || '').toUpperCase();
  const tagline = opts.tagline || 'Đặc sản nức tiếng Hải Dương';
  const lines = wrapTitle(opts.title);
  const titleFontSize = lines.length >= 3 ? 60 : lines.length === 2 ? 68 : 76;
  const titleLeading = titleFontSize * 1.18;
  const titleStartY = 300 - ((lines.length - 1) * titleLeading) / 2;

  const ribbon = opts.ocop5
    ? `<g transform="translate(900,80)">
        <rect width="220" height="46" rx="8" fill="#8B2E2E"/>
        <text x="110" y="29" font-family="Arial, sans-serif" font-size="20" font-weight="700" fill="#FFFFFF" text-anchor="middle">OCOP 5★ QUỐC GIA</text>
      </g>`
    : '';

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#FAF5EA"/>
      <stop offset="1" stop-color="#F1E7D1"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect x="0" y="0" width="1200" height="14" fill="#C8A04D"/>
  <rect x="0" y="616" width="1200" height="14" fill="#8B2E2E"/>

  <!-- seal mark, left -->
  <g transform="translate(80,80)">
    <circle cx="56" cy="56" r="52" fill="none" stroke="#C8A04D" stroke-width="4"/>
    <circle cx="56" cy="56" r="42" fill="none" stroke="#C8A04D" stroke-width="1" stroke-dasharray="3 4"/>
    <text x="56" y="64" font-family="Georgia, 'Times New Roman', serif" font-size="34" font-weight="700" fill="#8B6F2F" text-anchor="middle">RV</text>
  </g>
  <text x="220" y="120" font-family="Georgia, serif" font-size="28" font-weight="700" fill="#1A1612">Rồng Vàng Hoàng Gia</text>
  <text x="220" y="156" font-family="Arial, sans-serif" font-size="20" fill="#6B6157">Đặc sản nức tiếng Hải Dương</text>

  ${ribbon}

  ${eyebrow ? `<text x="80" y="240" font-family="Arial, sans-serif" font-size="22" font-weight="700" letter-spacing="3" fill="#8B6F2F">${escapeXml(eyebrow)}</text>` : ''}

  <g font-family="Georgia, 'Times New Roman', serif" font-weight="700" fill="#1A1612">
    ${lines
      .map((l, i) => `<text x="80" y="${Math.round(titleStartY + i * titleLeading)}" font-size="${titleFontSize}">${escapeXml(l)}</text>`)
      .join('\n    ')}
  </g>

  <text x="80" y="560" font-family="Arial, sans-serif" font-size="22" fill="#8B6F2F">${escapeXml(tagline)}</text>
  <text x="1120" y="560" font-family="Arial, sans-serif" font-size="20" fill="#6B6157" text-anchor="end">rongvanghoanggia.com</text>
</svg>`;

  return await sharp(Buffer.from(svg))
    .png({ compressionLevel: 9 })
    .toBuffer();
}
