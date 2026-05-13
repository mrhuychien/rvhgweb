# RVHG WEBSITE REBUILD — BLUEPRINT v2

**Project**: Rebuild `rongvanghoanggia.com` (WordPress → Astro)
**Owner**: Nguyễn Huy Chiến (1nguoi.com)
**Date**: 12/05/2026
**Status**: APPROVED for execution

**Changes from v1**:
- Tagline confirmed: "Đặc sản nức tiếng Hải Dương" (bỏ yêu cầu rhyme với "Gia")
- Deploy: **Vercel** thay Cloudflare Pages
- Brand assets: download trực tiếp từ wp-content (logo, favicon)
- GA4/Facebook Pixel: chưa có, để placeholder env trống
- Image migration: download toàn bộ từ site gốc → upload lại Astro public

---

## 0. EXECUTIVE SUMMARY

Rebuild website giới thiệu Công ty Cổ phần Hoàng Giang (thương hiệu Rồng Vàng Hoàng Gia) từ WordPress sang Astro 5 SSG. Mục tiêu: giữ nguyên 100% URL cũ (SEO preservation), đạt Lighthouse 100/100, tối ưu cho AI crawlers (ChatGPT, Claude, Gemini, Perplexity) qua `llms.txt` + Schema.org JSON-LD, và thiết lập workflow viết nội dung bằng AI cho 1 developer.

**Success looks like**:
1. Mỗi URL cũ trong sitemap WordPress đều trả 200 với content tương đương trên Astro site
2. Lighthouse Performance/Accessibility/SEO/Best Practices = 100/100/100/100 trên homepage và 3 trang đại diện
3. `llms.txt` + `llms-full.txt` phục vụ tốt khi AI crawler hỏi về RVHG
4. Anh prompt 1 câu → Claude tạo bài blog `.md` đúng brand voice → commit → auto deploy < 2 phút trên Vercel

---

## 1. CONTEXT & CONSTRAINTS

### 1.1 Business context
- **Công ty**: CTCP Hoàng Giang (MST 0800280839, ĐKKD 06/06/2003)
- **Thương hiệu**: Rồng Vàng Hoàng Gia (RVHG)
- **Tagline chính thức**: **"Đặc sản nức tiếng Hải Dương"**
- **Sản phẩm cốt lõi**: Bánh đậu xanh OCOP 5 sao quốc gia (duy nhất 2024) + bột đậu xanh dinh dưỡng 4 SKU (Cà Rốt, Rau Má, Sữa Dừa, Matcha)
- **Lịch sử**: Khởi nghiệp 1997, 28 năm sản xuất, ISO 22000:2018 (HA 394/2.23.CIV cấp 08/08/2023)
- **Người sáng lập**: Ông Đào Văn Tiến (nguyên Thẩm phán TAND tỉnh Hải Dương) + 2 anh em
- **Địa chỉ nhà máy**: Đường An Lưu, Cụm CN Cẩm Thượng, phường Thành Đông, TP Hải Phòng (cập nhật sau sáp nhập tỉnh 2025)
- **Showroom**: 209C Tuệ Tĩnh và 9 Bạch Đằng, TP Hải Dương
- **Liên hệ**: 0934362658 · info@rongvanghoanggia.com · fb.com/rongvanghoanggiapage
- **Phân phối**: BigC/GO!, WinMart, AEON, Lotte, Coopmart, MegaMarket, Lan Chi + Shopee, TikTokShop
- **Xuất khẩu**: Nhật, Mỹ, Anh, Hàn, Canada

### 1.2 Brand story anchors (dùng cho mọi content)
- **Truyền thuyết Khải Định 1918**: Vua kinh lý Trấn Hải Dương, dân dâng bánh đậu xanh, Vua ban sắc phong "Bánh Ngon", ấn chỉ Rồng Vàng của Hoàng Gia. (Đã xác minh chuyến tuần du miền Bắc 1918 của Khải Định.)
- **OCOP 5 sao 2024**: bánh đậu xanh ĐẦU TIÊN và DUY NHẤT đạt OCOP 5 sao quốc gia
- **ISO 22000:2018**: chứng nhận quốc tế, do Quacert cấp
- **Tinh hoa văn hóa Xứ Đông**: nhấn mạnh truyền thống làng nghề
- **Tagline**: "Đặc sản nức tiếng Hải Dương" — dùng làm subtitle dưới logo, OG description fallback, hero subline. Không thay đổi.

### 1.3 Hard constraints
- **URL preservation**: TẤT CẢ URL cũ phải trả 200, không 404, không redirect chain. Trailing slash giữ nguyên (`/gioi-thieu/` không phải `/gioi-thieu`).
- **Vietnamese-only UI**: không multilingual ở v1.
- **Mobile-first**: > 60% traffic FMCG VN từ mobile.
- **Tải nhanh ở VN**: Vercel edge SG (sin1), HKG → tốt cho VN traffic.
- **Không e-commerce checkout**: chỉ giới thiệu + dẫn link sang Shopee/TikTokShop cho mua.
- **Asset preservation**: TOÀN BỘ image hiện có trên site gốc phải được mirror về và serve lại từ Astro `public/images/legacy/`, không hot-link ngược về wp-content.

### 1.4 Non-negotiables về branding
- Logo gốc download trực tiếp từ wp-content, giữ nguyên (không re-render)
- Bao bì sản phẩm: ảnh thật từ wp-content, không re-render
- Không AI-generate ảnh sản phẩm hoặc nhà máy
- Citation các bài báo (Báo Chính phủ, VTV, Báo Pháp Luật, VOV, Dân Trí, HTV, Đài THHD): giữ link gốc external, mở tab mới

---

## 2. TECH STACK (FROZEN)

