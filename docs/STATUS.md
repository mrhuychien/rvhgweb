# STATUS — RVHG website rebuild

Cập nhật: sau session Phase-1 chạy ở local.
Branch làm việc: `claude/rebuild-rvhg-astro-TvUGA`.

---

## TL;DR cho session kế tiếp

Đọc theo thứ tự: `README.md` → `docs/BLUEPRINT.md` → file này → `workspace/README.md` → `public/images/legacy/README.md`.

- **Phase 1 (clone + ảnh thật + ingest content): XONG** — wget mirror 122 trang HTML + 568 ảnh; placeholder trong `public/images/legacy/` đã thay bằng ảnh WP thật; ingest thêm 19 post mới từ bản mirror vào `src/content/posts/`. `pnpm build` ra 52 trang. Không còn request nào về `wp-content`.
- **Phase 2 (Astro rebuild), Phase 3 (SEO + AI), Phase 4 (skill `rvhg-content`): XONG.**
- **Phase 5 (deploy Vercel): preview đã LIVE** — `https://rvhgweb.vercel.app` (production target trên Vercel project `rvhgweb` / team `mrhuychiens-projects`, deployment `dpl_4QorN3UZYpMcyF5QuZzkpaahdVZ7`). Env var `PUBLIC_SITE_URL` đã set. **Còn lại**: custom domain `www.rongvanghoanggia.com` + apex redirect + DNS cutover; GA4 + FB Pixel khi có.

---

## ✅ Đã làm

### Cấu trúc & cấu hình
- `package.json` (pnpm, Node ≥22, deps: astro 5, @astrojs/sitemap, @astrojs/mdx, tailwindcss 4, @tailwindcss/vite, sharp), `pnpm-lock.yaml`.
- `astro.config.mjs`: `site`, `trailingSlash: 'always'`, `build.format: 'directory'`, integrations sitemap (filter loại trừ `/chinh-sach-`, `/ban-tu-cong-bo-`, `/cong-bo/`) + mdx, tailwind vite plugin, sharp image service.
- `vercel.json`: `trailingSlash: true`, cache headers cho ảnh/`_astro`, security headers.
- `tsconfig.json` (extends astro strict, alias `@/*`), `.nvmrc`/`.node-version` = 22, `.gitignore`, `.npmrc` (`verify-deps-before-run=false` — workaround cho pnpm-via-corepack ở môi trường build, vô hại trên CI).

### Content layer
- `src/content.config.ts` — collections + Zod: `pages`, `products`, `productCategories`, `posts`, `policies` (dùng `glob()` loader = Content Layer API).
- `src/data/site.ts` — single source of truth: SITE, COMPANY, ASSETS, NAV, MEDIA_MENTIONS, ANCHORS.
- `src/data/jsonld.ts` — builders: organizationSchema, websiteSchema, breadcrumbSchema, productSchema, articleSchema, faqSchema.

### Nội dung (viết từ blueprint, **chưa đối chiếu bản WP gốc**)
- `src/content/pages/`: `gioi-thieu.md`, `lien-he.md`, `diem-ban.md`, `cau-chuyen-thuong-hieu.md` (route `/cau-chuyen-san-pham-rong-vang-hoang-gia-2/`).
- `src/content/product-categories/`: 5 file (thuong-hang, tet, truyen-thong, trai-cay-truyen-thong, bot-dau).
- `src/content/products/`: 9 file (hop-qua-banh-dau-xanh-ocop-5-sao-quoc-gia, hop-qua-thuong-hang-tre-cao-cap, banh-dau-xanh-banh-chung-vang, banh-dau-xanh-thuong-hang-300g, banh-dau-tra-xanh, banh-dau-sau-rieng, banh-dau-xanh-truyen-thong, bot-dau-xanh-dinh-duong, che-dau-den-cot-dua).
- `src/content/posts/`: 5 file (4 URL câu chuyện + 1 tin OCOP), khớp slug trong Appendix A.
- `src/content/policies/`: 5 file (chinh-sach-va-quy-dinh-chung, chinh-sach-bao-hanh-doi-tra, chinh-sach-van-chuyen, chinh-sach-bao-mat, ban-tu-cong-bo-rong-vang-hoang-gia).

