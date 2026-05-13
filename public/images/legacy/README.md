# public/images/legacy/

Images mirrored from the original `rongvanghoanggia.com/wp-content/uploads/`
go here (Phase 1, T1.4 / T1.5). The Astro site references them by these
exact filenames — see `src/content/**` and `src/data/site.ts` (ASSETS).

## Status: REAL images (no more placeholders)

The 23 placeholder filenames that the Astro project references have been
replaced with the matching WordPress images. For 13 of them the placeholder
name was synthetic (e.g. `cat-tet.jpg`, `hero-home.jpg`) — the source WP
filename is recorded in `workspace/inventory/swap-audit.json`.

Additionally, 23 WP-named images referenced by the newly-ingested posts
(e.g. `36252859720_9028188217_3k-3.jpeg`, `image-1.png`) have been copied in.

Total file count: 47.

## Future polish

Several PNG content files were copied under a `.jpg` extension to match
the existing placeholder reference (browsers still render fine, but the
MIME type returned by Vercel will be `image/jpeg`). If you want strict
ext/MIME alignment, re-encode them with `sharp` before deploy.

For automatic AVIF/WebP + responsive `srcset`, consider moving these
files to `src/assets/images/legacy/` and switching `LegacyImg.astro`
to Astro's `<Image />` component (ESM import). Cache headers for
`/images/**` are already set in `vercel.json`.