| Layer | Choice | Version | Lý do |
|---|---|---|---|
| SSG | Astro | 5.x | Content Layer API, View Transitions stable, zero-JS default |
| Styling | Tailwind CSS | 4.x (Vite plugin) | Không config file, performance |
| Content | Markdown + MDX | — | Git-native, AI editable |
| Schema | Zod (qua Astro Content Collections) | — | Type-safe frontmatter |
| Image | Astro `<Image />` + sharp | — | Auto WebP/AVIF, responsive `srcset` |
| **Deploy** | **Vercel (Hobby plan free)** | — | **Anh đã quen workflow npp.sale, edge SG gần VN, auto preview per PR** |
| Repo | GitHub (private) | — | Trigger Vercel auto deploy |
| Node | 22 LTS | — | Astro 5 requirement |
| Package manager | pnpm | latest | Disk-efficient |
| Font | Be Vietnam Pro + Fraunces (display) | self-hosted, subset Vietnamese | LCP optimization, GDPR-safe |

**FROZEN**: không đổi stack giữa các phase. Nếu phát sinh blocker, raise issue trước khi tự thay.

**Vercel Hobby limits cần aware**:
- 100GB bandwidth/tháng — đủ cho website giới thiệu (Astro static rất nhẹ)
- 6000 build minutes/tháng — đủ cho update content thường xuyên
- Nếu vượt giới hạn, upgrade Pro $20/tháng. Khả năng vượt với website này gần như 0%.

---

## 3. PHASE 1 — CLONE & INVENTORY

### 3.1 Goal
Mirror toàn bộ rongvanghoanggia.com về local, build URL inventory CSV, extract content sạch và download TOÀN BỘ hình ảnh để feed sang Phase 2.

### 3.2 Tasks (sequenced)

**T1.1 — Mirror site bằng wget**
```bash
mkdir -p workspace/clone && cd workspace/clone
wget --mirror \
  --convert-links \
  --adjust-extension \
  --page-requisites \
  --no-parent \
  --wait=1 \
  --random-wait \
  --user-agent="Mozilla/5.0 (compatible; RVHGMigration/1.0)" \
  https://www.rongvanghoanggia.com/
```

**T1.2 — Build URL inventory CSV**
Output: `workspace/inventory/urls.csv` với schema:
| old_url | new_route | content_type | title | status | notes |
|---|---|---|---|---|---|

Loại trừ: `/wp-admin/`, `/wp-login.php`, `/feed/`, `/?p=`, `/cart/`, `/checkout/`, `/my-account/`, search results, attachment pages.
Content types: `page`, `product`, `product_category`, `post`, `policy`, `home`.

**T1.3 — Extract content → Markdown**
Dùng Node script với `turndown` + `cheerio`:
- Strip WordPress wrapper HTML (.elementor, .wp-block-*, navigation, footer)
- Giữ: heading hierarchy, paragraphs, images (với alt text), links, lists, tables
- Convert image URLs: `https://rongvanghoanggia.com/wp-content/uploads/...` → relative path `/images/legacy/...`
- Frontmatter sinh tự động: title, description (từ meta), date, oldUrl, contentType

Output: `workspace/content-raw/{contentType}/{slug}.md`

**T1.4 — Download TOÀN BỘ images từ site gốc** (CRITICAL)
Strategy 2 nhánh, làm cả 2:

**Nhánh A — wget recursive image download**:
```bash
mkdir -p workspace/images/legacy
wget --no-parent \
  --recursive --level=inf \
  --accept jpg,jpeg,png,webp,gif,svg,ico \
  --directory-prefix=workspace/images/legacy \
  --no-directories \
  --execute robots=off \
  https://www.rongvanghoanggia.com/wp-content/uploads/
```

**Nhánh B — parse all `<img src>` từ HTML đã mirror, tải bổ sung**:
- Cheerio scan tất cả `.html` trong `workspace/clone/`
- Extract URLs từ `<img src>`, `<source srcset>`, CSS `background-image`
- Diff với folder nhánh A → tải bổ sung những file thiếu
- Bao gồm: logo, favicon, product images, partner logos, media logos, banner, hero

**Lưu ý**: WordPress thường có nhiều size variants của 1 ảnh (vd `logo-web-120x120.png`, `logo-web-300x150.png`, `cropped-logo-web-270x270.png`). Tải HẾT, Phase 2 sẽ optimize lại bằng Astro `<Image>` để generate srcset mới.

Output:
- `workspace/images/legacy/*.{jpg,png,webp,svg,ico}` — toàn bộ ảnh
- `workspace/inventory/images.csv` với schema: | original_url | local_filename | size_kb | dimensions | usage_count | alt_text |

**T1.5 — Brand asset specific download** (đảm bảo không miss)
Confirmed URLs từ trang chủ — Claude Code phải verify download được:
- `https://www.rongvanghoanggia.com/wp-content/uploads/2024/10/logo-web-120x120.png`
- `https://www.rongvanghoanggia.com/wp-content/uploads/2024/10/cropped-logo-web-270x270.png`
- `https://www.rongvanghoanggia.com/favicon.ico` (hoặc whatever WP serve)
- `https://rongvanghoanggia.com/wp-content/uploads/2024/10/th300-web.jpg` (bánh đậu xanh thượng hạng)
- `https://rongvanghoanggia.com/wp-content/uploads/2024/10/tx300-web.jpg` (bánh đậu trà xanh)
- `https://rongvanghoanggia.com/wp-content/uploads/2024/10/sr300-web.jpg` (bánh đậu sầu riêng)
- `https://rongvanghoanggia.com/wp-content/uploads/2024/10/hop-5-sao-web.jpg` (hộp quà OCOP)
- `https://rongvanghoanggia.com/wp-content/uploads/2024/10/catalogue24-15-2.png` (bánh đậu MIX)
- `https://rongvanghoanggia.com/wp-content/uploads/2024/10/banh-dau-xanh-hop-tre-cao-cap-rong-vang-hoang-gia.jpg`
- `https://rongvanghoanggia.com/wp-content/uploads/2024/10/bx-web.jpg` (bột đậu xanh)
- `https://rongvanghoanggia.com/wp-content/uploads/2024/10/cd-web.jpg` (chè đậu đen cốt dừa)

