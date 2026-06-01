# Hướng dẫn quản trị nội dung — Rồng Vàng Hoàng Gia

Trang quản trị cho phép anh **đăng nhập, thêm/sửa bài viết, thay ảnh, sửa trang giới thiệu** qua giao diện (như WordPress thu gọn) — không cần biết lập trình. Mỗi lần bấm **Lưu**, nội dung tự lưu lên GitHub và website tự cập nhật sau khoảng **1 phút**.

Địa chỉ trang quản trị: **`https://<tên-miền>/admin/`**
(ví dụ sau khi lên tên miền chính: `https://www.rongvanghoanggia.com/admin/`)

---

## ⚙️ Thiết lập 1 lần (kỹ thuật — làm một lần duy nhất)

Vì website không có máy chủ riêng, trang quản trị cần một "cầu nối đăng nhập GitHub". Cầu nối này đã được viết sẵn — chỉ cần **deploy một lần**.

👉 **Làm theo hướng dẫn từng bước trong: [`tools/cms-auth/README.md`](../tools/cms-auth/README.md)**

Tóm tắt 3 bước (~10 phút, miễn phí):
1. Tạo **GitHub OAuth App** → lấy Client ID + Client Secret.
2. **Deploy Worker** lên Cloudflare (`npx wrangler deploy`) → nhận URL Worker.
3. Nối URL: dán callback URL vào GitHub, dán `base_url` (URL Worker) vào `public/admin/config.yml`.

> Bước deploy cần máy có cài **Node.js**. Nếu anh không tiện cài, nhắn Claude — sẽ làm hộ phần cấu hình, anh chỉ cần cung cấp quyền Cloudflare/GitHub.
>
> Sau khi xong bước này, từ đó về sau anh **chỉ việc đăng nhập và dùng**, không phải đụng kỹ thuật nữa.

---

## ✍️ Dùng hằng ngày

### Đăng nhập
1. Mở `https://www.rongvanghoanggia.com/admin/`
2. Bấm **Login with GitHub** → đăng nhập tài khoản GitHub (tài khoản sở hữu repo).

### Đăng một bài viết mới
1. Vào mục **Bài viết / Tin tức** → bấm **New Bài viết**.
2. Điền **Tiêu đề**, **Mô tả ngắn**, chọn **Ngày đăng**.
3. **Ảnh bìa:** bấm chọn → tải ảnh từ máy lên.
4. Gõ **Nội dung** trong ô soạn thảo (in đậm, tiêu đề, danh sách, chèn ảnh… như Word).
5. Bấm **Save** (lưu nháp) rồi **Publish** (đăng). Xong — chờ ~1 phút bài hiện trên web.
   - Muốn viết dở rồi để sau: bật **Lưu nháp** → bài chưa hiện ra web.

### Thay một ảnh
- **Cách gọn:** khi sửa bài/trang, ở ô ảnh bấm chọn ảnh mới từ máy → Save. Ảnh tự thay.
- Toàn bộ ảnh nằm trong kho chung; có thể mở mục Media (biểu tượng ảnh) để xem/tải lên.

### Sửa trang Giới thiệu (hoặc Liên hệ, Điểm bán, Câu chuyện)
1. Vào mục **Trang nội dung** → bấm vào trang cần sửa.
2. Sửa nội dung / thay ảnh đầu trang → **Save** → **Publish**.

### Sửa dòng sản phẩm (ảnh thẻ trang chủ, danh sách SP…)
1. Vào mục **Dòng sản phẩm** → chọn 1 trong 5 dòng.
2. Đổi **Ảnh thẻ** (ảnh hiện ở trang chủ), thêm/bớt **Sản phẩm trong dòng**, sửa **Tiêu chuẩn**, **Bản tự công bố**… → Save → Publish.

---

## ⚠️ Lưu ý

- **Tài khoản đăng nhập = tài khoản GitHub.** Muốn cho nhân viên đăng bài: thêm họ làm **Collaborator** của repo trên GitHub (Settings → Collaborators), họ tự đăng nhập GitHub của họ.
- Mỗi lần Publish là một bản ghi trên GitHub → **không sợ mất**, có thể xem lại/khôi phục lịch sử.
- Đừng sửa các ô ghi **(ẩn)** / hidden — chúng giữ dữ liệu kỹ thuật để web không lỗi.
- Nếu sau khi Publish mà web **không cập nhật sau 5 phút**, thường do nội dung thiếu trường bắt buộc — vào Vercel xem log build, hoặc nhắn Claude kiểm tra.
- Trang `/admin/` đã được chặn khỏi Google (robots.txt) nên khách không thấy.

---

## Tóm tắt cho người bận

| Muốn làm | Vào mục | Thao tác |
|---|---|---|
| Đăng bài mới | Bài viết / Tin tức | New → điền → Publish |
| Thay ảnh | (trong bài/trang) | bấm ô ảnh → tải ảnh mới → Save |
| Sửa Giới thiệu | Trang nội dung | chọn trang → sửa → Publish |
| Đổi ảnh dòng SP ở trang chủ | Dòng sản phẩm | chọn dòng → Ảnh thẻ → Publish |
