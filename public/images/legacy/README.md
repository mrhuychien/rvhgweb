# public/images/legacy/

Images mirrored from the original `rongvanghoanggia.com/wp-content/` go here
(Phase 1, T1.4 / T1.5). The Astro site references them by these exact
filenames — see `src/content/**` and `src/data/site.ts` (ASSETS).

## ⚠️ Current files are placeholders

The files committed here now are **lightweight SVG-based placeholders**
generated with `sharp` (the live WordPress site was network-unreachable in the
build environment — see `workspace/README.md`). Replace each one with the real
asset of the **same filename**, then run `pnpm build`.

When you bring in the real, high-resolution images, consider moving them to
`src/assets/images/legacy/` and switching `LegacyImg.astro` to Astro's
`<Image />` component (ESM import) to get automatic AVIF/WebP + responsive
`srcset`. Cache headers for `/images/**` are already set in `vercel.json`.

## Expected key assets (from blueprint T1.5)

- `logo-web-120x120.png`, `cropped-logo-web-270x270.png`, favicon
- `th300-web.jpg` (bánh đậu xanh thượng hạng), `tx300-web.jpg` (trà xanh),
  `sr300-web.jpg` (sầu riêng), `hop-5-sao-web.jpg` (hộp quà OCOP),
  `catalogue24-15-2.png` (MIX), `banh-dau-xanh-hop-tre-cao-cap-rong-vang-hoang-gia.jpg`,
  `bx-web.jpg` (bột đậu xanh), `cd-web.jpg` (chè đậu đen cốt dừa),
  `banh-chung-vang-web.jpg`
- partner / siêu thị logos, media / báo chí logos (see blueprint T1.5)