Partner logos (siêu thị):
- `1652155214649-sieu-thi-big-c.png`, `tai-xuong-1.png`, `aeon.jpg`, `WinMart-Logo-PNG-1.png`, `29-06-20129-47-16AM.jpg`, `9181825b44d9689e0ccf2d93347a16db.png`, `LANCHI-MART-brand-book-1.png`, `ptaDgh9mP0wOuDOXGLZZDU31ShBsp7b5_*.png`

Media logos (báo chí):
- `bao-chinh-phu-150x150.jpg`, `Dai-truyen-hinh-Viet-Nam-VTV-150x150.jpg`, `lich-phat-song-thhd-150x150.png`, `Dai-Truyen-hinh-TP-Ho-Chi-Minh-HTV-150x150.png`, `Logo-NhanDan-150x150.png`, `Logo_bao_phap_luat_Viet_Nam-150x150.png`, `tai-xuong-150x150.png` (VOV), `logoshare-150x150.png`, `logo-bao-dien-tu-dan-tri1-150x150.jpg`, `channels4_profile.jpg`

**T1.6 — Build redirect map (nếu cần)**
Trong Phase 2 sẽ map 1-1 nên có thể không cần redirect. Nếu phát hiện URL trùng hoặc cần consolidate, tạo `workspace/inventory/redirects.csv`:
| from | to | type (301/302) |

### 3.3 Acceptance gate (anh phải approve)
- [ ] `urls.csv` có ≥ 20 rows (homepage + 7 main pages + 5 categories + 10+ products + 5+ posts + 5 policies)
- [ ] Mỗi row có `status=200` từ wget log
- [ ] Folder `workspace/content-raw/` có file `.md` cho mọi row
- [ ] Random spot-check 3 file `.md` → content sạch, không còn HTML rác
- [ ] **`workspace/images/legacy/` có ≥ 100 files (WP thường có nhiều size variants)**
- [ ] **Tất cả ảnh ở mục T1.5 đã download thành công, không 404**
- [ ] `images.csv` đầy đủ, không có 404

**STOP. Trình anh `urls.csv` + 3 sample `.md` + danh sách image count → chờ "APPROVED Phase 1" → sang Phase 2.**

---

## 4. PHASE 2 — ASTRO REBUILD

### 4.1 Project init
```bash
pnpm create astro@latest rvhg-site -- --template minimal --typescript strict --no-install
cd rvhg-site
pnpm install
pnpm add -D @astrojs/sitemap @astrojs/mdx tailwindcss @tailwindcss/vite sharp
```

### 4.2 `astro.config.mjs`
```javascript
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import tailwindcss from '@tailwindcss/vite';
export default defineConfig({
  site: 'https://www.rongvanghoanggia.com',
  trailingSlash: 'always',          // CRITICAL: giữ URL cũ
  build: { format: 'directory' },    // /gioi-thieu/index.html
  integrations: [sitemap(), mdx()],
  vite: { plugins: [tailwindcss()] },
  image: { service: { entrypoint: 'astro/assets/services/sharp' } },
});
```

### 4.3 `vercel.json` (root project)
```json
{
  "trailingSlash": true,
  "cleanUrls": false,
  "headers": [
    {
      "source": "/(.*).(jpg|jpeg|png|webp|avif|svg|ico|woff2)",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }
      ]
    },
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "SAMEORIGIN" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" }
      ]
    }
  ]
}
```
`trailingSlash: true` đảm bảo Vercel không strip trailing slash → match với Astro output → không bị redirect loop hoặc 404.

### 4.4 Folder structure
```
rvhg-site/
├── public/
│   ├── images/legacy/       # ảnh từ wp-content (Phase 1 download, copy vào đây)
│   ├── fonts/               # Be Vietnam Pro, Fraunces self-hosted
│   ├── llms.txt
│   ├── llms-full.txt
│   ├── robots.txt
│   └── favicon.ico
├── src/
│   ├── content/
│   │   ├── config.ts        # Zod schemas
│   │   ├── pages/           # gioi-thieu, lien-he, diem-ban
│   │   ├── products/        # product detail
│   │   ├── product-categories/
│   │   ├── posts/           # blog/tin tức
│   │   └── policies/        # chinh-sach-*
│   ├── components/
│   │   ├── Header.astro
│   │   ├── Footer.astro
│   │   ├── ProductCard.astro
│   │   ├── CategoryGrid.astro
│   │   ├── MediaLogos.astro     # logo báo chí
│   │   ├── DistributionLogos.astro # logo siêu thị
│   │   ├── SEO.astro            # meta tags + JSON-LD
│   │   └── BreadcrumbJsonLd.astro
│   ├── layouts/
│   │   ├── BaseLayout.astro
│   │   ├── PageLayout.astro
│   │   ├── ProductLayout.astro
│   │   ├── PostLayout.astro
│   │   └── PolicyLayout.astro
│   ├── pages/
│   │   ├── index.astro                          # /
│   │   ├── gioi-thieu/index.astro               # /gioi-thieu/
│   │   ├── tin-tuc/index.astro                  # /tin-tuc/ (list)
│   │   ├── cong-bo/index.astro                  # /cong-bo/
│   │   ├── san-pham/index.astro                 # /san-pham/ (all products)
│   │   ├── san-pham/[slug]/index.astro          # /san-pham/{slug}/
│   │   ├── danh-muc-san-pham/[slug]/index.astro # /danh-muc-san-pham/{slug}/
│   │   ├── diem-ban-rong-vang-hoang-gia/index.astro
│   │   ├── lien-he/index.astro
│   │   ├── chinh-sach-[slug]/index.astro
│   │   ├── ban-tu-cong-bo-rong-vang-hoang-gia/index.astro
│   │   └── [slug]/index.astro                   # blog posts (flat WP style)
│   └── styles/
│       └── global.css        # Tailwind + custom CSS variables
├── astro.config.mjs
├── vercel.json
└── package.json
```