### Layouts & components
- Layouts: `BaseLayout` (shell, ClientRouter/View Transitions, SEO, JSON-LD Organization+WebSite, conditional GA4/FB Pixel), `PageLayout`, `ProductLayout`, `PostLayout`, `PolicyLayout`.
- Components: `Header` (sticky, mobile drawer, JS thuần), `Footer`, `SEO`, `ProductCard`, `CategoryGrid`, `MediaLogos`, `DistributionLogos`, `Breadcrumbs` (+BreadcrumbList JSON-LD), `Logo` (SVG inline fallback), `LegacyImg`, `JsonLd`.

### Routes (giữ URL cũ 1:1)
- `/` (`src/pages/index.astro`): hero + tagline, trust bar, CategoryGrid, featured products, story section, DistributionLogos, MediaLogos, FAQ (`<details>` + FAQPage JSON-LD), CTA.
- `/gioi-thieu/`, `/lien-he/`, `/diem-ban-rong-vang-hoang-gia/` — dedicated `.astro`, render từ collection `pages`.
- `/san-pham/` (index theo danh mục) + `/san-pham/[slug]/` (`ProductLayout`, getStaticPaths từ products).
- `/danh-muc-san-pham/[slug]/` (getStaticPaths từ productCategories).
- `/tin-tuc/` (list posts) + `/[slug]/` (catch-all: posts dạng phẳng + policies + page câu-chuyện, chọn layout theo `kind`).
- `/cong-bo/` (hub chứng nhận + chính sách, `noindex`).
- `/404`.

### SEO + AI
- JSON-LD: Organization, WebSite, Product, Article, BreadcrumbList, FAQPage.
- Per-page meta + OG + Twitter + canonical + robots (policies & `/cong-bo/` để `noindex`).
- `public/robots.txt`, `public/llms.txt` (đúng spec blueprint), `src/pages/llms-full.txt.ts` (sinh tự động toàn bộ content từ collections), sitemap auto.
- `public/og-default.png` (1200×630, sharp), favicon.svg + 16/32/apple-touch png.
- Fonts self-hosted trong `public/fonts/` (Be Vietnam Pro 400/500/600/700 + Fraunces variable, subset Latin+Vietnamese, WOFF2), `@font-face` inline trong `src/styles/global.css`, preload 3 file chính trong `<head>`.

### Phase 4 — skill
- `skills/rvhg-content/`: `SKILL.md` (frontmatter dùng em-dash), `BRAND_VOICE.md`, `references/{product-catalog,brand-story,seo-checklist}.md`, `references/templates/{blog-post,product-description,press-release,tet-campaign}.md`. Cài bằng `cp -r skills/rvhg-content ~/.claude/skills/rvhg-content`.

### Phase 1 — artifacts (XONG ở session local 13/05/2026)
- `workspace/clone/` — mirror đầy đủ rongvanghoanggia.com (122 HTML, 125 MB).
- `workspace/images/legacy/` — 568 ảnh từ WP (mirror + parse bổ sung).
- `workspace/content-raw/` — 121 markdown extract qua turndown + cheerio.
- `workspace/inventory/urls.csv` — 110 row (47 built + 63 discovered).
- `workspace/inventory/images.csv` — 569 row.
- `workspace/inventory/legacy-refs.json`, `image-usage.json`, `image-download.json`, `swap-audit.json`, `post-ingest.json` — audit trail.
- `workspace/scripts/` — `extract-image-urls.mjs`, `download-images.mjs`, `extract-content.mjs`, `legacy-refs.mjs`, `swap-placeholders.mjs`, `ingest-posts.mjs`, `copy-referenced-images.mjs`, `cleanup-ingested-posts.mjs`, `build-inventory.mjs`. Mỗi script self-contained, có thể chạy lại nếu cần re-mirror.
- `public/images/legacy/` — 23 placeholder gốc đã thay bằng ảnh WP thật (rename file gốc theo tên placeholder, không sửa reference); thêm 23 ảnh WP-named cho các post mới ingest. Tổng 47 file.
- `src/content/posts/` — 19 post mới ingest từ bản mirror, gắn frontmatter chuẩn schema (title + description + publishDate 2024-10-01 fallback + oldUrl + author + tags []), đã rà soát WP cruft.

