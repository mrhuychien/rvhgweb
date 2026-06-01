# Bàn giao phiên làm việc — chuyển sang máy Mac

File này tóm tắt trạng thái dự án để **tiếp tục công việc trên máy khác** (Mac có đủ dev tool). Phiên Claude mới chỉ cần đọc file này + `docs/STATUS.md` là nắm được việc.

Cập nhật: 01/06/2026 · Commit mới nhất: nhánh `main` và `claude/rebuild-rvhg-astro-TvUGA` đang khớp nhau.

---

## 1. Lấy code về máy Mac

```bash
# Cài công cụ (nếu chưa có)
brew install git node pnpm        # hoặc: corepack enable

# Clone repo
git clone https://github.com/mrhuychien/rvhgweb.git
cd rvhgweb
git checkout main

# Cài & chạy thử
pnpm install
pnpm dev          # mở http://localhost:4321
pnpm build        # build tĩnh ra dist/ — nên chạy để chắc không lỗi
```

> **Lợi thế của Mac:** 3 file `workspace/content-raw/.../index.html?add-to-cart=6887.md`
> trên Windows không checkout được (vì ký tự `?`). Mac cho phép `?` trong tên file
> nên `git clone` sẽ sạch, đủ file, không cần workaround.

---

## 2. Trạng thái hiện tại (đã xong)

- **Giao diện "Imperial heritage"** (cream/oxblood/brass, font Playfair + Be Vietnam Pro). Token nằm trong `src/styles/global.css` (@theme) + `tokens.json`.
- **Header** kiểu web cũ: nền sơn mài, logo rồng vàng nét (`logo-seal.png`) căn giữa, menu 2 bên + dropdown ngôn ngữ (Google dịch, VI/EN/JA/KO/ZH/FR).
- **Trang chủ** đúng 6 phần như web gốc: Hero · Bí quyết thành công (9) · Sản phẩm cao cấp (8) · Danh mục sản phẩm (5 thẻ ảnh) · Hệ thống phân phối (logo siêu thị) · Trên truyền thông (logo báo chí).
- **Bỏ trang chi tiết từng SP** → 5 trang "dòng sản phẩm" + 301 redirect (xem `vercel.json`).
- **Footer** dark oxblood + logo + thông tin pháp lý đầy đủ (lấy từ `src/data/site.ts`).
- **Nội dung** (trang, chính sách, bài viết) đã migrate từ bản mirror `workspace/content-raw/`.
- **PDF tự công bố** (12 file) trong `public/cong-bo/`. Ảnh sản phẩm/logo trong `public/images/legacy/`.
- **Mobile** đã tối ưu (chống tràn ngang, co chữ, header gọn).
- **Bảng quản trị `/admin`** (Sveltia CMS) — `public/admin/`, hướng dẫn ở `docs/HUONG-DAN-QUAN-TRI.md`.

---

## 3. Việc CÒN LẠI (ưu tiên làm trên Mac)

### a) Deploy Worker đăng nhập cho `/admin` (cần Node — Mac làm được)
```bash
cd tools/cms-auth
npx wrangler login
npx wrangler deploy                          # tạo worker trước
npx wrangler secret put GITHUB_CLIENT_ID     # rồi đặt secret
npx wrangler secret put GITHUB_CLIENT_SECRET
npx wrangler deploy                          # deploy lại để nhận secret
```
- Cần **GitHub OAuth App** trước (lấy Client ID + Secret) — xem `tools/cms-auth/README.md`.
- Sau khi deploy, lấy URL worker thật → sửa `base_url` trong `public/admin/config.yml`
  (đang để placeholder `rvhg-cms-auth.workers.dev`) → và dán callback URL vào GitHub OAuth App.

### b) Chuyển default branch + Vercel sang `main` (bấm nút, cần đăng nhập)
- GitHub repo → **Settings → Branches** → đổi default branch thành `main`.
- Vercel project → **Settings → Git → Production Branch** = `main`.

### c) Cutover tên miền (khi sẵn sàng)
- Trỏ `www.rongvanghoanggia.com` về Vercel + apex redirect + DNS. Xem `docs/STATUS.md` phần Phase 5.

### d) Nice-to-have
- Build kiểm tra Lighthouse + validate JSON-LD (giờ mới chạy được vì Mac có Node — các phiên trước trên Windows không có Node nên chưa build/đo được).
- Điền `PUBLIC_GA_ID` / `PUBLIC_FB_PIXEL` khi có.

---

## 4. Lưu ý khi tiếp tục

- **Chưa từng build trên máy cũ** (Windows không có Node) — nên việc đầu tiên trên Mac
  nên là `pnpm build` để chắc không có lỗi tích tụ. Nếu lỗi, sửa rồi commit.
- Một số ảnh card/hero owner tự upload thẳng GitHub (`card-*.jpg`, `hero-home.jpg`,
  `logo-seal.png`) — đã verify tồn tại, không vỡ.
- Khi sửa file `.md` nội dung: phần frontmatter giữa `---` phải hợp lệ, nếu không Vercel build lỗi.
