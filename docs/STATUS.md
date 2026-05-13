# STATUS — RVHG website rebuild

Cập nhật: sau session rebuild đầu tiên (Claude Code on the web).
Branch làm việc: `claude/rebuild-rvhg-astro-TvUGA`.

---

## TL;DR cho session local kế tiếp

Đọc theo thứ tự: `README.md` → `docs/BLUEPRINT.md` → file này → `workspace/README.md` → `public/images/legacy/README.md`.

- **Phase 2 (Astro rebuild), Phase 3 (SEO + AI), Phase 4 (skill `rvhg-content`): XONG** — `pnpm build` chạy OK, 33 trang, dev server phục vụ home/product/post/llms-full/404 đúng.
- **Phase 1 (mirror site gốc + tải ảnh thật): CHƯA** — môi trường web bị chặn network tới `rongvanghoanggia.com`. **Đây là việc đầu tiên cần làm ở local.**
- **Phase 5 (deploy Vercel + DNS + cutover): CHƯA** — cần owner thao tác trên tài khoản Vercel/DNS; Claude chỉ hỗ trợ chuẩn bị (đã có `vercel.json`).

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

### Phase 1 — artifacts (một phần)
- `workspace/inventory/urls.csv` (33 URL từ Appendix A: old→new + content_type + status).
- `workspace/README.md` (ghi rõ trạng thái + lệnh wget cần chạy ở local).

### Kiểm thử đã làm
- `astro build` → 33 trang, không lỗi.
- Dev server → home / product / flat post / `/llms-full.txt` trả 200; path không tồn tại trả 404.
- Không còn request nào về `wp-content` (chỉ có chuỗi `wp-content` trong file README — cố ý).

---

## ❌ Chưa làm — TODO (ưu tiên từ trên xuống)

### 1. Phase 1 — mirror site gốc & tải ảnh thật  ← LÀM Ở LOCAL TRƯỚC TIÊN
Môi trường web không truy cập được `rongvanghoanggia.com` (`403 host_not_allowed`). Ở local làm:
- [ ] `wget --mirror …` site gốc → `workspace/clone/` (lệnh đầy đủ trong `workspace/README.md` / blueprint T1.1).
- [ ] `wget --recursive` toàn bộ ảnh từ `wp-content/uploads/` (blueprint T1.4 nhánh A).
- [ ] Parse `<img src>` / `<source srcset>` / CSS `background-image` từ HTML đã mirror (cheerio), diff & tải bổ sung (nhánh B). Đặc biệt kiểm các file ở blueprint T1.5 (logo, favicon, ảnh sản phẩm, logo siêu thị, logo báo chí).
- [ ] **Thay placeholder trong `public/images/legacy/` bằng ảnh thật — GIỮ NGUYÊN tên file** (content + `src/data/site.ts` ASSETS đang tham chiếu theo tên đó; xem `public/images/legacy/README.md` để biết danh sách tên file đang dùng).
- [ ] Tạo `workspace/inventory/images.csv`.
- [ ] (Optional, theo blueprint) chuyển ảnh thật sang `src/assets/images/legacy/` và đổi `LegacyImg.astro` sang Astro `<Image />` (ESM import) để có AVIF/WebP + responsive srcset tự động.
- [ ] Extract HTML→Markdown từ bản mirror (turndown + cheerio) → `workspace/content-raw/` → **đối chiếu & bổ sung** vào `src/content/**` (nội dung hiện tại viết từ blueprint, có thể thiếu/khác bản WP).
- [ ] Bổ sung URL còn thiếu (blueprint dự kiến 30–60 URL; hiện có 33). Cập nhật `workspace/inventory/urls.csv`.
- [ ] `pnpm build` lại + spot-check 5 trang + xác nhận không request `wp-content`.

### 2. Phase 5 — deploy Vercel + domain (cần owner)
- [ ] Import repo lên Vercel, set Node 22, env vars (`PUBLIC_SITE_URL`, `PUBLIC_GA_ID=`, `PUBLIC_FB_PIXEL=`).
- [ ] Add domain `www.rongvanghoanggia.com` + redirect apex → www; cấu hình DNS.
- [ ] Cutover plan (backup WP, đổi DNS, smoke test 10 URL, submit sitemap GSC + Bing).
- [ ] Acceptance gate Phase 5.

### 3. Kiểm thử/đánh giá còn lại (cần URL deploy hoặc Chrome)
- [ ] Lighthouse mobile/desktop homepage + 3 trang đại diện (mục tiêu 100/100/100/100).
- [ ] Validate JSON-LD trên schema.org validator (0 error).
- [ ] Test OG preview qua Facebook Sharing Debugger / opengraph.xyz.
- [ ] Responsive check thủ công 375 / 768 / 1280.

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