### Kiểm thử đã làm
- `pnpm build` → 52 trang (was 33), không lỗi Zod.
- Spot-check 5 trang (home, /gioi-thieu/, /san-pham/banh-dau-tra-xanh/, /danh-muc-san-pham/banh-dau-xanh-thuong-hang/, post `banh-dau-tra-xanh-mot-khuc-bien-tau-cua-huong-sac-va-tram-tu`): tất cả `<img src>` đều dùng `/images/legacy/...`, không còn request về `wp-content` (`grep -rn wp-content dist/` chỉ trả về `dist/images/legacy/README.md`, cố ý).
- Mọi reference `/images/legacy/*.{jpg,png,jpeg}` trong `dist/` đã có file tương ứng (47/47 hit).

---

## ❌ Chưa làm — TODO (ưu tiên từ trên xuống)

### 1. Phase 5 — deploy Vercel + domain (cần owner)
- [ ] Import repo lên Vercel, set Node 22, env vars (`PUBLIC_SITE_URL`, `PUBLIC_GA_ID=`, `PUBLIC_FB_PIXEL=`).
- [ ] Add domain `www.rongvanghoanggia.com` + redirect apex → www; cấu hình DNS.
- [ ] Cutover plan (backup WP, đổi DNS, smoke test 10 URL, submit sitemap GSC + Bing).
- [ ] Acceptance gate Phase 5.

### 2. Kiểm thử/đánh giá còn lại (cần URL deploy hoặc Chrome)
- [ ] Lighthouse mobile/desktop homepage + 3 trang đại diện (mục tiêu 100/100/100/100).
- [ ] Validate JSON-LD trên schema.org validator (0 error).
- [ ] Test OG preview qua Facebook Sharing Debugger / opengraph.xyz.
- [ ] Responsive check thủ công 375 / 768 / 1280.

### 3. Polish ảnh + content (optional)
- [ ] Một số ảnh post mới ingest có content là PNG nặng (1.7–3 MB) lưu dưới ext `.jpg`. Cân nhắc dùng `sharp` re-encode JPEG trước khi cutover, hoặc chuyển sang `src/assets/images/legacy/` + Astro `<Image />` để có AVIF/WebP + responsive srcset.
- [ ] PublishDate của 19 post mới đều fallback `2024-10-01` (WP không expose `article:published_time` meta). Nếu owner có ngày thật → cập nhật từng file `src/content/posts/*.md`.
- [ ] Đối chiếu lại nội dung 5 post viết-từ-blueprint với bản WP gốc trong `workspace/content-raw/post/` nếu muốn dùng đúng tone của tác giả gốc.
- [ ] Thêm `description` + `relatedProducts` thủ công cho các post mới (hiện chỉ có description tự sinh từ paragraph đầu).

### 4. Linh tinh
- [ ] GA4 / Facebook Pixel: điền `PUBLIC_GA_ID` / `PUBLIC_FB_PIXEL` khi có (đã có conditional render trong `BaseLayout.astro`).
- [ ] Cân nhắc per-page OG image (v2).
- [ ] Cài skill `rvhg-content` vào `~/.claude/skills/`.
- [ ] (Tùy) mở Pull Request cho branch `claude/rebuild-rvhg-astro-TvUGA`.

---

## Khác blueprint một chút (cho hợp Astro 5)
- `src/content.config.ts` + `glob()` loader thay `src/content/config.ts` + `type: 'content'`.
- `category` enum dùng tên đầy đủ (`banh-dau-xanh-thuong-hang`, `banh-dau-xanh-tet`, `banh-dau-xanh-truyen-thong`, `banh-dau-xanh-trai-cay-truyen-thong`, `bot-dau`) thay tên ngắn — khớp slug danh mục, đỡ phải map.
- Routing: 1 catch-all `src/pages/[slug]/index.astro` gộp posts (phẳng) + policies + page câu-chuyện, chọn layout theo discriminant `kind` — thay vì 2 file `chinh-sach-[slug]` và `[slug]` riêng (Astro không cho 2 dynamic route cùng cấp).
- Fonts: tải trực tiếp từ Google Fonts CDN một lần (vì `gwfh.mranftl.com` cũng bị deny-list), rồi self-host. Kết quả tương đương yêu cầu blueprint.
- `oldUrl` trong Zod schema để `z.string()` (không `.url()`) cho linh hoạt.
