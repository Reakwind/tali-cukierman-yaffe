# Website architecture

Updated 2026-11-04, when the earlier Astro draft was retired.

## The published site

| Layer   | Choice                                                    | Where                                       |
| ------- | --------------------------------------------------------- | ------------------------------------------- |
| Pages   | One page per language, plain HTML, CSS and a small script | `prototype/index.html`, `prototype/he.html` |
| Build   | A Node script, no framework                               | `scripts/prototype.ts`, `scripts/site.ts`   |
| Hosting | Cloudflare Workers Static Assets, Worker `diabetes-360`   | `wrangler.json`                             |
| Deploy  | Cloudflare's Git integration builds and deploys `main`    | Cloudflare dashboard                        |

`he.html` holds only the Hebrew words. The build takes fonts, styles, the
painting, the script and the English publication list from `index.html`, so the
two pages never drift apart.

`npm run build` writes `dist/site`:

- `index.html` and `he.html`, served at `/` and `/he`.
- `images/<name>.<hash>.<ext>`: each image once, named by its content, so both
  pages share it and browsers can cache it for a year.
- `404.html`: a short bilingual page back to both home pages, served for any
  unknown address (`not_found_handling` in `wrangler.json`).
- `robots.txt` and `_headers`: no indexing until launch, and security headers.
  The Content-Security-Policy admits only the pages' own inline style and
  script, by hash computed at build time, plus Google Fonts and the site's own
  images. A page edit cannot break the policy, because the hashes are
  recomputed on every build.

`npm run prototype:build` writes the same pages with images inlined, for the
owner's review in the artifact host, which blocks external images.

There is no server code, form, email, database, account, analytics or
clinical-data workflow.

## Tests

- `tests/unit/`: the build output (files, headers, hashes, robots, 404), the
  page content rules, the Hebrew page, CI and tooling, git safety and the
  cloud session setup.
- `tests/e2e/site.spec.ts`: the built site served by `wrangler dev`, which
  reproduces Cloudflare's headers, redirects and 404 handling. Links, images,
  language and direction, policy violations, overflow and automated
  accessibility checks, on five browser projects.
- `tests/e2e/prototype-*.spec.ts`: layout, scrolling and the Hebrew page.

## Participant enquiries

Not active. The retired Astro draft included an enquiry Worker
(`POST /api/participation`, Cloudflare email to fixed team addresses, Turnstile
spam protection), never deployed. Its code and its setup plan can be
recovered from commit `d3e5b5b`
(`git show d3e5b5b:docs/architecture.md`). Follow `registration-plan.md`
before any enquiry route is built: it needs an approved destination and
reviewed participant information in both languages.

## Primary references

- [Workers Static Assets](https://developers.cloudflare.com/workers/static-assets/)
- [Static asset headers](https://developers.cloudflare.com/workers/static-assets/headers/)
- [Not-found handling](https://developers.cloudflare.com/workers/static-assets/routing/static-site-generation/#custom-404-pages)
- [Content-Security-Policy hashes](https://developer.mozilla.org/docs/Web/HTTP/Headers/Content-Security-Policy/script-src#unsafe_hashes)
