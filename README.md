# rvhg-site — rongvanghoanggia.com (Astro 5)

Rebuild of the Rồng Vàng Hoàng Gia / Công ty Cổ phần Hoàng Giang website
(WordPress → Astro 5 SSG). Vietnamese-only, mobile-first, zero-JS by default,
optimised for SEO (1:1 URL preservation) and AI crawlers (`llms.txt` +
Schema.org JSON-LD). Tagline: **"Đặc sản nức tiếng Hải Dương"**.

## Stack

- **Astro 5** (SSG, `trailingSlash: 'always'`, `build.format: 'directory'`) — Content Layer API (`glob()` loaders), Content Collections + Zod.
- **Tailwind CSS 4** via `@tailwindcss/vite` (no config file; theme tokens in `src/styles/global.css`).
- **Markdown / MDX** content; **sharp** for image processing.
- Self-hosted fonts: **Be Vietnam Pro** (body) + **Fraunces** (display), subset Latin + Vietnamese, WOFF2 — `public/fonts/`.
- Deploy target: **Vercel** (Hobby), config in `vercel.json`. Node 22.

## Commands

```bash
pnpm install
pnpm dev        # local dev server
pnpm build      # static build → dist/
pnpm preview    # preview the build
```

> Note: if `astro` complains about a pnpm deps check / ignored build scripts,
> run `pnpm install` once (the `pnpm.onlyBuiltDependencies` allowlist in
> `package.json` covers `esbuild` / `sharp`). On CI/Vercel this is automatic.

## Structure

```
src/
  content.config.ts          # Zod schemas for collections (pages, products, productCategories, posts, policies)
  content/                   # Markdown content
  data/site.ts               # company / brand data (single source of truth)
  data/jsonld.ts             # Schema.org builders (Organization, Product, Article, Breadcrumb, FAQ, WebSite)
  components/                # Header, Footer, SEO, ProductCard, CategoryGrid, MediaLogos, DistributionLogos, Breadcrumbs, Logo, LegacyImg, JsonLd
  layouts/                   # BaseLayout, PageLayout, ProductLayout, PostLayout, PolicyLayout
  pages/                     # routes (see URL map below)
  styles/global.css          # Tailwind import + @theme tokens + @font-face + .rvhg-prose + utilities
public/
  images/legacy/             # mirrored wp-content images (currently placeholders — see workspace/README.md)
  fonts/                     # WOFF2 subsets
  llms.txt                   # AI crawler index
  robots.txt
skills/rvhg-content/         # Claude Code skill for writing brand-voice content (install into ~/.claude/skills/)
workspace/                   # Phase-1 (clone & inventory) artifacts — see workspace/README.md
```

## URL map (1:1 with the old WordPress site)

| Route | Source |
|---|---|
| `/` | `src/pages/index.astro` |
| `/gioi-thieu/` | `src/content/pages/gioi-thieu.md` |
| `/cau-chuyen-san-pham-rong-vang-hoang-gia-2/` | `src/content/pages/cau-chuyen-thuong-hieu.md` (via `[slug]`) |
| `/san-pham/` · `/san-pham/<slug>/` | `src/pages/san-pham/…` + `src/content/products/` |
| `/danh-muc-san-pham/<slug>/` | `src/content/product-categories/` |
| `/tin-tuc/` · `/<post-slug>/` | `src/pages/tin-tuc/` + `src/content/posts/` (flat WP-style) |
| `/cong-bo/` | `src/pages/cong-bo/index.astro` |
| `/diem-ban-rong-vang-hoang-gia/` · `/lien-he/` | `src/content/pages/` |
| `/chinh-sach-*/` · `/ban-tu-cong-bo-rong-vang-hoang-gia/` | `src/content/policies/` (via `[slug]`, `noindex`) |
| `/llms.txt` · `/llms-full.txt` · `/sitemap-index.xml` · `/robots.txt` | static / generated |

### Đặt link tùy chỉnh (custom URL)

- **Bài viết** (`src/content/posts/`): mặc định link = **tên file** (`bdx-carot.md` → `/bdx-carot/`).
  Muốn đặt link tách rời tên file, thêm `slug:` vào frontmatter:

  ```yaml
  ---
  title: Bánh đậu xanh cà rốt
  description: …
  publishDate: 2026-06-13
  oldUrl: /bdx-carot/
  slug: bdx-carot   # → link thành /bdx-carot/ (ghi đè tên file)
  ---
  ```

  `slug` chỉ gồm chữ thường, số và dấu gạch ngang (vd `bdx-carot`); sai định dạng sẽ báo lỗi khi build.
- **Trang** (`src/content/pages/`): đặt link qua trường bắt buộc `route:` trong frontmatter (vd `route: /gioi-thieu/`).

## Status & known gaps

> Full project plan: **`docs/BLUEPRINT.md`** · current done/todo state: **`docs/STATUS.md`**.

- **Phase 1 (live-site mirror) is partial** — the build environment had no
  network access to `rongvanghoanggia.com`, so images in `public/images/legacy/`
  are placeholders and content was authored from the blueprint's business
  context. See `workspace/README.md` for the exact TODO to finish the mirror.
- **Analytics**: GA4 / Facebook Pixel are placeholders — wire `PUBLIC_GA_ID` /
  `PUBLIC_FB_PIXEL` env vars when available (conditional in `BaseLayout.astro`).
- **e-commerce**: intentionally none — product CTAs link out to Shopee / TikTok Shop.

## Writing content with Claude

`skills/rvhg-content/` is a Claude Code skill. Install it:

```bash
cp -r skills/rvhg-content ~/.claude/skills/rvhg-content
```

Then ask Claude to "viết blog post RVHG về …" and it loads the brand voice,
brand-story anchors and the right content template, and writes a `.md` into
`src/content/posts/`. Commit + push → Vercel auto-deploys (~60s).
