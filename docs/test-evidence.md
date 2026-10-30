# Test evidence

Record observed behavior, not just a test-first intention. Setup failures do not
count as a behavior red. PRs should summarize the relevant entries concisely.

## Foundation — 2026-10-30

- Security red: `node --test tests/unit/security.test.ts` ran seven tests against
  existing but incomplete `_headers`/`robots.txt` files. All seven failed on the
  intended absent security/indexing directives.
- Security green: the same command passed 7/7 after adding those directives.
- Browser red: `npm run test:e2e -- --project=chromium --grep "stays out"` loaded
  the real built page and failed because its `meta[name="robots"]` was absent.
- Browser green: added the draft meta policy; the full suite passed 10/10 across
  Chromium, Firefox, WebKit, Android Chrome viewport, and iPhone Safari viewport.
- Final local `npm run verify`: formatting, ESLint, Astro/TypeScript (zero
  diagnostics), 7 unit tests, production build, and all 10 browser tests passed.
- Dependency installation audit reported zero known vulnerabilities.
- Tooling issues, not test reds: Astro's agent-auto-background behavior was resolved
  using its built-in foreground-compatible flag; the Firefox/macOS profile issue
  was resolved using a fresh isolated application home. See `operations.md`.
- Not verified: deployed Cloudflare response headers, manual screen reader use,
  physical phones, clinical wording approval, or an actual enrollment system.

## Bilingual experience — 2026-10-30

- Red: localized-home acceptance test received HTTP 404 before the English/Hebrew
  routes existed.
- Added regression red: the research-theme link failed to reach `:target` because
  a locale helper appended a slash to its fragment. Appending the fragment after
  generating the page URL fixed the real navigation issue.
- Green: 50 browser tests passed across all five projects, plus the seven existing
  security tests, lint/format/type checks, and the production build.
- Tests cover language-preserving links, native mobile disclosure navigation,
  platform-appropriate keyboard skip links, navigation with JavaScript disabled,
  320/768/1440px overflow checks, and automated WCAG-tagged accessibility checks.
- Visually inspected English desktop, Hebrew desktop, and Hebrew mobile rendered
  screenshots. Snapshot inspection reported no page or network errors.
- No institutional photos/logos are used. IBM Plex fonts are self-hosted with
  their license; provenance is recorded in `third-party.md`.
- Publishing/remote CI remain pending by the owner's choice. No feature PR was
  created or merged after the workflow-scope refusal.

## Structured study discovery — 2026-10-30

- Content-validation red: 12 safety cases failed against the initial permissive
  schema, including missing translations, incorrect registry links, unsupported
  status claims, unapproved recruitment, and unexpected personal-data fields.
- Content-validation green: strict Astro/Zod validation now rejects those cases,
  also checks source-date ordering, and accepts both source-backed study records.
- Journey red: participant discovery failed because the structured study card did
  not exist. Green: listing -> dated detail -> source/pending-enquiry explanation
  works in both languages, including same-study language switching.
- Visual regression red: a narrow Hebrew study heading did not isolate its English
  acronym. Green: a shared native `bdi` rendering preserves the acronym on one line
  without horizontal overflow, using the source record rather than hardcoded copy.
- Final local `npm run verify`: zero formatting/lint/type diagnostics, **21 unit
  tests and 90 browser tests passed**, with no skipped tests.
- All 22 localized pages were checked across five browser/device projects for
  metadata, heading structure, duplicate IDs, internal links/fragments, narrow/wide
  overflow, no executable JavaScript/forms, third-party rendering requests, and
  automated accessibility. The root language page and bilingual 404 have separate
  coverage. Desktop and mobile study screenshots were inspected visually.
- Production output: 24 HTML pages, zero JavaScript files, about 14 KB CSS, and
  268 KB of total self-hosted font files (loaded as needed).
- A clean `npm ci` completed successfully and reported zero known vulnerabilities.
- Still pending: Linux/remote CI, Cloudflare response-header verification, real
  devices/screen readers, actual patient/clinician usability sessions, approved
  medical/translation copy, and an institution-approved enquiry service.

## Reference-led redesign — 2026-10-30

- Owner-approved references: Sarvestani Lab and Ranade Lab. The rejected visual
  and copy patterns are now recorded in `AGENTS.md` and the project brief.
- Red: the root-home acceptance test loaded the former language-selection page
  and failed on its name-only heading instead of the requested research homepage.
- Green: the root and localized routes now share a factual bilingual homepage.
  New acceptance checks cover five consistent navigation destinations, early
  study access, removed slogan/panel patterns, and equivalent Hebrew content.
- Final `npm run verify`: formatting, ESLint, Astro/TypeScript, **21 unit tests,
  and 110 Playwright checks passed**, with no skipped checks.
- Visually reviewed updated English/Hebrew desktop homepages, the Hebrew mobile
  page, and a representative study detail page. Refined heading density, removed
  repeated introductory copy, and corrected the illustration before this review.
- The site still generates 24 static HTML pages and zero JavaScript files.
  CSS totals 16,990 bytes; the retained self-hosted font files total 108,104 bytes.
  No rendering errors or failed local asset requests appeared during capture.
- The assessment illustration is original explanatory SVG, not a borrowed lab
  asset, participant portrait, clinical instruction, or research measurement.
- Existing study records, disabled enquiry routes, noindex/security configuration,
  and the owner's local-only publishing decision are unchanged.
- A passing suite is not visual approval. This iteration remains a design draft
  for owner review; all manual, clinical, hosting, and publishing gates still apply.