### 4.5 Image migration step (đầu Phase 2)
Sau khi init project, copy toàn bộ images:
```bash
mkdir -p public/images/legacy
cp -r ../workspace/images/legacy/* public/images/legacy/
```
Verify: số file trong `public/images/legacy/` = số file trong `workspace/images/legacy/`.
Astro sẽ tự optimize qua `<Image>` component khi build.

### 4.6 Content Collections schema (`src/content/config.ts`)
```typescript
import { defineCollection, z } from 'astro:content';
const pages = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    oldUrl: z.string().url(),
    ogImage: z.string().optional(),
    updated: z.date().optional(),
  }),
});
const products = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    sku: z.string().optional(),
    category: z.enum(['thuong-hang', 'tet', 'truyen-thong', 'trai-cay', 'bot-dau']),
    weight: z.string().optional(),         // "300g", "500g"
    packaging: z.string().optional(),       // "Hộp tre cao cấp"
    isOcop5Star: z.boolean().default(false),
    isFeatured: z.boolean().default(false),
    images: z.array(z.string()),
    shopeeLink: z.string().url().optional(),
    tiktokLink: z.string().url().optional(),
    oldUrl: z.string().url(),
  }),
});
const productCategories = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    slug: z.string(),
    order: z.number().default(0),
    oldUrl: z.string().url(),
  }),
});
const posts = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishDate: z.date(),
    updated: z.date().optional(),
    author: z.string().default('Rồng Vàng Hoàng Gia'),
    cover: z.string().optional(),
    tags: z.array(z.string()).default([]),
    oldUrl: z.string().url(),
    relatedProducts: z.array(z.string()).default([]), // product slugs
  }),
});
const policies = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    effectiveDate: z.date().optional(),
    oldUrl: z.string().url(),
  }),
});
export const collections = { pages, products, productCategories, posts, policies };
```

### 4.7 Design system
**Color tokens** (Tailwind v4 `@theme` in `global.css`):
```css
@theme {
  /* Brand */
  --color-rvhg-gold: #C8A04D;          /* Rồng vàng */
  --color-rvhg-gold-dark: #8B6F2F;
  --color-rvhg-cream: #FAF5EA;          /* nền bánh đậu xanh */
  --color-rvhg-green: #4A6B3A;          /* matcha/đậu xanh */
  --color-rvhg-red: #8B2E2E;            /* dấu triện, lễ Tết */
  /* Neutral */
  --color-ink: #1A1612;                 /* warm black */
  --color-paper: #FFFFFF;
  --color-mute: #6B6157;
  /* Type */
  --font-display: 'Fraunces', 'Be Vietnam Pro', serif;
  --font-body: 'Be Vietnam Pro', system-ui, sans-serif;
}
```
**Typography scale** (mobile-first, fluid):
- Display: `clamp(2.25rem, 5vw + 1rem, 4rem)` — h1 hero
- Title: `clamp(1.5rem, 2vw + 1rem, 2.25rem)` — h2 section
- Subtitle: `1.25rem` — h3
- Body: `1.0625rem` line-height 1.7 (cho dấu tiếng Việt thoáng)
- Caption: `0.875rem`

**Layout**:
- Container: max-w-7xl (1280px), padding 1.5rem mobile / 2rem desktop
- Section: py-16 md:py-24
- Grid: 12 cột, gap 1.5rem
- Card border-radius: 0.75rem
- Shadow: subtle, không drop-shadow nặng

**Aesthetic**: editorial-modern, giống style npp.sale landing page anh đã làm. Tránh: WordPress generic, parallax overkill, slider nặng. Hero là 1 ảnh + 1 dòng tagline "**Đặc sản nức tiếng Hải Dương**", không carousel.

### 4.8 Layouts spec
**BaseLayout.astro** — shell chung:
- `<html lang="vi" dir="ltr">`
- Preload fonts WOFF2
- View Transitions (`<ViewTransitions />`)
- Header, slot main, Footer
- SEO component (meta + JSON-LD)
- Placeholder cho Google Analytics 4 / Facebook Pixel (env vars trống ở v1, conditional render nếu set)

**PageLayout** — trang nội dung tĩnh (gioi-thieu, lien-he, etc.): hero compact + prose article
**ProductLayout** — product detail: gallery + spec table + CTA Shopee/TikTok + related products + Schema.org Product JSON-LD
**PostLayout** — blog: cover + title + meta (date, author) + prose + related products + Schema.org Article JSON-LD
**PolicyLayout** — legal: minimal, prose, table of contents bên phải

### 4.9 Critical components
**Header.astro**:
- Logo (từ `public/images/legacy/logo-web-120x120.png` hoặc variant lớn hơn nếu có) trái
- Tagline "Đặc sản nức tiếng Hải Dương" subtitle nhỏ dưới logo (desktop only)
- Menu: Trang chủ · Giới thiệu · Sản phẩm · Điểm bán · Tin tức · Công bố · Liên hệ
- Mobile: hamburger drawer
- Sticky on scroll

**Footer.astro**:
- Cột 1: Thông tin công ty (MST, ĐKKD, đại diện, ISO 22000)
- Cột 2: Liên kết nhanh (sitemap)
- Cột 3: Điểm bán (showroom + ecommerce)
- Cột 4: Mạng xã hội + Bộ Công Thương dathongbao
- Bottom: copyright + Schema.org Organization JSON-LD

**ProductCard.astro**:
- Image (Astro `<Image>` lazy, 4:3 ratio)
- Tên sản phẩm
- Badge "OCOP 5 sao" nếu `isOcop5Star`
- Hover: lift + shadow subtle

