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

Cần có Node trên máy. Mở terminal **đúng tại thư mục `tools/cms-auth/`** (gõ `dir` phải thấy `worker.js` và `wrangler.toml` — nếu không thấy là đang sai thư mục).

```bash
cd tools/cms-auth           # đứng đúng thư mục chứa wrangler.toml
npx wrangler login          # mở trình duyệt, đăng nhập Cloudflare (miễn phí)
npx wrangler deploy         # PHẢI deploy trước — lệnh này tạo worker
npx wrangler secret put GITHUB_CLIENT_ID       # rồi mới đặt Client ID
npx wrangler secret put GITHUB_CLIENT_SECRET   # và Client Secret
npx wrangler deploy         # deploy lại 1 lần để worker nhận secret
```

> ⚠️ Phải chạy `deploy` **trước** `secret put`. Lệnh `secret put` chỉ hoạt động khi worker đã tồn tại — chạy nó đầu tiên sẽ báo lỗi `Required Worker name missing`.
> Nếu vẫn báo thiếu name: đang đứng sai thư mục (không thấy `wrangler.toml`), hoặc thêm cờ `--name rvhg-cms-auth` vào lệnh.

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
