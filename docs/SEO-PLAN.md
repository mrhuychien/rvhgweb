# KẾ HOẠCH SEO & GEO — rongvanghoanggia.com

> Tối ưu song song **công cụ tìm kiếm** (Google/Bing) và **AI tìm kiếm / GEO**
> (ChatGPT, Perplexity, Google AI Overviews, Gemini, Copilot).
> Ba từ khoá trọng tâm: **bánh đậu xanh**, **bột đậu xanh**, **đặc sản Việt Nam**.
> Cập nhật: 07/2026. Trạng thái mỗi hạng mục ghi ở cột "Ưu tiên".

---

## 0. Tóm tắt điều hành

Website đã có **nền tảng kỹ thuật SEO tốt hơn phần lớn đối thủ** trong ngành đặc sản: Astro SSG (HTML render sẵn — lý tưởng cho cả Google lẫn bot AI), meta/OG/Twitter đầy đủ, JSON-LD (Organization/WebSite/Product/Article/Breadcrumb), sitemap, và — hiếm gặp — đã có **`llms.txt` + `llms-full.txt`** cho AI crawler. Site cũng đã có sẵn thứ hạng cho "bánh đậu xanh Hải Dương".

Khoảng trống lớn nhất nằm ở **ba nhóm**:
1. **GEO (AI search):** chưa dùng FAQ/HowTo schema (yếu tố top-5 để được AI trích dẫn), `llms.txt` bị lỗi thời, chưa có "quotable facts" tối ưu cho LLM.
2. **Đo lường:** chưa cài GA4/Google Search Console/Bing → không biết đang đứng đâu.
3. **Nội dung theo cụm (topic cluster):** mảng "bột đậu xanh" và "đặc sản Việt Nam" còn mỏng so với tiềm năng.

Lợi thế cạnh tranh cần khai thác triệt để: **OCOP 5 sao Quốc gia 2024 — bánh đậu xanh đầu tiên & duy nhất cả nước** (không đối thủ nào có), ISO 22000:2018, câu chuyện Khải Định 1918, và độ phủ báo chí lớn. Đây vừa là tín hiệu E-E-A-T cho Google, vừa là "sự thật đáng trích dẫn" cho AI.

---

## 1. Hiện trạng — Kết quả audit

### 1.1 Đang làm tốt (giữ & phát huy)

| Hạng mục | Chi tiết trong code |
|---|---|
| Render server-side | Astro SSG, HTML tĩnh — bot AI đọc được toàn bộ nội dung, không phụ thuộc JS |
| Meta cơ bản | `src/components/SEO.astro`: title, description, canonical, `robots: index,follow,max-image-preview:large`, OG, Twitter card |
| Structured data | `src/data/jsonld.ts`: Organization, WebSite, Product (kèm `nutrition`, `gtin13`), Article, BreadcrumbList |
| Sitemap | `@astrojs/sitemap` (lọc trang `noindex`) |
| AI-ready | `public/llms.txt` + `/llms-full.txt` (auto) + `robots.txt` trỏ tới cả hai |
| Hiệu năng (CWV) | zero-JS mặc định, ảnh lazy, font subset WOFF2, cache asset `immutable` 1 năm (`vercel.json`) |
| Bảo mật/URL | Header nosniff/X-Frame/Referrer-Policy; `trailingSlash: always`; giữ URL 1:1 site cũ + nhiều 301 |

### 1.2 Cần khắc phục (xếp theo tác động)