### 4.10 Content migration rules
Khi Markdown từ Phase 1 → Astro Content Collection:
- Image paths: `/wp-content/uploads/2024/10/x.jpg` → `/images/legacy/x.jpg`
- Internal links: WordPress permalinks → đổi sang Astro routes (giữ slug)
- Strip: `[caption]` shortcodes, `[gallery]` shortcodes, Elementor JSON garbage
- Preserve: heading levels (h2, h3), bold/italic, blockquote, lists

### 4.11 Acceptance gate Phase 2
- [ ] `pnpm dev` chạy được, không error console
- [ ] Mọi route trong `urls.csv` có file `.astro` tương ứng, trả 200
- [ ] Build `pnpm build` thành công, output `dist/` đầy đủ
- [ ] Spot-check 5 trang: homepage, /gioi-thieu/, 1 product, 1 category, 1 blog post — render đúng, ảnh không vỡ
- [ ] **Tất cả ảnh load từ `/images/legacy/`, không có request nào về `wp-content`**
- [ ] Responsive mobile 375px, tablet 768px, desktop 1280px — không overflow, không vỡ layout
- [ ] Vietnamese typography: dấu hiển thị đẹp, không bị chèn ép

**STOP. Trình anh URL preview Vercel → "APPROVED Phase 2" → sang Phase 3.**

---

## 5. PHASE 3 — SEO + AI OPTIMIZATION

### 5.1 Schema.org JSON-LD
**Organization** (mọi page):
```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Công ty Cổ phần Hoàng Giang",
  "alternateName": "Rồng Vàng Hoàng Gia",
  "slogan": "Đặc sản nức tiếng Hải Dương",
  "url": "https://www.rongvanghoanggia.com",
  "logo": "https://www.rongvanghoanggia.com/images/legacy/logo-web-120x120.png",
  "foundingDate": "1997",
  "taxID": "0800280839",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Đường An Lưu, Cụm Công nghiệp Cẩm Thượng",
    "addressLocality": "phường Thành Đông",
    "addressRegion": "Thành phố Hải Phòng",
    "addressCountry": "VN"
  },
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+84-934-362-658",
    "email": "info@rongvanghoanggia.com",
    "contactType": "customer service",
    "availableLanguage": ["vi", "en"]
  },
  "sameAs": [
    "https://www.facebook.com/rongvanghoanggiapage"
  ],
  "award": [
    "OCOP 5 sao Quốc gia 2024 - sản phẩm bánh đậu xanh duy nhất",
    "ISO 22000:2018 - HA 394/2.23.CIV"
  ]
}
```
**Product** (mỗi product detail):
```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "...",
  "image": [...],
  "description": "...",
  "brand": { "@type": "Brand", "name": "Rồng Vàng Hoàng Gia", "slogan": "Đặc sản nức tiếng Hải Dương" },
  "manufacturer": { "@type": "Organization", "name": "Công ty Cổ phần Hoàng Giang" },
  "category": "Bánh đậu xanh",
  "award": "OCOP 5 sao Quốc gia 2024"
}
```
**Article** (mỗi blog post): standard `Article` schema.
**BreadcrumbList**: mọi trang sâu hơn level 1.
**FAQPage**: trên homepage hoặc /gioi-thieu/ — Q&A về OCOP 5 sao, ISO, nguồn gốc, hạn sử dụng, etc.

### 5.2 `llms.txt` (root of site)
```
# Rồng Vàng Hoàng Gia (RVHG) — Đặc sản nức tiếng Hải Dương
> Bánh đậu xanh và bột đậu xanh truyền thống Hải Dương. Sản phẩm bánh đậu xanh DUY NHẤT đạt OCOP 5 sao Quốc gia 2024. Sản xuất bởi Công ty Cổ phần Hoàng Giang từ 1997. Chứng nhận ISO 22000:2018.
## Về chúng tôi
- [Giới thiệu công ty](https://www.rongvanghoanggia.com/gioi-thieu/): Lịch sử 28 năm, sáng lập bởi 3 anh em, OCOP 5 sao, ISO 22000:2018
- [Câu chuyện thương hiệu](https://www.rongvanghoanggia.com/cau-chuyen-san-pham-rong-vang-hoang-gia-2/): Khải Định 1918 ban sắc phong "Bánh Ngon"
- [Điểm bán](https://www.rongvanghoanggia.com/diem-ban-rong-vang-hoang-gia/): BigC, WinMart, AEON, Lotte, Coopmart, MegaMarket, Lan Chi
## Sản phẩm
- [Tất cả sản phẩm](https://www.rongvanghoanggia.com/san-pham/)
- [Bánh đậu xanh thượng hạng](https://www.rongvanghoanggia.com/danh-muc-san-pham/banh-dau-xanh-thuong-hang/)
- [Bánh đậu xanh Tết - quà biếu](https://www.rongvanghoanggia.com/danh-muc-san-pham/banh-dau-xanh-tet/)
- [Bánh đậu xanh truyền thống](https://www.rongvanghoanggia.com/danh-muc-san-pham/banh-dau-xanh-truyen-thong/)
- [Bánh đậu xanh hương vị trái cây](https://www.rongvanghoanggia.com/danh-muc-san-pham/banh-dau-xanh-trai-cay-truyen-thong/)
- [Bột đậu xanh & Chè đậu đen](https://www.rongvanghoanggia.com/danh-muc-san-pham/bot-dau/)
## Chứng nhận
- OCOP 5 sao Quốc gia 2024 (đầu tiên và duy nhất cho bánh đậu xanh)
- ISO 22000:2018 (Quacert, 08/08/2023)
- Xuất khẩu Nhật, Mỹ, Anh, Hàn, Canada
## Liên hệ
- Hotline: 0934362658
- Email: info@rongvanghoanggia.com
- Showroom: 209C Tuệ Tĩnh và 9 Bạch Đằng, TP Hải Dương
- Nhà máy: Đường An Lưu, Cụm CN Cẩm Thượng, phường Thành Đông, TP Hải Phòng
```

