# Cầu nối đăng nhập cho /admin — Cloudflare Worker

Trang quản trị `/admin` cần một "cầu nối" để đăng nhập GitHub (vì web tĩnh không có server). Đây là cách dựng — **làm một lần, dùng mãi**, hoàn toàn miễn phí.

Tổng thời gian: ~10 phút.

---

## Bước 1 — Tạo GitHub OAuth App

1. Mở https://github.com/settings/developers → **OAuth Apps** → **New OAuth App**.
2. Điền:
   - **Application name:** `RVHG Admin`
   - **Homepage URL:** `https://www.rongvanghoanggia.com`
   - **Authorization callback URL:** `https://rvhg-cms-auth.<subdomain>.workers.dev/callback`
     *(tạm điền vậy, sẽ sửa lại đúng URL ở Bước 3 sau khi có tên Worker thật)*
3. Bấm **Register application**.
4. Ghi lại **Client ID**. Bấm **Generate a new client secret** → ghi lại **Client Secret** (chỉ hiện 1 lần).

---

## Bước 2 — Deploy Worker lên Cloudflare

Cần có Node trên máy. Mở terminal tại thư mục `tools/cms-auth/`:

```bash
npx wrangler login          # mở trình duyệt, đăng nhập Cloudflare (miễn phí)
npx wrangler secret put GITHUB_CLIENT_ID       # dán Client ID
npx wrangler secret put GITHUB_CLIENT_SECRET   # dán Client Secret
npx wrangler deploy
```

Sau khi deploy, Cloudflare in ra URL dạng:
`https://rvhg-cms-auth.<subdomain>.workers.dev`
→ **ghi lại URL này**.

Kiểm tra: mở URL đó trên trình duyệt phải thấy dòng `RVHG CMS auth relay — OK`.

---

## Bước 3 — Nối lại các URL

1. **GitHub OAuth App** (Bước 1) → sửa **Authorization callback URL** thành đúng:
   `https://rvhg-cms-auth.<subdomain>.workers.dev/callback`
2. **File `public/admin/config.yml`** trong repo → sửa dòng `base_url` thành đúng URL Worker:
   ```yml
   base_url: https://rvhg-cms-auth.<subdomain>.workers.dev
   ```
   Commit thay đổi (hoặc nhắn Claude sửa hộ).

---

## Xong

Mở `https://www.rongvanghoanggia.com/admin/` → **Login with GitHub** → đăng nhập → bắt đầu quản trị nội dung.

> Nếu bấm Login mà báo lỗi: kiểm tra lại 3 thứ phải **khớp nhau** — tên Worker trong `base_url`, callback URL trên GitHub, và URL Worker thật. Sai một ký tự là không đăng nhập được.