| # | Vấn đề | Tác động | Ưu tiên |
|---|---|---|---|
| 1 | **FAQPage schema chưa dùng** (có sẵn `faqSchema()` nhưng không trang nào gọi) | Mất cơ hội rich result + **top-5 yếu tố để AI trích dẫn** | 🔴 Cao |
| 2 | **`llms.txt` lỗi thời**: "28 năm", "Bột đậu xanh & Chè đậu đen" (tên cũ), "4 vị" (nay 6), thiếu 5 landing bột mới + bài mới | AI trả lời sai/thiếu về sản phẩm mới | 🔴 Cao (đã xử lý — xem §11) |
| 3 | **Chưa cài GA4 / Search Console / Bing Webmaster** (biến môi trường rỗng) | Không đo được, không submit sitemap, không thấy query | 🔴 Cao |
| 4 | **HowTo/Recipe schema** chưa có (bài có "cách pha") | Mất rich result + tín hiệu GEO | 🟠 TB |
| 5 | Product schema thiếu `offers` (bán qua sàn ngoài) | Chưa xuất hiện dạng sản phẩm có nơi bán | 🟠 TB |
| 6 | Ảnh: tên file có dấu + dấu cách; chưa dùng `<Image>` AVIF/WebP + srcset cho ảnh mới; chưa có ImageObject | Image search yếu, LCP ảnh nặng ở vài trang | 🟠 TB |
| 7 | `sameAs` hẹp (chỉ Facebook) | Thiếu liên kết thực thể cho Knowledge Graph/AI | 🟠 TB |
| 8 | Chưa có LocalBusiness + Google Business Profile cho 2 showroom | Mất local pack + bản đồ | 🟡 Thấp |
| 9 | Cụm nội dung "bột đậu xanh" & "đặc sản Việt Nam" còn mỏng | Ít cửa xếp hạng long-tail | 🟠 TB (nội dung) |

---

## 2. Chiến lược từ khoá

### 2.1 Ba từ khoá trọng tâm — bản chất & định vị

| Từ khoá | Ý định (intent) | Độ khó | Chiến lược |
|---|---|---|---|
| **bánh đậu xanh** | Hỗn hợp: thông tin (là gì, nguồn gốc, cách chọn) + giao dịch (mua, quà) | Cao — nhiều đối thủ | Đã có authority; củng cố bằng cụm nội dung + lợi thế OCOP 5 sao. Nhắm biến thể "bánh đậu xanh Hải Dương", "…OCOP 5 sao", "…Rồng Vàng Hoàng Gia" |
| **bột đậu xanh** | Thông tin + giao dịch, đang lên, ít cạnh tranh hơn | Trung bình | Cơ hội "đại dương xanh": sản phẩm mới, ít brand đầu tư nội dung. Sở hữu "bột đậu xanh pha sẵn", "bột đậu xanh không đường", theo vị |
| **đặc sản việt nam** | Rộng, thông tin/quà tặng | Rất cao | Không đấu trực diện; dùng làm **cụm thương hiệu/quà tặng**: "đặc sản Hải Dương", "đặc sản Việt Nam làm quà biếu", "quà Tết đặc sản" — nơi OCOP 5 sao là điểm tựa |

### 2.2 Cụm chủ đề (topic cluster) — trang trụ (pillar) + vệ tinh

- **Cluster A — Bánh đậu xanh**
  Pillar: `/danh-muc-san-pham/banh-dau-xanh-truyen-thong/` (+ bài trụ mới: *"Bánh đậu xanh là gì? Nguồn gốc, cách chọn, cách ăn"*).
  Vệ tinh: OCOP 5 sao là gì; bánh đậu xanh Hải Dương; bánh đậu trà xanh/sầu riêng; cách bảo quản; ăn với gì; quà biếu.
- **Cluster B — Bột đậu xanh**
  Pillar: `/danh-muc-san-pham/bot-dau/` (+ bài trụ đã có: *"Bột đậu xanh pha sẵn…"*).
  Vệ tinh: 6 landing vị (`/botdx-*`, `/bdx-rauma-khongduong/`); bột đậu xanh có tác dụng gì; bột đậu xanh không đường; cách pha; so sánh với ngũ cốc.