### 5.3 `llms-full.txt`
Full content của site dạng markdown concatenated, có TOC ở đầu, để AI crawl 1 request có toàn bộ knowledge base. Tự động generate từ Content Collections trong build step.

### 5.4 SEO essentials
**Per-page meta** (qua `SEO.astro` component):
- `<title>` từ frontmatter, ≤ 60 chars
- `<meta name="description">` ≤ 160 chars
- `<link rel="canonical">` về URL chính thức
- Open Graph: og:title, og:description, og:image (1200x630), og:type, og:url, og:locale=vi_VN
- Twitter Card: summary_large_image
- `<meta name="robots" content="index,follow,max-image-preview:large">`

**sitemap.xml**: auto qua `@astrojs/sitemap`, exclude policies nếu cần.

**robots.txt**:
```
User-agent: *
Allow: /
Sitemap: https://www.rongvanghoanggia.com/sitemap-index.xml
```

**Performance**:
- Font: WOFF2, `font-display: swap`, subset Vietnamese (U+0100–U+1EFF + Latin basic)
- Images: Astro `<Image>` với `widths={[400, 800, 1200]}`, format AVIF + WebP fallback
- CSS: Tailwind v4 JIT, ≤ 30KB gzip
- JS: zero ở homepage, hydrate islands chỉ khi cần (mobile menu, gallery)
- Critical CSS inlined, rest deferred

### 5.5 Acceptance gate Phase 3
- [ ] Lighthouse mobile homepage: Perf ≥ 95, A11y = 100, BP = 100, SEO = 100
- [ ] Lighthouse desktop homepage: tất cả 100
- [ ] Validate JSON-LD trên schema.org validator: 0 error
- [ ] `llms.txt` accessible tại root, format đúng spec
- [ ] `sitemap-index.xml` accessible, có toàn bộ URL
- [ ] Random 5 page có meta đúng (test bằng curl + grep)
- [ ] Test OG preview qua Facebook Sharing Debugger + opengraph.xyz

**STOP. Trình anh Lighthouse report + 3 schema validator screenshots → "APPROVED Phase 3" → sang Phase 4.**

---

## 6. PHASE 4 — AI CONTENT WORKFLOW

### 6.1 Tạo Claude Skill `rvhg-content`
Skill này cài vào `~/.claude/skills/rvhg-content/` để anh dùng từ Claude Code.

**Folder**:
```
rvhg-content/
├── SKILL.md                # router với description trigger
├── BRAND_VOICE.md          # voice document
├── references/
│   ├── product-catalog.md  # 4 SKU bột + categories bánh
│   ├── brand-story.md      # Khải Định 1918, founders
│   ├── seo-checklist.md    # frontmatter, meta, internal linking
│   └── templates/
│       ├── blog-post.md
│       ├── product-description.md
│       ├── press-release.md
│       └── tet-campaign.md
```

### 6.2 `SKILL.md` (Front matter spec)
```yaml
---
name: rvhg-content
description — Use when writing or updating content for rongvanghoanggia.com — blog posts (.md in src/content/posts/), product descriptions, press releases, Tết campaigns, or any content for Rồng Vàng Hoàng Gia website. Triggers — "viết bài RVHG", "blog post Rồng Vàng", "mô tả sản phẩm bánh đậu xanh", "press release RVHG", "câu chuyện Khải Định", "Tết campaign", "OCOP 5 sao content". Always loads brand voice and Khải Định 1918 anchor.
---
```
(Lưu ý: dùng em-dash `—` thay colon trong YAML description, theo lesson learned từ Vibecode skill migration.)

### 6.3 `BRAND_VOICE.md` — nội dung cốt lõi
- **Tagline chính thức**: "**Đặc sản nức tiếng Hải Dương**" — luôn xuất hiện ít nhất 1 lần trong long-form content (blog, press release).
- **Tone**: trang trọng nhưng ấm áp, có chiều sâu lịch sử, không sến súa. Tránh từ marketing kiểu "tuyệt vời", "vô cùng", "xuất sắc" lạm dụng.
- **POV**: ngôi thứ nhất số nhiều "Chúng tôi" cho voice công ty; "Rồng Vàng Hoàng Gia" cho voice thương hiệu third-person.
- **Vocabulary giữ**: "tinh hoa Xứ Đông", "công thức bí truyền", "nghệ nhân", "sắc phong", "tâm huyết", "truyền thống gia truyền", "đặc sản nức tiếng".
- **Vocabulary tránh**: "premium" (dùng "thượng hạng"), "luxury" (dùng "sang trọng" hoặc "cao cấp"), từ Anh hóa không cần thiết.
- **Mọi long-form content phải reference**: ít nhất 1 trong 3 anchors (Khải Định 1918 / OCOP 5 sao 2024 / ISO 22000:2018).

### 6.4 Content templates
Mỗi template là 1 file `.md` với:
- Frontmatter schema match Astro Content Collection
- Placeholder sections rõ ràng
- SEO checklist inline (comment HTML)
- Internal linking suggestions

Ví dụ `templates/blog-post.md`:
```markdown
---
title: "{{ TITLE — 55-60 chars, có keyword chính }}"
description: "{{ 150-160 chars, có CTA ngầm }}"
publishDate: {{ YYYY-MM-DD }}
author: "Rồng Vàng Hoàng Gia"
cover: "/images/posts/{{ slug }}/cover.jpg"
tags: [{{ 3-5 tags }}]
oldUrl: ""
relatedProducts: [{{ product slugs }}]
---
<!-- LEDE: 2-3 câu, hook đọc giả + chứa keyword chính, ≤ 50 từ -->
{{ LEDE }}
## {{ H2 chính - chứa keyword phụ }}
{{ ... }}
## {{ H2 thứ 2 }}
{{ ... }}
<!-- ANCHOR REQUIRED: chèn 1 trong 3 anchors -->
> {{ Khải Định 1918 / OCOP 5 sao / ISO 22000 }}
## Sản phẩm liên quan
{{ link 2-3 sản phẩm related }}
<!-- CLOSING: 2-3 câu mời gọi action, kết thúc bằng tagline hoặc reference tagline -->
{{ ... Đặc sản nức tiếng Hải Dương ... }}
```

