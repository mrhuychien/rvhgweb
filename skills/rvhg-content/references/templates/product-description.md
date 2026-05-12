---
title: "{{ Tên sản phẩm }}"
description: "{{ 150-160 ký tự, mô tả + CTA ngầm; có keyword '{{ keyword }}' }}"
sku: "RVHG-{{ MÃ }}"
category: "{{ banh-dau-xanh-thuong-hang | banh-dau-xanh-tet | banh-dau-xanh-truyen-thong | banh-dau-xanh-trai-cay-truyen-thong | bot-dau }}"
weight: "{{ 300g }}"
packaging: "{{ Hộp giấy cao cấp }}"
isOcop5Star: {{ true|false }}
isFeatured: {{ true|false }}
order: {{ số thứ tự hiển thị }}
images:
  - "/images/legacy/{{ file }}.jpg"
shopeeLink: "{{ https://shopee.vn/... — optional, xoá dòng nếu chưa có }}"
tiktokLink: "{{ https://www.tiktok.com/... — optional, xoá dòng nếu chưa có }}"
oldUrl: "https://www.rongvanghoanggia.com/san-pham/{{ slug }}/"
---

<!-- 1 đoạn mở: 1-2 câu định vị sản phẩm (nó là gì, cho ai). Voice "Rồng Vàng Hoàng Gia" hoặc "chúng tôi". -->
{{ Đoạn mở. }}

- {{ Đặc điểm 1 — nguyên liệu / vị }}
- {{ Đặc điểm 2 — quy cách / khối lượng }}
- {{ Đặc điểm 3 — dịp dùng / cách dùng }}
- {{ Đặc điểm 4 — chứng nhận: "Đạt OCOP 5 sao Quốc gia 2024 · ISO 22000:2018" nếu áp dụng, nếu không thì chỉ "Sản xuất theo tiêu chuẩn ISO 22000:2018" }}

<!-- 1-2 câu khép, có thể nhắc tagline hoặc 1 anchor nếu tự nhiên. Không bắt buộc với mô tả ngắn. -->
{{ Câu khép. }}