- **Cluster C — Đặc sản Việt Nam / Quà tặng**
  Pillar: bài trụ mới *"Đặc sản Hải Dương làm quà biếu"* + `/danh-muc-san-pham/banh-dau-xanh-tet/`.
  Vệ tinh: quà Tết OCOP; đặc sản miền Bắc; quà biếu doanh nghiệp; hộp quà cao cấp.

> Nguyên tắc liên kết: mỗi bài vệ tinh trỏ về pillar bằng anchor giàu từ khoá; pillar trỏ ngược tới vệ tinh; các landing sản phẩm chèn link bài liên quan (đã bắt đầu ở bài bột mới).

### 2.3 Từ khoá long-tail & câu hỏi (phục vụ cả SEO lẫn GEO)

| Truy vấn (mẫu) | Intent | Trang đích | Dạng |
|---|---|---|---|
| bánh đậu xanh là gì / nguồn gốc | Thông tin | Bài trụ A | Bài + FAQ |
| bánh đậu xanh loại nào ngon / top thương hiệu | So sánh | Bài "cách chọn" | Listicle + bảng |
| bánh đậu xanh mua ở đâu / giá | Giao dịch | Điểm bán + sản phẩm | Trang + FAQ |
| bánh đậu xanh OCOP 5 sao | Thông tin/uy tín | Bài OCOP | Bài + Article schema |
| bột đậu xanh pha sẵn / có tác dụng gì | Thông tin | Bài trụ B | Bài + FAQ + HowTo |
| bột đậu xanh không đường / cho người ăn kiêng | Giao dịch | `/bdx-rauma-khongduong/` | Landing + bảng dinh dưỡng |
| bột đậu xanh cà rốt/rau má/sữa dừa/matcha | Giao dịch | 4 landing vị | Landing + Product schema |
| đặc sản Hải Dương làm quà | Quà tặng | Pillar C | Bài + FAQ |
| quà Tết đặc sản OCOP | Mùa vụ | Banh-dau-xanh-tet | Landing theo mùa |

### 2.4 Đối thủ & khoảng trống

- **Đối thủ trực tiếp:** Nguyên Hương, Gia Bảo, Minh Ngọc, Quê Hương… (thương hiệu bánh đậu xanh Hải Dương).
- **Đối thủ nội dung (SERP informational):** toplist.vn, huubinh.vn, ticotravel, ruoibatu — các bài "Top thương hiệu / đặc sản Hải Dương".
- **Khoảng trống để chiếm:** (a) truy vấn thông tin *"cách chọn / mua ở đâu / là gì / có tác dụng gì"*; (b) toàn bộ mảng **bột đậu xanh pha sẵn** (đối thủ chưa đầu tư nội dung); (c) khai thác **OCOP 5 sao** — không đối thủ nào sở hữu tín hiệu này.

---

## 3. On-page SEO

- **Công thức title (≤ 60 ký tự):** `{Từ khoá chính} + {điểm khác biệt} + {thương hiệu}`.
  Ví dụ: "Bánh đậu xanh OCOP 5 sao Quốc gia | Rồng Vàng Hoàng Gia".
- **Meta description (150–160):** đọc tự nhiên, có từ khoá + CTA ngầm + con số uy tín (OCOP 5 sao, ISO 22000, từ 1997).
- **Heading dạng câu hỏi (GEO):** đặt H2/H3 theo đúng câu người dùng hỏi ("Bột đậu xanh có tác dụng gì?", "Mua bánh đậu xanh ở đâu uy tín?").
- **Quick-answer block đầu trang:** 2–3 câu trả lời trực tiếp ngay dưới H1 (AI ưu tiên trích đoạn "định-nghĩa-trước").
- **Đoạn tự-chứa 134–167 từ:** mỗi mục trả lời trọn vẹn một ý — dễ được AI cắt trích dẫn.
- **Internal link:** anchor giàu ngữ nghĩa, pillar ↔ vệ tinh; tránh "xem thêm" trống nghĩa.

---

## 4. Technical SEO

