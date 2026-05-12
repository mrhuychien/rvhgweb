# Product catalog — tra cứu khi viết content

## Danh mục (5) — `category` enum trong frontmatter products

| `category` value | Tên hiển thị | URL danh mục |
|---|---|---|
| `banh-dau-xanh-thuong-hang` | Bánh đậu xanh thượng hạng | `/danh-muc-san-pham/banh-dau-xanh-thuong-hang/` |
| `banh-dau-xanh-tet` | Bánh đậu xanh Tết — quà biếu | `/danh-muc-san-pham/banh-dau-xanh-tet/` |
| `banh-dau-xanh-truyen-thong` | Bánh đậu xanh truyền thống | `/danh-muc-san-pham/banh-dau-xanh-truyen-thong/` |
| `banh-dau-xanh-trai-cay-truyen-thong` | Bánh đậu xanh hương vị trái cây | `/danh-muc-san-pham/banh-dau-xanh-trai-cay-truyen-thong/` |
| `bot-dau` | Bột đậu xanh & Chè đậu đen | `/danh-muc-san-pham/bot-dau/` |

## Sản phẩm hiện có (slug → để internal link `/san-pham/<slug>/`)

| slug | tên | category | OCOP 5★ | ghi chú |
|---|---|---|---|---|
| `hop-qua-banh-dau-xanh-ocop-5-sao-quoc-gia` | Hộp quà bánh đậu xanh OCOP 5 sao Quốc gia | thuong-hang | có | sản phẩm biểu tượng, 300g, hộp quà cao cấp |
| `hop-qua-thuong-hang-tre-cao-cap` | Hộp quà thượng hạng tre cao cấp | thuong-hang | có | 500g, hộp tre thủ công |
| `banh-dau-xanh-thuong-hang-300g` | Bánh đậu xanh thượng hạng 300g | thuong-hang | có | hộp giấy cao cấp |
| `banh-dau-xanh-banh-chung-vang` | Bánh đậu xanh Bánh Chưng Vàng | tet | không | quà Tết, 400g |
| `banh-dau-tra-xanh` | Bánh đậu trà xanh | trai-cay-truyen-thong | có | 300g, vị trà xanh |
| `banh-dau-sau-rieng` | Bánh đậu sầu riêng | trai-cay-truyen-thong | có | 300g, vị sầu riêng |
| `banh-dau-xanh-truyen-thong` | Bánh đậu xanh truyền thống | truyen-thong | không | 240g, nguyên bản |
| `bot-dau-xanh-dinh-duong` | Bột đậu xanh dinh dưỡng | bot-dau | không | 4 vị: Cà Rốt, Rau Má, Sữa Dừa, Matcha |
| `che-dau-den-cot-dua` | Chè đậu đen cốt dừa | bot-dau | không | ăn liền |

## Mô tả vị (dùng nhất quán)

- Bánh đậu xanh truyền thống: ngọt thanh, mềm, tan nơi đầu lưỡi, bùi vị đậu xanh; chỉ đậu xanh + đường + dầu thực vật, không phẩm màu.
- Bánh đậu trà xanh: nền đậu xanh + bột trà xanh nguyên chất; chát dịu, hậu ngọt; "một khúc biến tấu của hương sắc và trầm tư".
- Bánh đậu sầu riêng: nền đậu xanh + sầu riêng tự nhiên; hương nồng nàn nhưng không ngấy.
- Bột đậu xanh dinh dưỡng: pha 1 gói với 150–200 ml nước nóng; thơm bùi; dùng nóng hoặc thêm đá.
- Chè đậu đen cốt dừa: đậu đen ninh mềm + nước cốt dừa béo; pha nhanh.

## Khi tạo product mới — frontmatter mẫu

```yaml
---
title: '...'
description: '...'                      # 150–160 ký tự, có CTA ngầm
sku: 'RVHG-...'                         # optional
category: 'banh-dau-xanh-...'           # 1 trong 5 enum trên
weight: '300g'                          # optional
packaging: 'Hộp giấy cao cấp'           # optional
isOcop5Star: false
isFeatured: false
order: 10
images:
  - '/images/legacy/<file>.jpg'         # ảnh phải tồn tại trong public/images/legacy/
oldUrl: 'https://www.rongvanghoanggia.com/san-pham/<slug>/'
---
```
