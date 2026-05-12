import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { SITE, COMPANY } from '../data/site';

export const prerender = true;

const BASE = SITE.url.replace(/\/$/, '');

function section(title: string) {
  return `\n\n${'='.repeat(72)}\n${title}\n${'='.repeat(72)}\n`;
}

export const GET: APIRoute = async () => {
  const [pages, productCategories, products, posts, policies] = await Promise.all([
    getCollection('pages'),
    getCollection('productCategories'),
    getCollection('products'),
    getCollection('posts', (p) => !p.data.draft),
    getCollection('policies'),
  ]);

  let out = '';
  out += `# ${COMPANY.brand} — ${SITE.tagline}\n`;
  out += `# ${COMPANY.legalName} · MST ${COMPANY.taxId} · thành lập ${COMPANY.founded}\n`;
  out += `# Nguồn: ${BASE}  ·  Sinh tự động — toàn bộ nội dung website dưới dạng markdown.\n\n`;
  out += `> ${SITE.shortDescription}\n`;

  // Table of contents
  out += `\n## Mục lục\n`;
  out += `- Trang nội dung: ${pages.map((p) => p.data.title).join('; ')}\n`;
  out += `- Danh mục sản phẩm: ${productCategories.map((c) => c.data.title).join('; ')}\n`;
  out += `- Sản phẩm: ${products.map((p) => p.data.title).join('; ')}\n`;
  out += `- Tin tức / câu chuyện: ${posts.map((p) => p.data.title).join('; ')}\n`;
  out += `- Công bố & chính sách: ${policies.map((p) => p.data.title).join('; ')}\n`;

  out += section('TRANG NỘI DUNG');
  for (const p of pages) {
    out += `\n## ${p.data.title}\nURL: ${BASE}${p.data.route}\n${p.data.description}\n\n${p.body ?? ''}\n`;
  }

  out += section('DANH MỤC SẢN PHẨM');
  for (const c of productCategories) {
    out += `\n## ${c.data.title}\nURL: ${BASE}/danh-muc-san-pham/${c.id}/\n${c.data.description}\n\n${c.body ?? ''}\n`;
  }

  out += section('SẢN PHẨM');
  for (const p of products) {
    const d = p.data;
    out += `\n## ${d.title}\nURL: ${BASE}/san-pham/${p.id}/\n`;
    out += `Danh mục: ${d.category}${d.weight ? ` · Khối lượng: ${d.weight}` : ''}${d.packaging ? ` · Quy cách: ${d.packaging}` : ''}${d.sku ? ` · Mã: ${d.sku}` : ''}\n`;
    if (d.isOcop5Star) out += `Chứng nhận: OCOP 5 sao Quốc gia 2024\n`;
    out += `${d.description}\n\n${p.body ?? ''}\n`;
  }

  out += section('TIN TỨC & CÂU CHUYỆN SẢN PHẨM');
  for (const p of [...posts].sort((a, b) => b.data.publishDate.valueOf() - a.data.publishDate.valueOf())) {
    out += `\n## ${p.data.title}\nURL: ${BASE}/${p.id}/\nNgày đăng: ${p.data.publishDate.toISOString().slice(0, 10)} · Tác giả: ${p.data.author}\n${p.data.description}\n\n${p.body ?? ''}\n`;
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
