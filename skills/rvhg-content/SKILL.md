---
name: rvhg-content
description: >-
  Use when writing or updating content for rongvanghoanggia.com — blog/news posts
  (.md files in src/content/posts/), product descriptions (src/content/products/),
  product category copy, press releases, or Tết campaigns for Rồng Vàng Hoàng Gia.
  Triggers — "viết bài RVHG", "blog post Rồng Vàng", "mô tả sản phẩm bánh đậu xanh",
  "press release RVHG", "câu chuyện Khải Định", "Tết campaign", "OCOP 5 sao content".
  Always loads the brand voice document and at least one of the three brand anchors
  (Khải Định 1918 sắc phong "Bánh Ngon" / OCOP 5 sao Quốc gia 2024 / ISO 22000:2018).
---

# rvhg-content — viết nội dung cho Rồng Vàng Hoàng Gia

Bộ kỹ năng giúp tạo nội dung `.md` đúng brand voice cho website Astro `rongvanghoanggia.com`.

## Quy trình bắt buộc

1. **Đọc `BRAND_VOICE.md` trước tiên.** Không viết một câu nào trước khi nắm voice.
2. Xác định loại nội dung và mở template tương ứng trong `references/templates/`:
   - Blog / tin tức → `templates/blog-post.md`
   - Mô tả sản phẩm → `templates/product-description.md`
   - Thông cáo báo chí → `templates/press-release.md`
   - Chiến dịch Tết → `templates/tet-campaign.md`
3. Tra cứu dữ kiện trong `references/product-catalog.md` và `references/brand-story.md` — KHÔNG bịa số liệu, chứng nhận, hay mốc thời gian.
4. Mọi nội dung long-form (blog, press release, tết campaign) **phải**:
   - Nhắc tagline **"Đặc sản nức tiếng Hải Dương"** ít nhất 1 lần.
   - Tham chiếu ít nhất 1 trong 3 anchors (Khải Định 1918 / OCOP 5 sao 2024 / ISO 22000:2018).
   - Có ít nhất 1 internal link tới sản phẩm hoặc danh mục liên quan.
5. Kiểm tra frontmatter khớp schema Astro Content Collection (xem `references/seo-checklist.md`). Sai schema → `astro build` fail Zod validation.
6. Đặt file đúng thư mục:
   - Posts: `src/content/posts/<slug>.md` — slug = phần URL giữa hai dấu `/` (URL bài viết sẽ là `https://www.rongvanghoanggia.com/<slug>/`).
   - Products: `src/content/products/<slug>.md` — URL: `/san-pham/<slug>/`.
   - Categories: `src/content/product-categories/<slug>.md` — URL: `/danh-muc-san-pham/<slug>/`.
7. Sau khi tạo file, nhắc người dùng chạy `pnpm build` để xác nhận không lỗi Zod, rồi `git commit && git push` → Vercel auto deploy ~60s.

## Quy tắc cứng

- **Không** AI-generate ảnh sản phẩm/nhà máy. Dùng ảnh có sẵn trong `public/images/legacy/`.
- **Không** đổi tagline. Luôn là "Đặc sản nức tiếng Hải Dương".
- **Không** dùng từ marketing rỗng ("tuyệt vời", "vô cùng", "đỉnh cao") — xem danh sách cấm trong BRAND_VOICE.
- Citation báo chí (Báo Chính phủ, VTV, Báo Nhân Dân, Báo Pháp Luật, VOV, Dân Trí, HTV, Đài THHD): để link external, mở tab mới.
- Tiếng Việt duy nhất. Không song ngữ.

## Cài đặt skill này

Skill nằm trong repo tại `skills/rvhg-content/`. Để dùng từ Claude Code trên máy cá nhân:

```bash
cp -r skills/rvhg-content ~/.claude/skills/rvhg-content
```

(hoặc symlink). Sau đó skill tự kích hoạt khi gặp các trigger ở trên.