### 6.5 Workflow điển hình
1. Anh prompt Claude Code: *"Viết blog post về việc bánh đậu trà xanh đạt OCOP 5 sao, target keyword 'bánh đậu trà xanh OCOP'"*
2. Claude tự đọc `rvhg-content` skill → load BRAND_VOICE + brand-story + blog template
3. Claude tạo `src/content/posts/banh-dau-tra-xanh-ocop-5-sao.md`
4. Anh review, edit nếu cần
5. `git commit && git push` → Vercel auto deploy
6. Site live trong ~60s

### 6.6 Acceptance gate Phase 4
- [ ] Skill cài được bằng `claude skill install ./rvhg-content.skill`
- [ ] Anh prompt 3 test cases khác nhau → output match BRAND_VOICE, có anchor, có tagline, frontmatter chuẩn schema
- [ ] Build site sau khi có content mới → không Zod validation error

---

## 7. PHASE 5 — DEPLOYMENT (VERCEL)

### 7.1 Setup
1. Push repo lên GitHub private (`rvhg-site`)
2. **Vercel**: New Project → Import từ GitHub → chọn `rvhg-site`
3. Framework Preset: Astro (auto-detect)
4. Build settings (Vercel auto-config nhưng confirm):
   - Build command: `pnpm build`
   - Output directory: `dist`
   - Install command: `pnpm install`
   - Node version: 22.x (set trong Project Settings → General)
5. Environment variables (Project Settings → Environment Variables):
   - `PUBLIC_SITE_URL=https://www.rongvanghoanggia.com`
   - `PUBLIC_GA_ID=` (để trống, sẽ điền khi có)
   - `PUBLIC_FB_PIXEL=` (để trống)
6. Custom domain (Project Settings → Domains):
   - Add `www.rongvanghoanggia.com` (primary)
   - Add `rongvanghoanggia.com` → redirect to www
7. DNS records (tại nhà cung cấp domain):
   - `www` CNAME → `cname.vercel-dns.com`
   - `@` A → Vercel anycast IPs (Vercel sẽ hiển thị khi add domain)
