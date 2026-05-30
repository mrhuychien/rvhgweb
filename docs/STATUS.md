# STATUS — RVHG website rebuild

Cập nhật: sau session Imperial design-system token spec (30/05/2026).
Branch làm việc: `claude/rebuild-rvhg-astro-TvUGA`.

---

## Design system hiện hành — "Imperial heritage" (30/05/2026)

Owner cung cấp **"RVHG Design System — Token Spec v1.0"** (viết cho Next.js+shadcn) → đã **adapt sang Astro 5 + Tailwind 4**, KHÔNG tạo file Next.js.
- `tokens.json` (root) = source of truth.
- `src/styles/global.css`: `@theme` (primitive + semantic + Playfair/BeVietnamPro + scale + spacing + radius ≤8px + shadow ấm + easing) + `:root` bridge re-map mọi legacy var sang palette imperial → cả site đổi theme, không sửa từng component.
- Palette: cream `#FBF8F1`, ink ấm `#1C1714`, oxblood lacquer (dark band + primary button), brass hairline/emblem, seal cinnabar (chỉ triện/tem/`::selection`), bean accent.
- Font: **Playfair Display** self-hosted (`public/fonts/playfair-display-*.woff2`) cho h1–h4; **Be Vietnam Pro** cho body. Fraunces đã bỏ reference.
- Signature: `.rvhg-eyebrow` brass + `.gold-rule` (chèn ở hero/section-head homepage + 4 head ProductLineLayout + footer); triện `SealStamp.astro` đặt 1 lần ở footer (đã đổi dark oxblood).
- 10 hard rules §0 đã tuân thủ (bỏ gradient vàng hero, de-pill button/tag, primary oxblood, link ink+brass underline, brass/bean không cho body nhỏ).
- ⚠️ `MediaLogos.astro`/`DistributionLogos.astro` còn `999px` nhưng không import (dead code).
- ⚠️ Chưa build local (máy không có Node) → cần xem Vercel preview xác nhận.

---

## TL;DR cho session kế tiếp

Đọc theo thứ tự: `README.md` → `docs/BLUEPRINT.md` → file này → `workspace/README.md`.

- **Phase 1–4 (clone, content ingest, Astro rebuild, SEO+AI, skill `rvhg-content`): XONG** ở các session trước.
- **Apple-style restructure (round mới, 14/05/2026): XONG** — chi tiết bên dưới.
- **Phase 5 (deploy Vercel): preview vẫn LIVE** — `https://rvhgweb.vercel.app`. Còn lại: custom domain `www.rongvanghoanggia.com` + apex redirect + DNS cutover; GA4 + FB Pixel khi có.

---

## ✅ Apple-redesign + consolidation (round 14/05/2026)

### Cấu trúc mới (BREAKING)
- **Bỏ trang chi tiết từng sản phẩm** — toàn bộ 9 file `src/content/products/*.md` vẫn còn ở repo (data archival, không có route nào render từ đó), nhưng `/san-pham/<slug>/` không còn build ra HTML.
- **5 trang "dòng sản phẩm"** `/danh-muc-san-pham/<slug>/` thay thế: mỗi trang chứa hero + brand intro + cert grid (3 cards) + self-declaration list + product grid (name + image only) + CTA mua.
- **301 redirects trong `vercel.json`** — toàn bộ slug PDP cũ → trang dòng cha; thêm catch-all `/san-pham/:slug/` → `/san-pham/` cho mọi slug ngoài danh sách.
- **`/og/product/:slug.png` redirect → `/og-default.png`** (vì endpoint sinh OG product đã xoá).

### Apple-style reskin
- Token mới (`src/styles/global.css`): white `#fff` + soft `#fbfbfd` + tint `#f5f5f7` + dark band `#000`; ink `#1d1d1f`, mute `#6e6e73`; line `#d2d2d7`. Brand gold/red retained làm small accent (logo, certain dots), không còn fill nền.
- Type: `Be Vietnam Pro` cho cả body + display (drop Fraunces khỏi h1-h4, vẫn load làm fallback cho Logo seal); fluid scale: `--text-headline` `clamp(2.75, 5vw+1, 5.5rem)` cho h1 hero, `--text-display` `clamp(2.25, 3.5vw+1, 4rem)` cho h2 section.
- Tracking âm `-0.022em` cho h1-h4, `text-wrap: balance`.
- Header: sticky thin (3rem), backdrop blur 20px saturate 180%, nav text 0.78rem opacity 0.86, logo wordmark thay full-name SVG.
- Buttons: pill `border-radius: 999px`, primary `--color-ink` (đen Apple), ghost outline, link blue `#0066cc`.

### Files mới
- `src/components/ProductTile.astro` — name + image, image fallback "nameplate" (gradient + initials) khi không có ảnh.
- `src/layouts/ProductLineLayout.astro` — layout chính cho 5 trang dòng sản phẩm.

### Files xoá
- `src/pages/san-pham/[slug]/` — directory.
- `src/pages/og/product/` — directory.
- `src/layouts/ProductLayout.astro`.
- `src/components/ProductCard.astro`.
- `src/components/CategoryGrid.astro`.

