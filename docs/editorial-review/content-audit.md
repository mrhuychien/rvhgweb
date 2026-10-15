# Editorial review — 15 October 2026

## Completed article scope

All 72 articles have revised Vietnamese prose, titles, descriptions, SEO titles and FAQs. Publication dates, slugs, original URLs and draft flags are unchanged. Already-dated articles carry updated: 2026-10-15. Seventeen future articles remain scheduled for 16 October through 29 December 2026.

Final checks found no shared contiguous prose sequence of 25 normalized words after removing link destinations and HTML tags. This exact-text result does not imply every topic is conceptually unique. Draft-process phrasing flagged in the archival price, press-release, recipe, health and history articles was polished; explicit dated factual corrections remain.

Health copy no longer invents product calories, treatment benefits, universal suitability or beauty effects. Ingredient nutrition is distinguished from finished products. Recipe articles explain principles rather than pretending an incomplete source is a tested quantitative recipe; a tested recipe remains a possible future content improvement.

## Chronology requiring editorial approval

- Original bánh đậu xanh: decision 2171/QĐ-BNN-VPĐP dated 04/07/2024.
- Trà xanh and sầu riêng: decision 2361/QĐ-BNNMT dated 26/06/2025.
- The joint trà xanh/sầu riêng announcement carries an original 20/11/2024 article date. That date is preserved, with an explicit 15/10/2026 correction rather than silently treating 2025 facts as known in 2024.
- The June2024 press item distinguishes evaluation from the later formal decision. The showroom archive retains its original date and adds the verified 12/10/2024 event date in a dated update.
- The 1918 royal story is identified as tradition, not verified corporate history.

## Separate unresolved global copy: outside article-edit scope

Do not silently expand the rewrite into these objects. Obtain the appropriate scope decision and update the source-of-truth objects together with affected renderers when authorized.

### P1 — Site-wide uniqueness and historical claims contradict revised posts

- `src/data/site.ts:9` — `SITE.shortDescription` says “sản phẩm bánh đậu xanh duy nhất đạt OCOP 5 sao Quốc gia 2024” and attributes production to the legal company “từ 1997”. Use the evidenced product/year milestone; distinguish brand origins in 1997 from company registration in 2003 if mentioning both.
- `src/data/site.ts:38` — `COMPANY.ocop` says “đầu tiên và duy nhất”. Replace with product-specific year/decision without present exclusivity.
- `src/data/site.ts:148` — OCOP `REASONS` says the unique product was “được Chính phủ công nhận”. Use the actual decision and issuing authority rather than conflating the reporting government portal with the issuer.
- `src/data/site.ts:215` — `ANCHORS.ocop5Sao` repeats nationwide first/only in 2024. Use the substantiated product/date statement.
- `src/data/site.ts:140` — `REASONS` asserts a directly transmitted recipe from royal-offering artisans. This is an unsupported genealogy claim, not merely sensory prose. Supply evidence or remove/recast as a clearly identified tradition/giai thoại.
- `src/data/site.ts:213` — `ANCHORS.khaiDinh1918` treats the royal title and seal as established history. Qualify as brand/folk legend rather than a verified record.

### P2 — Health assurance, ISO terminology and unsupported scale

- `src/data/site.ts:136`: “nguyên liệu chất lượng cao nhất… đảm bảo sức khoẻ.” Avoid the unsubstantiated superlative and blanket health assurance. Describe documented sourcing/selection instead.
- `src/data/site.ts:144`: calls ISO 22000 a “hệ thống quản lý chất lượng”. Use “hệ thống quản lý an toàn thực phẩm”, consistent with the certificate and `COMPANY.isoFull`.
- `src/data/site.ts:163–164`: “Hàng triệu khách hàng” needs a dated source or a less numerical statement.
- `src/data/site.ts:217`: “Toàn bộ quy trình sản xuất đạt chứng nhận…” is less precise than the certificate's named organization, scope and dates. Prefer the exact food-safety-management scope already correctly recorded in `COMPANY.isoFull`.

`COMPANY.isoFull` and `COMPANY.iso` match the inspected certificate's 2026 number, dates and scope. Do not revert them to the stale skill's 2023 certificate. `COMPANY.exportMarkets` lists six countries, while one `REASONS` paragraph names five as examples; this is not inherently contradictory unless written as an exhaustive total.

## Evidence anchors used for QA

- Government consolidated OCOP list: https://xaydungchinhsach.chinhphu.vn/danh-sach-san-pham-ocop-5-sao-119260408171050959.htm — base bánh đậu xanh: 2171/QĐ-BNN-VPĐP, 04/07/2024; trà xanh/sầu riêng: 2361/QĐ-BNNMT, 26/06/2025.
- Inspected repository certificate image: `public/images/chung-nhan/iso-22000-2026.jpg` — QUACERT HA 394/4.26.CIV; printed validity 08/08/2026–07/08/2029; scope sản xuất bánh đậu xanh, bột đậu uống liền. Image inspection confirms the printed document, not a live registry-status check.
- ISO explanation: https://www.iso.org/insights/iso-22000-explained — food-safety management, distinct from a nutrition or medicinal claim.

## Verification and limits

- Production-date full verification passed at PUBLIC_PUBLISH_AS_OF=2026-10-15: 79 generated pages, 80 checked HTML files, 17 scheduled posts excluded, zero dead internal links under both Pages and Vercel redirect rules.
- Future-date full verification passed at PUBLIC_PUBLISH_AS_OF=2026-12-31: 96 generated pages, 97 checked HTML files, all scheduled posts included, zero dead internal links.
- Metadata, cover files, attribution fields and git whitespace validation passed. Detailed reports accompany this review.
- Browser visual QA was blocked by the cloud browser URL policy and shell browser sandbox. No claim of responsive/browser rendering approval is made. The four-page PDF reading proof was rendered and visually inspected separately.
- Nothing has been committed, pushed, published or deployed. Site-wide copy listed above requires a scope decision before changes outside these articles.