8. Đợi SSL provision (Vercel tự động Let's Encrypt, 2-10 phút)
9. Test HTTPS trên cả 2 domain

### 7.2 Cutover plan
**Pre-cutover** (1 ngày trước):
- Backup WordPress full (DB + wp-content) — rollback plan
- Export Google Search Console verification token
- Test toàn bộ URL trên preview Vercel lần cuối (`*.vercel.app`)
- Snapshot Lighthouse scores hiện tại của WP để baseline

**Cutover** (ban đêm, low traffic):
1. Đổi DNS từ hosting WordPress → Vercel
2. Đợi 5–30 phút propagation (kiểm tra `dig www.rongvanghoanggia.com` từ nhiều location)
3. Smoke test 10 URL quan trọng nhất
4. Submit sitemap mới qua Google Search Console
5. Request reindex 5 trang đầu trên GSC
6. Submit qua Bing Webmaster Tools (5% traffic VN dùng Bing/CocCoc)

**Post-cutover** (1 tuần sau):
- Monitor GSC Coverage report — phải không có 404 spike
- Monitor Vercel Analytics (free tier) — traffic ổn định, không giảm > 20%
- Monitor Core Web Vitals → cải thiện so với WP baseline

### 7.3 Acceptance gate Phase 5
- [ ] DNS đã trỏ Vercel
- [ ] HTTPS active, SSL valid trên cả `www` và apex
- [ ] 10 URL quan trọng trả 200 trên production
- [ ] GSC không báo crawl error sau 48h
- [ ] Traffic Vercel Analytics ≥ 80% baseline WP sau 7 ngày

---

## 8. ACCEPTANCE GATES TỔNG HỢP

| Gate | Phase | Đầu vào để approve |
|---|---|---|
| G1 | 1 → 2 | urls.csv + 3 sample .md + image count |
| G2 | 2 → 3 | Vercel preview URL |
| G3 | 3 → 4 | Lighthouse report + schema validator |
| G4 | 4 → 5 | 3 test outputs từ skill |
| G5 | Go-live | Smoke test report |

---

## 9. NON-GOALS (DO NOT DO)
- Không build e-commerce checkout (mua hàng → redirect Shopee/TikTok)
- Không thêm tính năng login/user account
- Không thêm tính năng comment trên blog
- Không AI-generate ảnh sản phẩm hoặc nhà máy
- Không multilingual ở v1
- Không thay đổi logo, packaging design
- Không thêm Pages CMS / Decap CMS / TinaCMS — anh edit markdown trực tiếp
- Không dùng React/Vue/Svelte trừ khi 1 component thật sự cần interactivity (gallery, mobile menu, contact form)
- **Không hot-link image từ wp-content** — toàn bộ phải mirror về `public/images/legacy/`

---

## 10. APPENDIX

### A. URL inventory expected (từ recon homepage)
Đã confirm tồn tại trên rongvanghoanggia.com:
- `/` (home)
- `/gioi-thieu/`
- `/tin-tuc/`
- `/cong-bo/`
- `/san-pham/`
- `/diem-ban-rong-vang-hoang-gia/`
- `/lien-he/`
- `/danh-muc-san-pham/banh-dau-xanh-thuong-hang/`
- `/danh-muc-san-pham/banh-dau-xanh-tet/`
- `/danh-muc-san-pham/banh-dau-xanh-truyen-thong/`
- `/danh-muc-san-pham/banh-dau-xanh-trai-cay-truyen-thong/`
- `/danh-muc-san-pham/bot-dau/`
- `/san-pham/hop-qua-banh-dau-xanh-ocop-5-sao-quoc-gia/`
- `/san-pham/hop-qua-thuong-hang-tre-cao-cap/`
- `/san-pham/banh-dau-xanh-banh-chung-vang/`
- `/banh-dau-tra-xanh-banh-dau-sau-rieng-rong-vang-hoang-gia-dat-ocop-5-sao-quoc-gia/`
- `/banh-dau-tra-xanh-mot-khuc-bien-tau-cua-huong-sac-va-tram-tu/`
- `/cau-chuyen-san-pham-banh-dau-sau-rieng-bang-hinh-anh/`
- `/cau-chuyen-san-pham-banh-dau-tra-xanh-bang-hinh-anh/`
- `/banh-dau-tra-xanh-cau-chuyen-san-pham/`
- `/cau-chuyen-san-pham-rong-vang-hoang-gia-2/`
- `/chinh-sach-va-quy-dinh-chung/`
- `/chinh-sach-bao-hanh-doi-tra/`
- `/chinh-sach-van-chuyen/`
- `/chinh-sach-bao-mat/`
- `/ban-tu-cong-bo-rong-vang-hoang-gia/`

Phase 1 wget mirror sẽ discover thêm. Expected total: 30–60 URL.

### B. Environment variables cần set (Vercel Project Settings)
```
PUBLIC_SITE_URL=https://www.rongvanghoanggia.com
PUBLIC_GA_ID=               # chưa có, để trống ở v1
PUBLIC_FB_PIXEL=            # chưa có, để trống ở v1
```
Note: Astro env vars có prefix `PUBLIC_` để expose ra client. Đặt trên cả 3 environment Production / Preview / Development trong Vercel.

### C. Fonts
- **Be Vietnam Pro**: regular 400, medium 500, semibold 600, bold 700. Subset: latin + vietnamese.
- **Fraunces** (display): regular 400, semibold 600. Subset: latin + vietnamese.
- Download từ Google Fonts qua `google-webfonts-helper` (gwfh.mranftl.com) → convert WOFF2 → self-host ở `public/fonts/`.

### D. Brand assets — STRATEGY: download trực tiếp từ site gốc
Theo yêu cầu của Owner, KHÔNG thiết kế mới logo/favicon mà mirror lại từ wp-content. Phase 1 đã download (T1.4, T1.5). Phase 2 sử dụng:

**Logo**:
- Primary: `public/images/legacy/logo-web-120x120.png` (header)
- Larger variant nếu có: `cropped-logo-web-270x270.png` (footer, social share fallback)
- Nếu chất lượng PNG không đủ cho retina, Claude Code dùng sharp upscale × 2 trước khi commit (không AI-redraw, chỉ resize lossless)

**Favicon**:
- Nếu site gốc có `favicon.ico` → copy thẳng vào `public/favicon.ico`
- Nếu không → generate từ logo-web bằng `sharp` (đa size: 16x16, 32x32, apple-touch 180x180)

**OG image template** (1200x630):
- v1: tạo 1 OG image duy nhất dùng chung — composite của logo + tagline "Đặc sản nức tiếng Hải Dương" trên nền `--color-rvhg-cream` với accent `--color-rvhg-gold`
- Tool: dùng `sharp` Node script trong Phase 3 để generate, không cần Figma/Photoshop
- Output: `public/og-default.png`
- v2 future: per-page OG (mỗi product 1 OG riêng)

**Product hero images**:
- Tất cả từ `public/images/legacy/` đã download
- 4:3 aspect ratio chuẩn cho ProductCard
- Astro `<Image>` tự generate WebP/AVIF responsive

### E. Lessons learned cần áp dụng
- **CSS prefix**: nếu có nhúng custom CSS class, prefix `rvhg-` tránh conflict với Tailwind utilities (kinh nghiệm từ ERPNext/Bootstrap conflict).
- **Vietnamese typography**: line-height 1.7 tối thiểu cho body, dấu không bị chèn.
- **Scroll-to-section**: dùng `scroll-padding-top` trên `html` + `body`, không hijack click anchor bằng JS (kinh nghiệm từ npp.sale landing).
- **YAML colon**: trong description của skill, dùng em-dash `—` thay `:` để tránh parse error (kinh nghiệm từ Vibecode → Skills migration).
- **Vercel trailingSlash**: phải set `"trailingSlash": true` trong `vercel.json` để đồng bộ với Astro `trailingSlash: 'always'` — nếu không sẽ bị 308 redirect loop hoặc 404 trên production.

---

**END OF BLUEPRINT v2**

---

> **Ghi chú thực thi (cập nhật bởi session rebuild đầu tiên)**: Phase 2/3/4 đã thực hiện trong môi trường Claude Code on the web — môi trường này **không truy cập được** `rongvanghoanggia.com` (host bị deny-list, trả `403 host_not_allowed`), nên Phase 1 (mirror site gốc + tải ảnh thật) **chưa chạy được** và phải làm lại ở Claude Code local. Xem `docs/STATUS.md`, `workspace/README.md`, `public/images/legacy/README.md`. Một số chi tiết triển khai khác blueprint một chút cho hợp Astro 5: dùng `src/content.config.ts` + `glob()` loader thay `src/content/config.ts` + `type: 'content'`; `category` enum dùng tên đầy đủ (`banh-dau-xanh-thuong-hang`…) thay tên ngắn; routing `[slug]/index.astro` gộp posts + policies + page câu-chuyện; fonts tải trực tiếp từ Google Fonts vì `gwfh.mranftl.com` cũng bị chặn.