### Files rewrite
- `src/styles/global.css` (tokens + utilities).
- `src/components/Header.astro`, `Logo.astro`, `Footer.astro`, `Breadcrumbs.astro`.
- `src/layouts/BaseLayout.astro` (giữ nguyên), `PageLayout.astro`, `PostLayout.astro`, `PolicyLayout.astro`.
- `src/pages/index.astro` (homepage Apple full-bleed + duo tiles + 5 line showcases + Khải Định 1918 dark band + trust 4-cell grid + FAQ + CTA).
- `src/pages/san-pham/index.astro` (5-line overview Apple-style).
- `src/pages/danh-muc-san-pham/[slug]/index.astro` (1-liner gọi `ProductLineLayout`).
- `src/pages/cong-bo/index.astro`, `tin-tuc/index.astro`, `404.astro`.
- `src/pages/gioi-thieu/`, `lien-he/`, `diem-ban-rong-vang-hoang-gia/` — eyebrow + heading + lede mới (Apple voice).
- `src/pages/llms-full.txt.ts` — đổi structure: bỏ section SẢN PHẨM riêng, fold vào DÒNG SẢN PHẨM với cert/decl/products inline.
- `src/content.config.ts` — schema `productCategories` mới: `eyebrow`, `tagline`, `accent`, `storyImage`, `certifications[]`, `selfDeclarations[]`, `products[]`.
- `src/content/product-categories/*.md` (5 file) — frontmatter rich (cert grid + decl list + product grid) + body intro ngắn.
- `vercel.json` — thêm 56 redirect rules (1 cho `/feed/`, 50+ cho từng product slug, 1 catch-all `/san-pham/:slug/`, 1 cho OG product).

### Components còn nhưng unused (không xoá để dùng lại nếu cần)
- `MediaLogos.astro`, `DistributionLogos.astro`, `LegacyImg.astro`.
- Collection `products` (data archival).

### Image gap đã document
- Repo chỉ có 47 ảnh trong `public/images/legacy/`. Trong tổng ~58 SKU đưa lên trang dòng sản phẩm, ~25 có ảnh, còn lại render bằng `ProductTile` nameplate (gradient + initials).
- Để fill nốt: chạy lại workspace mirror script từ môi trường có network access tới `rongvanghoanggia.com`, hoặc copy ảnh ngày từ wp-content live.

---

## ❌ Chưa làm — TODO (ưu tiên từ trên xuống)

### 1. Phase 5 — deploy Vercel + domain (cần owner)
- [ ] Add domain `www.rongvanghoanggia.com` + redirect apex → www; cấu hình DNS.
- [ ] Cutover plan (backup WP, đổi DNS, smoke test 10 URL, submit sitemap GSC + Bing).

### 2. Migrate hồ sơ tự công bố PDF
- [ ] Hiện 11 PDF (`/wp-content/uploads/2024/01/01.-Banh-dau-xanh-1.pdf` v.v.) vẫn nằm trên WP cũ. Cần download về `public/cong-bo/*.pdf` hoặc migrate sang storage độc lập trước cutover, rồi cập nhật `selfDeclarations[].href` trong 5 file `src/content/product-categories/*.md` — hiện tất cả trỏ về hub `/ban-tu-cong-bo-rong-vang-hoang-gia/`.

### 3. Image polish
- [ ] Re-mirror các ảnh `-300x300.{jpg,png}` còn thiếu của ~33 SKU để tile có ảnh thật, không chỉ nameplate. Danh sách image filename trong `workspace/content-raw/product_category/*.md`.

### 4. Kiểm thử
- [ ] Lighthouse mobile/desktop homepage + 1 trang dòng SP đại diện sau khi build deploy lên Vercel preview.
- [ ] Validate JSON-LD trên schema.org validator (Organization + WebSite + Article + BreadcrumbList + FAQPage).
- [ ] Spot-check 9 URL PDP cũ → 301 to category page (Vercel redirect).
- [ ] Visual diff vs Apple.com — đặc biệt: nav blur, hero typography, alternating section, FAQ accordion.

### 5. Linh tinh
- [ ] GA4 / Facebook Pixel: điền `PUBLIC_GA_ID` / `PUBLIC_FB_PIXEL` khi có.
- [ ] Cài skill `rvhg-content` vào `~/.claude/skills/`.
- [ ] (Tùy) mở Pull Request cho branch.

---

## Khác blueprint một chút
- Schema `productCategories` mở rộng (cert + decl + products embedded) — vẫn tương thích Astro 5 Content Layer.
- Routing: bỏ `/san-pham/[slug]/`, giữ `/danh-muc-san-pham/[slug]/` làm trang chính, `[slug]` catch-all vẫn handle posts + policies + standalone pages.
- Brand voice giữ nguyên các anchor: Khải Định 1918 / OCOP 5 sao / ISO 22000:2018 / "Đặc sản nức tiếng Hải Dương".
