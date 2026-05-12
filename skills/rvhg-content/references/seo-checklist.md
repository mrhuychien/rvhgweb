# SEO checklist — kiểm trước khi commit content

## Frontmatter schema (phải khớp, nếu không `astro build` fail Zod)

### posts — `src/content/posts/<slug>.md`
```yaml
---
title: '...'                 # bắt buộc; ~55-60 ký tự, có keyword chính
description: '...'           # bắt buộc; 150-160 ký tự, có CTA ngầm
publishDate: 2025-01-15      # bắt buộc; YYYY-MM-DD
updated: 2025-02-01          # optional
author: 'Rồng Vàng Hoàng Gia'   # optional, default đã đúng
cover: '/images/legacy/<file>.jpg'  # optional; file phải tồn tại
tags: ['...', '...']         # optional
oldUrl: 'https://www.rongvanghoanggia.com/<slug>/'   # bắt buộc (chuỗi)
relatedProducts: ['<slug>', '<slug>']   # optional; slug sản phẩm có thật
draft: false                 # optional; true = không build
---
```

### products — `src/content/products/<slug>.md`
```yaml
---
title: '...'
description: '...'
sku: 'RVHG-...'              # optional
category: 'banh-dau-xanh-thuong-hang'   # 1 trong 5 enum (xem product-catalog.md)
weight: '300g'               # optional
packaging: '...'             # optional
isOcop5Star: false
isFeatured: false
order: 10
images: ['/images/legacy/<file>.jpg']   # ≥1, file phải tồn tại
shopeeLink: 'https://...'    # optional, phải là URL hợp lệ
tiktokLink: 'https://...'    # optional, phải là URL hợp lệ
oldUrl: 'https://www.rongvanghoanggia.com/san-pham/<slug>/'
---
```

### product-categories — `src/content/product-categories/<slug>.md`
```yaml
---
title: '...'
description: '...'
order: 1
heroImage: '/images/legacy/<file>.jpg'   # optional
oldUrl: 'https://www.rongvanghoanggia.com/danh-muc-san-pham/<slug>/'
---
```

## Nội dung — checklist

- [ ] `title` ≤ 60 ký tự, chứa keyword chính, không nhồi nhét.
- [ ] `description` 150–160 ký tự, đọc tự nhiên, có CTA ngầm.
- [ ] Có **1 H1** (do layout sinh từ `title` — KHÔNG viết `#` trong thân Markdown).
- [ ] 2–4 H2 (`##`), H3 (`###`) nếu cần. Heading hierarchy không nhảy bậc.
- [ ] LEDE 2–3 câu đầu chứa keyword chính, ≤ 50 từ.
- [ ] Ít nhất **1 internal link** tới `/san-pham/<slug>/` hoặc `/danh-muc-san-pham/<slug>/`.
- [ ] Long-form: tagline "Đặc sản nức tiếng Hải Dương" xuất hiện ≥ 1 lần.
- [ ] Long-form: tham chiếu ≥ 1 anchor (Khải Định 1918 / OCOP 5 sao / ISO 22000).
- [ ] Ảnh trong bài: `![alt mô tả](/images/legacy/<file>.jpg)` — alt text có ý nghĩa, file phải tồn tại trong `public/images/legacy/`.
- [ ] Link báo chí: external, `target="_blank"` (Markdown thường: chỉ cần `[text](url)`, layout/CSS xử lý phần còn lại — nhưng nếu viết HTML thì thêm `rel="noopener noreferrer"`).
- [ ] Không hot-link ảnh từ `wp-content` — chỉ dùng `/images/legacy/`.

## Internal linking — bản đồ URL nhanh

- Trang chủ: `/`
- Giới thiệu: `/gioi-thieu/`
- Câu chuyện thương hiệu: `/cau-chuyen-san-pham-rong-vang-hoang-gia-2/`
- Sản phẩm (tất cả): `/san-pham/`
- Sản phẩm cụ thể: `/san-pham/<slug>/`
- Danh mục: `/danh-muc-san-pham/<slug>/`
- Tin tức: `/tin-tuc/`
- Công bố: `/cong-bo/`
- Điểm bán: `/diem-ban-rong-vang-hoang-gia/`
- Liên hệ: `/lien-he/`

## Sau khi viết

1. `pnpm build` — phải không có lỗi Zod / build.
2. `pnpm dev` — kiểm tra render, ảnh không vỡ, heading đẹp.
3. `git add . && git commit -m "..." && git push` → Vercel auto deploy ~60s.
