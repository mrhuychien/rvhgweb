import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { SITE, COMPANY } from '../data/site';
import { postSlug } from '../lib/posts';

export const prerender = true;

const BASE = SITE.url.replace(/\/$/, '');

function section(title: string) {
  return `\n\n${'='.repeat(72)}\n${title}\n${'='.repeat(72)}\n`;
}

export const GET: APIRoute = async () => {
  const [pages, productCategories, posts, policies] = await Promise.all([
    getCollection('pages'),
    getCollection('productCategories'),
    getCollection('posts', (p) => !p.data.draft),
    getCollection('policies'),
  ]);

  const lines = [...productCategories].sort((a, b) => a.data.order - b.data.order);

  let out = '';
  out += `# ${COMPANY.brand} — ${SITE.tagline}\n`;
  out += `# ${COMPANY.legalName} · MST ${COMPANY.taxId} · thành lập ${COMPANY.founded}\n`;
  out += `# Nguồn: ${BASE}  ·  Sinh tự động — toàn bộ nội dung website dưới dạng markdown.\n\n`;
  out += `> ${SITE.shortDescription}\n`;

  out += `\n## Mục lục\n`;
  out += `- Trang nội dung: ${pages.map((p) => p.data.title).join('; ')}\n`;
  out += `- Dòng sản phẩm: ${lines.map((c) => c.data.title).join('; ')}\n`;
  out += `- Tin tức / câu chuyện: ${posts.map((p) => p.data.title).join('; ')}\n`;
  out += `- Công bố & chính sách: ${policies.map((p) => p.data.title).join('; ')}\n`;

  out += section('TRANG NỘI DUNG');
  for (const p of pages) {
    out += `\n## ${p.data.title}\nURL: ${BASE}${p.data.route}\n${p.data.description}\n\n${p.body ?? ''}\n`;
  }

  out += section('DÒNG SẢN PHẨM');
  for (const c of lines) {
    out += `\n## ${c.data.title}\n`;
    out += `URL: ${BASE}/danh-muc-san-pham/${c.id}/\n`;
    if (c.data.tagline) out += `Tagline: ${c.data.tagline}\n`;
    out += `${c.data.description}\n`;
    out += `\n${c.body ?? ''}\n`;
    if (c.data.certifications.length > 0) {
      out += `\n### Tiêu chuẩn chất lượng\n`;
      for (const cert of c.data.certifications) {
        out += `- **${cert.title}** — ${cert.body}\n`;
      }
    }
    if (c.data.selfDeclarations.length > 0) {
      out += `\n### Hồ sơ tự công bố\n`;
      for (const decl of c.data.selfDeclarations) {
        out += `- ${decl.label}\n`;
      }
    }
    if (c.data.products.length > 0) {
      out += `\n### Sản phẩm trong dòng (${c.data.products.length})\n`;
      for (const p of c.data.products) {
        out += `- ${p.name}${p.weight ? ` · ${p.weight}` : ''}${p.isOcop5Star ? ' · OCOP 5★' : ''}\n`;
      }
    }
  }

  out += section('TIN TỨC & CÂU CHUYỆN SẢN PHẨM');
  for (const p of [...posts].sort((a, b) => b.data.publishDate.valueOf() - a.data.publishDate.valueOf())) {
    out += `\n## ${p.data.title}\nURL: ${BASE}/${postSlug(p)}/\nNgày đăng: ${p.data.publishDate.toISOString().slice(0, 10)} · Tác giả: ${p.data.author}\n${p.data.description}\n\n${p.body ?? ''}\n`;
  }

  out += section('CÔNG BỐ & CHÍNH SÁCH');
  for (const p of policies) {
    out += `\n## ${p.data.title}\nURL: ${BASE}/${p.id}/\n\n${p.body ?? ''}\n`;
  }

  out += `\n${'='.repeat(72)}\nLIÊN HỆ\n${'='.repeat(72)}\n`;
  out += `Hotline: ${COMPANY.phone} · Email: ${COMPANY.email} · Facebook: ${COMPANY.facebook}\n`;
  out += `Showroom: ${COMPANY.showrooms.join(' | ')}\nNhà máy: ${COMPANY.factoryAddress}\n`;

  return new Response(out, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
