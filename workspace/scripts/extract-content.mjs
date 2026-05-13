#!/usr/bin/env node
// Walk workspace/clone HTML files, classify each page (home / page /
// product / product_category / post / policy), strip WP/Elementor
// wrapper, convert to clean Markdown, and write to
// workspace/content-raw/{type}/{slug}.md with YAML frontmatter.
// Also emits workspace/inventory/urls-discovered.csv.
import fs from 'node:fs';
import path from 'node:path';
import { load } from 'cheerio';
import TurndownService from 'turndown';
import gfm from 'turndown-plugin-gfm';

const ROOT = path.resolve(new URL('../clone', import.meta.url).pathname);
const OUT = path.resolve(new URL('../content-raw', import.meta.url).pathname);
const INVENTORY = path.resolve(new URL('../inventory', import.meta.url).pathname);
const SITE = 'https://www.rongvanghoanggia.com';

const turndown = new TurndownService({
  headingStyle: 'atx',
  bulletListMarker: '-',
  codeBlockStyle: 'fenced',
  emDelimiter: '_',
});
turndown.use(gfm.gfm);
// Strip <script> / <style> / <noscript>
turndown.remove(['script', 'style', 'noscript', 'iframe']);

// Convert WP image URLs → /images/legacy/<basename>
turndown.addRule('legacyImages', {
  filter: 'img',
  replacement(_content, node) {
    const src = node.getAttribute('src') || '';
    const alt = (node.getAttribute('alt') || '').replace(/\s+/g, ' ').trim();
    if (!src) return '';
    let localPath = src;
    try {
      const u = new URL(src, SITE);
      if (u.pathname.startsWith('/wp-content/uploads/')) {
        localPath = '/images/legacy/' + path.basename(decodeURIComponent(u.pathname));
      } else {
        localPath = u.pathname;
      }
    } catch {}
    return `![${alt}](${localPath})`;
  },
});

// Convert internal links: strip protocol+host if it's our site, keep trailing slash
turndown.addRule('internalLinks', {
  filter: (node) => node.nodeName === 'A' && node.getAttribute('href'),
  replacement(content, node) {
    let href = node.getAttribute('href') || '';
    try {
      const u = new URL(href, SITE);
      if (u.host === 'www.rongvanghoanggia.com' || u.host === 'rongvanghoanggia.com') {
        href = u.pathname + (u.search || '');
      } else {
        href = u.toString();
      }
    } catch {}
    return `[${content}](${href})`;
  },
});

function* walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(p);
    else if (entry.isFile() && /\.html?$/i.test(entry.name)) yield p;
  }
}

function pageKind(urlPath) {
  if (urlPath === '/' || urlPath === '') return 'home';
  if (urlPath.startsWith('/san-pham/')) {
    if (urlPath === '/san-pham/' || urlPath === '/san-pham') return 'page';
    return 'product';
  }
  if (urlPath.startsWith('/danh-muc-san-pham/')) return 'product_category';
  if (
    urlPath.startsWith('/chinh-sach-') ||
    urlPath.startsWith('/ban-tu-cong-bo-')
  ) return 'policy';
  if (urlPath.startsWith('/cong-bo/') || urlPath === '/cong-bo/') return 'page';
  if (
    urlPath === '/gioi-thieu/' ||
    urlPath === '/lien-he/' ||
    urlPath === '/diem-ban-rong-vang-hoang-gia/' ||
    urlPath === '/tin-tuc/'
  ) return 'page';
  if (urlPath === '/cau-chuyen-san-pham-rong-vang-hoang-gia-2/') return 'page';
  // Anything else with a trailing slash and no extension we treat as a flat-WP post.
  return 'post';
}

