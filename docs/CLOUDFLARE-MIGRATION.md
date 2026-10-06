# Cloudflare Pages migration

## Architecture

The website is Astro 5 static output (`dist/`). Markdown, responsive WebP images,
Open Graph images, sitemap and `llms-full.txt` are generated at build time.
No website runtime Worker, OpenNext adapter, database or paid service is needed.
The existing `rvhg-cms-auth.mrhuychien.workers.dev` OAuth relay remains separate.
Do not redeploy it or recreate its GitHub credentials for this migration.

The production origin is **https://rongvanghoanggia.com** (apex). Astro's site,
shared SEO data, robots sitemap URL and llms links use this origin. Historical
`oldUrl` metadata remains unchanged. Preview hosts also canonicalize to production;
`_headers` adds `X-Robots-Tag: noindex` to Pages hostnames.

## Reproducible validation

Use Node 22 and pnpm 10.34.6 (pinned in `package.json`). Vercel's current Node 24
also meets `engines.node`; keep its existing project until cutover is verified.

```sh
pnpm install --frozen-lockfile
pnpm verify
pnpm pages:preview
# In another terminal, with the Pages local server running:
pnpm pages:smoke
# Or verify an uploaded build:
pnpm pages:smoke https://<deployment>.<project>.pages.dev
```

`verify` builds images and Astro, checks internal links independently for both
Pages and Vercel, checks Pages file limits and 404 output, verifies apex SEO,
and checks that draft/future posts stay unpublished. `pages:smoke` checks the
actual HTTP server: all 118 redirect variants, representative routes including
CMS, cache/security/PDF headers, 404, slash normalization and redirect chains.
The existing CI workflow runs both checks and a local Wrangler server.

`vercel.json` remains the shared legacy redirect source and Vercel fallback
configuration. After editing its redirects, run `pnpm redirects:sync` and commit
`public/_redirects`. The build rejects stale generated rules. Permanent redirects
retain Vercel's HTTP 308 semantics. Static rules precede dynamic rules and include
slashless legacy paths; existing directory routes gain slashes through Pages.

`public/_headers` preserves security and asset cache policy. CSS/JS rules are
limited to `/_astro/` and image/font rules use extensions to avoid duplicate
Cache-Control values. HTML and text retain Pages' normal revalidation behavior.

On Windows, the historical `workspace/content-raw/` archive contains three
filenames with `?`, which cannot be checked out. Use a sparse checkout excluding
that archive. The migration checkout does not remove or rename these Git files.
The archive is not an input to the production build.

## Temporary preview

Use a separate **rvhgweb-preview** project with Direct Upload, on the existing
Free account. Upload only the contents of `dist/`, never the repository, `.env`,
`.git` or local tooling. Dashboard uploads allow at most 1,000 files and 25 MiB per
file; Wrangler allows 20,000 files on Free. Check the actual output before upload.
Do not attach custom domains to this temporary project.

Validated preview (2026-10-06): https://rvhgweb-preview.pages.dev and immutable
deployment https://20559cf2.rvhgweb-preview.pages.dev. The uploaded build contains
856 files / 79 HTML pages; largest asset 4.74 MiB. Pages and Vercel link checks,
apex SEO checks, 18 unpublished-post exclusions and the complete HTTP smoke test
passed. Browser inspection found no failed loaded images or console errors.

A Direct Upload project cannot be converted to Git integration. Keep the
production project name **rvhgweb** available for a Git-connected project.
Do not create API tokens or authorize Wrangler solely for a dashboard upload.

## Production project (after approval)

1. Review the migration diff and obtain approval before updating `main`
   (Vercel deploys pushes to its production branch).
2. Create a separate Git-integrated Pages project for `mrhuychien/rvhgweb`.
   Review existing Cloudflare GitHub access first. If new access is required,
   request approval for **only this repository**, not all repositories.
