# workspace/ — Phase 1 (Clone & Inventory)

This folder holds the Phase-1 migration artifacts described in the blueprint
(§3 — Clone & Inventory).

## ⚠️ Status: PARTIAL — network-blocked

This Astro rebuild was scaffolded in an environment **without outbound network
access to `rongvanghoanggia.com`** (the host is on a deny-list — `wget`/`curl`
to the live WordPress site returns `403 host_not_allowed`). Therefore the
Phase-1 steps that require fetching the live site could **not** run here:

- **T1.1** `wget --mirror …` of the live site — NOT done (blocked).
- **T1.3** turndown/cheerio HTML→Markdown extraction from the mirror — NOT done.
- **T1.4 / T1.5** downloading the real images from `wp-content` — NOT done.
  The files currently in `public/images/legacy/` are **lightweight SVG-based
  placeholders** generated locally with `sharp`, named to match the asset list
  in the blueprint (logo, product hero shots, category heroes, post covers).
- **T1.6** redirect map — not needed; routing is 1:1 (see `inventory/urls.csv`).

What **was** done instead: the URL inventory (`inventory/urls.csv`) was built
from the blueprint's confirmed URL list (Appendix A), and all content was
authored from the business context in the blueprint so the Astro site is fully
functional and buildable today.

## TODO when run on a machine with access to the live site

1. Mirror the live site:
   ```bash
   mkdir -p workspace/clone && cd workspace/clone
   wget --mirror --convert-links --adjust-extension --page-requisites \
        --no-parent --wait=1 --random-wait \
        --user-agent="Mozilla/5.0 (compatible; RVHGMigration/1.0)" \
        https://www.rongvanghoanggia.com/
   ```
2. Recursively pull every image:
   ```bash
   mkdir -p workspace/images/legacy
   wget --no-parent --recursive --level=inf \
        --accept jpg,jpeg,png,webp,gif,svg,ico \
        --directory-prefix=workspace/images/legacy --no-directories \
        --execute robots=off \
        https://www.rongvanghoanggia.com/wp-content/uploads/
   ```
3. Parse `<img src>` / `srcset` / CSS `background-image` from the mirrored HTML
   (cheerio) and download anything missed.
4. Replace the placeholders in `public/images/legacy/` with the real files
   (keep the same filenames — content + components reference them by name).
5. Refresh `inventory/urls.csv` and add `inventory/images.csv` from the actual
   crawl, then re-run `pnpm build` and spot-check.
6. Compare the rebuilt page content against the WP originals and fill any gaps.

## Files here

- `inventory/urls.csv` — old URL → new route map, content type, build status.
- `content-raw/` — (empty) would hold raw HTML→MD extraction from the mirror.
