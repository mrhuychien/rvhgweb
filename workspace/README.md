# workspace/ — Phase 1 (Clone & Inventory)

This folder holds the Phase-1 migration artifacts described in the blueprint
(§3 — Clone & Inventory). Phase 1 was completed in a local session on
2026-05-13.

## What's here

- `clone/` — full `wget --mirror` of `rongvanghoanggia.com` (122 HTML files,
  125 MB; includes wp-content plugin assets pulled by `--page-requisites`).
- `images/legacy/` — 568 unique image files harvested from the mirror
  (every variant of every WP upload), flat-named.
- `content-raw/` — 121 markdown files (turndown + cheerio) extracted from
  the mirror, organised by content type (page / post / product /
  product_category / policy / home).
- `inventory/` — CSVs and JSON audit artifacts:
  - `urls.csv` — 110 row, every discoverable URL mapped to a new Astro route
    plus build status (`built` = already in `src/`, `discovered` = mirror
    found it, content extracted under `content-raw/` but no Astro route yet).
  - `images.csv` — 569 row, every harvested image with filename, size, usage
    count, alt text, and `in_public_legacy` flag.
  - `legacy-refs.json` — every `/images/legacy/<filename>` reference inside
    `src/` and `public/` (the build's contract).
  - `image-usage.json`, `image-urls.txt`, `image-download.json` — raw data
    from the URL extraction and download passes.
  - `swap-audit.json` — record of which WP file was copied under which
    placeholder name.
  - `post-ingest.json` — list of new posts copied from `content-raw/` to
    `src/content/posts/` with their resolved publishDate / description.
- `scripts/` — self-contained Node scripts used to produce everything above.
  Re-runnable if the upstream WordPress changes. Install: `npm install
  --prefix workspace/scripts`.

## Phase-1 acceptance gate (blueprint §3.3)

- ✅ `urls.csv` has ≥ 20 rows (current: 110).
- ✅ HTTP status logged by wget (`workspace/clone/wget-mirror.log`).
- ✅ `content-raw/` has a `.md` for every URL.
- ✅ Random spot-check `.md` files: content sound, WP wrappers stripped.
- ✅ `workspace/images/legacy/` has ≥ 100 files (current: 568).
- ✅ Brand assets from blueprint T1.5 all present
  (`logo-web-120x120.png`, `cropped-logo-web-270x270.png`, `th300-web.jpg`,
  `tx300-web.jpg`, `sr300-web.jpg`, `hop-5-sao-web.jpg`,
  `catalogue24-15-2.png`, `banh-dau-xanh-hop-tre-cao-cap-rong-vang-hoang-gia.jpg`,
  `bx-web.jpg`, `cd-web.jpg`, partner + media logos).
- ✅ `images.csv` complete, 0 entries with HTTP 404.

## Re-running Phase 1 from scratch

```bash
# 1. Mirror the live site
mkdir -p workspace/clone && cd workspace/clone
wget --mirror --convert-links --adjust-extension --page-requisites \
     --no-parent --wait=0.5 --random-wait \
     --reject-regex='(/wp-admin/|/wp-login\.php|/feed/?|\?p=|/cart/?|/checkout/?|/my-account/?|/\?s=|/attachment/|/author/|/comments/)' \
     --user-agent="Mozilla/5.0 (compatible; RVHGMigration/1.0)" \
     https://www.rongvanghoanggia.com/

# 2. Run the Node scripts (in order)
cd ../..
npm install --prefix workspace/scripts
node workspace/scripts/extract-image-urls.mjs
node workspace/scripts/download-images.mjs
node workspace/scripts/legacy-refs.mjs
node workspace/scripts/swap-placeholders.mjs
node workspace/scripts/extract-content.mjs
node workspace/scripts/ingest-posts.mjs
node workspace/scripts/copy-referenced-images.mjs
node workspace/scripts/cleanup-ingested-posts.mjs
node workspace/scripts/build-inventory.mjs

# 3. Build + verify
pnpm build
grep -rn wp-content dist/   # should only match dist/images/legacy/README.md
```
