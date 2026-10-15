# RVHG — bản duyệt biên tập 15/10/2026

## Kết quả

- Viết lại 72 bài; giữ nguyên URL, ngày bài và trạng thái bản nháp.
- Giữ 17 bài theo lịch 16/10–29/12/2026.
- Đổi/bổ sung 38 ảnh bìa, trong đó 15 ảnh thật có giấy phép được ghi nguồn.
- Ảnh bìa thiếu: 12 → 0. Nhóm trùng đường dẫn: 12 (28 bài) → 0. Nhóm trùng nguyên byte: 13 (31 bài) → 0. Bốn cặp cùng cảnh nhưng khác kích thước/nén đã được thay. Các thiết kế bao bì tương tự không đồng nghĩa với cùng một ảnh; chưa khẳng định mọi ảnh đều khác nhau về thị giác.
- Bổ sung mô tả ảnh, chú thích, tín dụng tác giả/giấy phép và chế độ giữ nguyên khung sản phẩm khi cần.

## Cách duyệt

Mở `RVHG-72-article-review.html` trong trình duyệt và nhấn tiêu đề từng bài. Ảnh đã được nhúng, không cần máy chủ. Đây là bản đọc duyệt độc lập, không phải bản chụp giao diện website. `RVHG-first-editorial-preview.pdf` là bản đọc nhanh hai bài mẫu đã kiểm tra bố cục PDF.

`overlay/` chứa toàn bộ tệp đã sửa/thêm, gồm nội dung, ảnh mới, mã hiển thị nguồn ảnh và báo cáo. `editorial-refresh.patch` là diff cho các tệp đã có trong Git. `MANIFEST.sha256` cho phép kiểm tra toàn vẹn gói.

## Nền mã và khôi phục

Repository: https://github.com/mrhuychien/rvhgweb

Base commit: `387e72887d6bcfccaa0bfdee2ddf1aa7dada776b`. Kiểm tra từ nguồn GitHub hiện hành; công việc cũ trên máy trước đó không được khôi phục hoặc coi là đã có trong repository.

Để duyệt trên một bản checkout sạch đúng base: dùng `git apply --check editorial-refresh.patch`, rồi `git apply editorial-refresh.patch`; chép các tệp mới từ `overlay/public/images/editorial/`, `overlay/docs/editorial-review/` và `overlay/tools/editorial/` vào đường dẫn tương ứng. Hoặc đối chiếu và chép overlay vào một bản checkout riêng. Không chép đè một cây đang có thay đổi của người khác. Nếu main đã đổi, cần đối chiếu/rebase thủ công trước khi áp dụng.

Node >=22; dự án yêu cầu pnpm 10.34.6. Chạy `pnpm install --frozen-lockfile`, sau đó `PUBLIC_PUBLISH_AS_OF=2026-10-15 pnpm verify`. Để xem toàn bộ lịch trong bản xem trước riêng, dùng `PUBLIC_PUBLISH_AS_OF=2026-12-31 pnpm verify`. Không dùng mốc tương lai để triển khai production. Script audit Python cần PyYAML.

## Kiểm tra đã đạt

- Mốc 15/10: 79 trang được tạo; 80 tệp HTML được kiểm tra; 17 bài tương lai bị loại đúng lịch.
- Mốc 31/12: 96 trang được tạo; 97 tệp HTML được kiểm tra.
- Cả hai mốc: không có liên kết nội bộ chết theo quy tắc Cloudflare Pages và Vercel; kiểm tra Pages, SEO apex và Drive đều đạt. Drivecheck là kiểm tra cấu trúc tham chiếu, không phải xác nhận mọi tài liệu từ xa vẫn tải được.
- 72 bài qua kiểm tra metadata/ảnh/nguồn ảnh; không có chuỗi văn xuôi 25 từ liên tiếp trùng nhau sau chuẩn hóa.
- Browser QA bị chặn bởi chính sách URL/sandbox của môi trường. Chưa xác nhận giao diện desktop/mobile thực tế. PDF mẫu đã được render và kiểm tra thị giác.

## Cần quyết định trước khi xuất bản

1. Duyệt các đính chính có ngày 15/10/2026: đặc biệt bài trà xanh/sầu riêng gốc 20/11/2024 nhưng quyết định thực tế 26/06/2025; giữ lịch sử bài thay vì sửa lùi ngày.
2. Phần nội dung toàn site trong `src/data/site.ts` còn tuyên bố “duy nhất”, giai thoại như sự thật và bảo đảm sức khỏe. Chưa sửa ngoài phạm vi bài viết. Xem `content-audit.md` để duyệt riêng.
3. Một số ảnh sản phẩm có sẵn mang dạng đồ họa/render và chưa có hồ sơ xác thực nguồn ảnh; không được coi là ảnh sản phẩm mới chụp. Ảnh bột matcha có chữ bao bì nhỏ bất thường cần chủ thương hiệu kiểm tra. Không tạo ảnh sản phẩm giả mới.
4. Các bài hướng dẫn làm bánh hiện trình bày nguyên lý, không tự nhận là công thức định lượng đã thử nghiệm. Có thể bổ sung công thức được thử thực tế sau.

## Nguồn chính

Danh sách OCOP chính thức: https://xaydungchinhsach.chinhphu.vn/danh-sach-san-pham-ocop-5-sao-119260408171050959.htm

- Bánh đậu xanh: 2171/QĐ-BNN-VPĐP, 04/07/2024.
- Bánh đậu trà xanh và bánh đậu sầu riêng: 2361/QĐ-BNNMT, 26/06/2025.
- ISO: đối chiếu ảnh chứng nhận đã có trong repository, QUACERT HA 394/4.26.CIV, thời hạn in 08/08/2026–07/08/2029, phạm vi sản xuất bánh đậu xanh và bột đậu uống liền. Không coi đây là tra cứu trạng thái thời gian thực của cơ quan cấp.

Chi tiết bản quyền: `photo-credits.md`, `external-image-sources.json`, `image-audit.md`. Bản sao ảnh CC giữ nguyên giấy phép tương ứng và hiển thị ghi nguồn dưới bìa.

Chưa commit, push, merge, xuất bản hoặc triển khai.