3. Configure the build:

   | Setting | Value |
   | --- | --- |
   | Framework | Astro |
   | Root | repository root |
   | Production branch | `main` |
   | Build command | `pnpm build` |
   | Output directory | `dist` |
   | `NODE_VERSION` | `22` |
   | `PNPM_VERSION` | `10.34.6` |

4. Public analytics variables, if used: `PUBLIC_GA_ID`, `PUBLIC_FB_PIXEL`.
   `PUBLIC_SITE_URL` exists in Vercel's environment list but this source uses the
   committed production origin, so do not copy secrets unnecessarily.
   **Leave `PUBLIC_PUBLISH_AS_OF` unset in production**; it is a preview override
   that can publish future articles early or freeze publishing at a past date.
5. Test the Pages URL and CMS login with the existing OAuth relay. A CMS save
   commits to `main`, so test editing only with explicit approval and a planned
   harmless change. Do not rotate or reveal existing OAuth secrets.

## Scheduled publishing

The workflow runs daily at 00:00 UTC (07:00 Vietnam time), rebuilding static
output so future-dated posts become visible. It calls each configured provider
independently. Missing hooks produce a visible warning; failed calls fail the job.

After approval, create a Pages deploy hook targeting the production branch and
enter its URL directly as the GitHub Actions repository secret
`CLOUDFLARE_PAGES_DEPLOY_HOOK`. The hook is a credential: never paste it into chat,
logs or source. Keep `VERCEL_DEPLOY_HOOK` configured during the rollback period.
Neither hook nor GitHub permission is created by the code changes alone.

After merging, manually dispatch the workflow once and verify **both** deployment
results. A 2xx hook response confirms only that a build was requested. Confirm the
next scheduled run and a due post on the live site before considering the move done.

## Domain cutover and rollback (separate approval)

Observed on 2026-10-06: Cloudflare zone uses Full DNS setup and Free plan.
The apex record is CNAME `55f9b822042b876d.vercel-dns-017.com`, DNS only, TTL 600.
The `www` record is CNAME `rongvanghoanggia.com`, proxied, TTL Auto.
Assigned nameservers: `kallie.ns.cloudflare.com`, `melnicoff.ns.cloudflare.com`.
The zone also contains Zoho mail records, SPF, DKIM, DMARC, service-verification
TXT records and another application subdomain. Preserve all unrelated records.

Before cutover, export/record the current DNS and redirect configuration and
verify authoritative nameservers. Keep the existing Vercel deployment and its
domain attachments active. Use the Pages **Custom domains** workflow to attach
the apex and `www` to the production Pages project; do not point DNS at Pages
without registering the domains with the project. Review the proposed DNS changes
and request confirmation immediately before applying them.

Keep a host redirect from `www` to `https://rongvanghoanggia.com`, preserving path
and query. Inspect existing Cloudflare redirect rules first so it is not duplicated
or replaced by an opposite redirect. `_redirects` does not implement host redirects.
No nameserver move is expected because the zone already uses Cloudflare, but verify
that state before any change. Check certificates and HTTPS on both hostnames.

After cutover test home, product/category, post, PDF, CMS, sitemap, old product URLs,
404, canonical, www redirect and analytics. If the site or certificate fails, restore
the apex CNAME, proxy mode and TTL recorded above, keep `www` behavior intact and
verify requests again reach the retained Vercel deployment. Do not delete Vercel
until the user separately approves retirement after a stable monitoring period.

## Official references

- [Astro on Pages](https://developers.cloudflare.com/pages/framework-guides/deploy-an-astro-site/)
- [Redirect syntax and limits](https://developers.cloudflare.com/pages/configuration/redirects/)
- [Headers and duplicate-value behavior](https://developers.cloudflare.com/pages/configuration/headers/)
- [Direct Upload and Git integration limitation](https://developers.cloudflare.com/pages/get-started/direct-upload/)
- [Pages limits](https://developers.cloudflare.com/pages/platform/limits/)
- [Deploy hooks](https://developers.cloudflare.com/pages/configuration/deploy-hooks/)
- [Custom domains](https://developers.cloudflare.com/pages/configuration/custom-domains/)