function urlPathFromFile(htmlFile) {
  let rel = path.relative(ROOT, htmlFile);
  rel = rel.replace(/\\/g, '/');
  // Drop leading host dir
  rel = rel.replace(/^www\.rongvanghoanggia\.com\//, '');
  if (rel === 'index.html') return '/';
  rel = rel.replace(/index\.html$/i, '');
  rel = rel.replace(/\.html$/i, '/');
  if (!rel.startsWith('/')) rel = '/' + rel;
  if (!rel.endsWith('/')) rel = rel + '/';
  return rel;
}

function pickMain($) {
  // Try a sequence of common main-content selectors
  const sels = [
    'main#main',
    'main.site-main',
    'main',
    'article.post',
    'article',
    '.entry-content',
    '.elementor-section-wrap',
    '#content',
    '.site-content',
  ];
  for (const s of sels) {
    const el = $(s).first();
    if (el.length && el.text().trim().length > 50) return el;
  }
  return $('body');
}

function clean($, $root) {
  $root.find('header, footer, .site-header, .site-footer, nav, .navigation, .breadcrumb, .breadcrumbs, .yoast-breadcrumb').remove();
  $root.find('.elementor-widget-image-carousel, .swiper, .slick-slider').remove();
  $root.find('.related-products, .upsells, .cross-sells, .product_meta, .woocommerce-tabs, #reviews').remove();
  $root.find('.sharedaddy, .jp-relatedposts, .post-share, .social-share').remove();
  $root.find('.elementor-icon-list-icon, .elementor-icon, .elementor-screen-only').remove();
  $root.find('button, form, input, select, textarea').remove();
  $root.find('[role="dialog"], [aria-hidden="true"]').remove();
  // Drop empty paragraphs and divs after cleaning
  $root.find('p, div, span').each((_, el) => {
    const $el = $(el);
    if ($el.children().length === 0 && $el.text().trim() === '' && $el.find('img').length === 0) {
      $el.remove();
    }
  });
}

function pickTitle($) {
  return (
    $('h1.entry-title').first().text().trim() ||
    $('h1').first().text().trim() ||
    $('meta[property="og:title"]').attr('content') ||
    $('title').text().replace(/\s*[-|–]\s*Rồng Vàng Hoàng Gia.*$/i, '').trim()
  );
}
function pickDescription($) {
  return (
    $('meta[name="description"]').attr('content') ||
    $('meta[property="og:description"]').attr('content') ||
    ''
  ).trim();
}
function pickDate($) {
  const t =
    $('time.entry-date').attr('datetime') ||
    $('meta[property="article:published_time"]').attr('content') ||
    '';
  if (!t) return '';
  return t.slice(0, 10);
}
function pickCover($) {
  const og = $('meta[property="og:image"]').attr('content');
  if (!og) return '';
  try {
    const u = new URL(og, SITE);
    if (u.pathname.startsWith('/wp-content/uploads/')) {
      return '/images/legacy/' + path.basename(decodeURIComponent(u.pathname));
    }
  } catch {}
  return '';
}

fs.mkdirSync(OUT, { recursive: true });
fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });

const rows = [['old_url', 'new_route', 'content_type', 'title', 'status', 'notes']];
let count = 0;

for (const file of walk(ROOT)) {
  const urlPath = urlPathFromFile(file);
  // Filter out non-content pages
  if (
    /^\/(wp-admin|wp-login|wp-json|feed|cart|checkout|my-account|attachment|author)/i.test(urlPath) ||
    /\?p=/i.test(urlPath) ||
    /\?s=/i.test(urlPath) ||
    urlPath.includes('/?') ||
    urlPath.startsWith('/wp-content/') ||
    urlPath.startsWith('/wp-includes/')
  ) continue;

  const html = fs.readFileSync(file, 'utf8');
  const $ = load(html);
  const kind = pageKind(urlPath);
  const title = pickTitle($);
  const description = pickDescription($);
  const date = pickDate($);
  const cover = pickCover($);

  // Pick the main content, clean it
  const $main = pickMain($);
  clean($, $main);
  const md = turndown.turndown($main.html() || '').trim();

  // slug + dir
  let dir, slug;
  if (urlPath === '/') {
    dir = OUT;
    slug = 'home';
  } else {
    const trimmed = urlPath.replace(/^\/|\/$/g, '');
    const parts = trimmed.split('/');
    slug = parts[parts.length - 1];
    dir = path.join(OUT, kind);
  }
  fs.mkdirSync(dir, { recursive: true });

  const fm = [];
  fm.push('---');
  fm.push(`title: ${JSON.stringify(title)}`);
  if (description) fm.push(`description: ${JSON.stringify(description)}`);
  fm.push(`oldUrl: "${SITE}${urlPath}"`);
  fm.push(`newRoute: "${urlPath}"`);
  fm.push(`contentType: ${kind}`);
  if (date) fm.push(`publishDate: ${date}`);
  if (cover) fm.push(`cover: "${cover}"`);
  fm.push('---');

  const outFile = path.join(dir, slug + '.md');
  fs.writeFileSync(outFile, fm.join('\n') + '\n\n' + md + '\n');

  rows.push([
    SITE + urlPath,
    urlPath,
    kind,
    title.replace(/"/g, '""'),
    'extracted',
    path.relative(path.resolve(new URL('..', import.meta.url).pathname), outFile),
  ]);
  count++;
}

const csv = rows
  .map((r) =>
    r
      .map((c) =>
        /[",\n]/.test(String(c)) ? `"${String(c).replace(/"/g, '""')}"` : String(c)
      )
      .join(',')
  )
  .join('\n');
fs.writeFileSync(path.join(INVENTORY, 'urls-discovered.csv'), csv + '\n');

console.log(`extracted ${count} pages → workspace/content-raw/`);
console.log(`wrote     workspace/inventory/urls-discovered.csv`);