- **CWV:** đang tốt (Astro). Giữ kỷ luật: ảnh hero eager + `fetchpriority=high`, phần còn lại lazy; tránh layout shift.
- **Ảnh (việc cần làm):** chuyển ảnh sản phẩm mới sang `astro:assets <Image>` để tự sinh AVIF/WebP + `srcset`; đổi tên file sang ASCII (`bot-dau-xanh-ca-rot.jpg`) thay vì có dấu/space; alt mô tả giàu ngữ cảnh (đã có alt cơ bản).
- **Sitemap:** xác nhận 5 landing bột + bài mới đã nằm trong `sitemap-index.xml` (đã build ra); cân nhắc image-sitemap.
- **robots & AI bots:** hiện `Allow: /`. Chủ động **cho phép** GPTBot, ClaudeBot, PerplexityBot, Google-Extended, CCBot (để được AI trích dẫn) — ghi rõ trong `robots.txt`. Kiểm tra CDN/Vercel không chặn user-agent bot AI.
- **Đa ngôn ngữ:** hiện chỉ 1 URL tiếng Việt (Google Translate chạy client-side, **không** tạo URL riêng) → **không** thêm hreflang giả. Nếu sau này làm đa ngữ thật (thư mục `/en/`…) mới thêm hreflang.

---

## 5. Structured data (schema stacking)

Ưu tiên bổ sung, theo thứ tự tác động cho **cả rich result lẫn AI citation**:

1. **FAQPage** — mọi trang có mục hỏi đáp (bài bột mới, landing sản phẩm, trang giới thiệu). *(builder đã có sẵn)*
2. **HowTo** — "cách pha bột" (3 bước). *(cần thêm builder)*
3. **Product + offers** — thêm `offers` trỏ Shopee/TikTok, `brand`, `gtin13`, `nutrition` (landing bột đã có gtin13/nutrition).
4. **ImageObject** cho ảnh sản phẩm chính.
5. **sameAs mở rộng** trong Organization: Facebook (có), + YouTube, Shopee shop, TikTok shop, **Wikidata** (khi tạo).
6. **LocalBusiness** cho 2 showroom (NAP + giờ mở cửa + geo).
7. **Recipe** (nếu ra bài công thức món từ bột/bánh) và **Article `speakable`**.

---

## 6. GEO — Tối ưu AI tìm kiếm (trọng tâm)

> Vì sao gấp: Gartner dự báo **traffic search organic giảm ~25% tới 2026** khi người dùng chuyển sang ChatGPT/Perplexity/Gemini/Copilot. Được **trích dẫn** trong câu trả lời AI trở thành kênh hiện diện mới.

### 6.1 Nguyên tắc GEO 2026 (có kiểm chứng)

- **Câu "định-nghĩa-trước"** (definition-first): mở đầu bằng câu định nghĩa trực tiếp → **+2,1× tỉ lệ được trích dẫn**.
- **Số liệu có nguồn dẫn tên**: thêm thống kê + nguồn → **+40%** khả năng trích dẫn.
- **Heading dạng câu hỏi** + **FAQ theo đúng prompt người dùng**.
- **Đoạn tự-chứa 134–167 từ**, trả lời trọn ý.
- **FAQ/HowTo schema** — nằm trong **top-5 yếu tố dự báo** việc được AI trích dẫn.
- **Freshness 7–14 ngày**: nội dung không cập nhật mất ưu tiên trích dẫn sau ~14 ngày → cần lịch cập nhật.
- **Server-side rendered** (Astro ✓) + **không chặn bot AI** (robots).
- **Trích dẫn bên thứ ba** (báo chí, thư mục, review) tăng độ tin cậy thực thể.

### 6.2 Hành động cụ thể cho Rồng Vàng Hoàng Gia

1. **`llms.txt`/`llms-full.txt` luôn cập nhật** — coi đây là "bản tóm tắt chính thức gửi AI". *(đã refresh — §11)*
2. **Khối "sự thật đáng trích dẫn" (quotable facts)** đặt ở các trang chính, câu ngắn, có số + mốc:
   - "Bánh đậu xanh Rồng Vàng Hoàng Gia là sản phẩm bánh đậu xanh **đầu tiên và duy nhất** cả nước đạt **OCOP 5 sao Quốc gia (2024)**."
   - "Sản xuất từ **1997**, đạt **ISO 22000:2018** (HA 394/2.23.CIV, Quacert, 08/08/2023)."
   - "Tên thương hiệu bắt nguồn từ sắc phong 'Bánh Ngon' của **vua Khải Định năm 1918**."
   - "Xuất khẩu **Nhật, Mỹ, Anh, Hàn, Canada**." · "Bột đậu xanh không đường: đạm tới **22,2 g**/100 g, đường chỉ **17,8 g**."
3. **FAQ + HowTo schema** trên các trang trọng điểm *(bắt đầu ở bài bột mới — §11)*.
4. **Entity SEO** — để AI "hiểu" thương hiệu là một thực thể: tạo **Wikidata item**, hoàn thiện **Google Business Profile**, nhất quán tên/địa chỉ (lưu ý mốc sáp nhập Hải Dương → Hải Phòng), khai báo `sameAs`.
5. **Trích dẫn bên thứ ba**: tận dụng loạt báo đã đưa tin (Chính phủ, VTV, Nhân Dân…); tìm cách được nhắc trong bài "top thương hiệu", thư mục đặc sản, Wikipedia (mục bánh đậu xanh).
6. **Theo dõi hiện diện AI**: định kỳ hỏi thử ChatGPT/Perplexity/Gemini các prompt mục tiêu ("bánh đậu xanh OCOP 5 sao", "bột đậu xanh không đường mua ở đâu") → đo có được nhắc/nêu link không.

### 6.3 KPI riêng cho GEO

- **Mention Rate** — % câu trả lời AI có nhắc tên thương hiệu.
- **Citation Rate** — % câu trả lời AI có link về domain.
- **Position** — vị trí xuất hiện (đầu vs cuối câu trả lời).

---

## 7. Kế hoạch nội dung (lịch biên tập theo cluster)

Tần suất mục tiêu: **1–2 bài/tuần** + cập nhật bài cũ (freshness). Dùng skill `rvhg-content` để giữ brand voice.

**Đợt 1 (ưu tiên — trả lời câu hỏi + cụm bột):**
1. Bánh đậu xanh là gì? Nguồn gốc, cách chọn, cách thưởng thức *(pillar A)*
2. OCOP 5 sao Quốc gia là gì và vì sao quan trọng *(uy tín)*
3. Bột đậu xanh có tác dụng gì? *(pillar B mở rộng)*
4. Mua bánh đậu xanh ở đâu uy tín — chính hãng *(giao dịch)*
5. Đặc sản Hải Dương làm quà biếu *(pillar C)*

**Đợt 2:** so sánh vị bột; cách bảo quản bánh/bột; bánh đậu xanh ăn với gì; quà Tết đặc sản OCOP; đặc sản miền Bắc.

Mỗi bài: 1 câu định-nghĩa-trước + heading câu hỏi + FAQ (kèm schema) + ảnh có alt + link nội bộ + 1 anchor trong 3 anchor thương hiệu.

---

## 8. Off-page · Authority · Local · Entity

- **Backlink/PR:** hệ thống hoá loạt báo đã đưa tin thành trang "Báo chí nói về chúng tôi" (có link out); tiếp cận food blogger, thư mục đặc sản, trang du lịch Hải Dương.
- **Local SEO:** tạo/tối ưu **Google Business Profile** cho 209C Tuệ Tĩnh và 9 Bạch Đằng; NAP nhất quán trên toàn site + sàn; thu thập review; thêm LocalBusiness schema.
- **E-commerce/social:** liên kết 2 chiều với shop Shopee/TikTok; kênh YouTube; nhúng review.
- **Entity:** tạo Wikidata; cân nhắc đóng góp/nguồn cho mục "Bánh đậu xanh" trên Wikipedia (đúng quy tắc, khách quan).

---

## 9. Đo lường & KPI

- **Cài đặt (tuần 1):** GA4 (`PUBLIC_GA_ID`), Google Search Console (verify + submit `sitemap-index.xml`), Bing Webmaster, khai báo trong `BaseLayout.astro` (đã có chỗ chờ).
- **KPI SEO:** impressions/clicks/vị trí theo 3 cụm; số trang được index; CWV (LCP/INP/CLS) qua CrUX.
- **KPI GEO:** Mention Rate, Citation Rate, Position (thủ công hoặc công cụ như llmrefs/Otterly/Peec).
- **Nhịp:** báo cáo tháng; rà freshness 2 tuần/lần.

---

## 10. Roadmap ưu tiên

**Quick wins — tuần 1** *(một phần đã làm, §11)*
- [x] Refresh `llms.txt` (sản phẩm/bài mới, bỏ số liệu lỗi thời)
- [x] FAQ schema (bắt đầu ở bài bột mới) + cơ chế tái sử dụng
- [ ] Cài GA4 + Search Console + Bing, submit sitemap
- [ ] `robots.txt`: khai báo cho phép bot AI (GPTBot, ClaudeBot, PerplexityBot, Google-Extended…)
- [ ] Rà soát title/description trang chính theo công thức §3
- [ ] Tạo Google Business Profile 2 showroom

**30 ngày**
- [ ] HowTo schema "cách pha"; Product `offers`; ImageObject
- [ ] Chuyển ảnh mới sang `<Image>` AVIF/WebP + đổi tên ASCII
- [ ] Bài trụ "Bánh đậu xanh là gì" + "Bột đậu xanh có tác dụng gì" + quick-answer/FAQ
- [ ] Khối "quotable facts" trên trang chủ & giới thiệu

**60 ngày**
- [ ] 5–8 bài theo cluster (Đợt 1 + 2); internal linking hoàn chỉnh
- [ ] Wikidata item; LocalBusiness schema; thu review
- [ ] Đo GEO lần 1 (mention/citation trên ChatGPT/Perplexity)

**90 ngày**
- [ ] Mở rộng cluster "đặc sản/quà tặng"; tối ưu theo dữ liệu GSC + GEO; lặp

---

## 11. Đã triển khai ngay trong đợt này

- **`public/llms.txt` được viết lại**: cập nhật dòng bột ("Bột đậu các loại" + 6 vị mới + link 5 landing), thêm bài viết mới, bỏ số "28 năm" (dễ lỗi thời) thay bằng "từ năm 1997", bổ sung khối "sự thật đáng trích dẫn" cho AI.
- **Cơ chế FAQ/HowTo schema tái sử dụng cho bài viết**: thêm trường `faq` và `howTo` vào schema `posts`; `PostLayout` tự sinh **FAQPage** + **HowTo** JSON-LD; áp dụng cho bài *"Bột đậu xanh pha sẵn…"* (mục hỏi đáp + cách pha) → sẵn sàng cho AI trích dẫn và rich result của Google.

---

## Nguồn tham khảo (GEO 2026)

- [Generative Engine Optimization Best Practices 2026 — GenOptima](https://www.gen-optima.com/geo/generative-engine-optimization-best-practices-2026/)
- [Mastering Generative Engine Optimization in 2026 — Search Engine Land](https://searchengineland.com/mastering-generative-engine-optimization-in-2026-full-guide-469142)
- [GEO: The 2026 Guide to AI Search Visibility — LLMrefs](https://llmrefs.com/generative-engine-optimization)
- [GEO vs. SEO 2026 — WordStream](https://www.wordstream.com/blog/generative-engine-optimization)
