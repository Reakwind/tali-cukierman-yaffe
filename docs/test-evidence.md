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

## Team profiles — 2026-10-31

- Red (`npm run test:e2e -- --project=chromium tests/e2e/team.spec.ts`): four of
  six new behavior tests failed against the placeholder group page — the roster
  names (EN/HE), the four expected portraits (found 0), and the mixed-direction
  `<bdi>` isolation were all absent. The no-contact and axe guard tests passed.
- Green: the bilingual six-person roster with sourced bios renders on the group
  page; four real portraits load with bilingual alt text and visible credits;
  `GRACE-780G`/`STAY-STRONG` are isolated inside localized prose; no contact
  details or forms appear; axe reports no violations in either language.
- A first cross-browser run exposed a test-timing flaw: lazy portraits were
  asserted before loading on non-Chromium engines. The assertion now scrolls each
  portrait into view and waits for decode; the images themselves were never broken.
- Final `npm run verify`: formatting, ESLint, Astro/TypeScript, **25 unit tests,
  and 140 Playwright checks passed** across Chromium, Firefox, WebKit, mobile
  Chrome, and mobile Safari — no skipped checks.
- Visually reviewed the rendered group page on English desktop, Hebrew desktop,
  and Hebrew mobile. Portraits were identity-checked against official photos
  before use (documented in `third-party.md`).
- Content remains draft: profiles and portraits await each person's review;
  photo permissions, credits, and higher-resolution originals remain launch gates.
  No contact details or recruitment routes were added; publishing is local-only.

## UX refinement — 2026-10-31

- Red: 8 of the updated/new behavior tests failed against the previous build —
  new nav labels, audience utility shortcuts, team-page deduplication, home
  routing strip, sticky header, smooth scrolling, and slim footer were all absent.
  (Two reds initially included one strict-mode test-mechanics fix and one missing
  `t.audience` index; the behaviors themselves were genuinely unimplemented.)
- Green: nav separates four content destinations (Studies · Research · Team ·
  Publications) from always-visible audience shortcuts (About participation ·
  For clinicians), also grouped in the mobile menu; the Team page no longer
  repeats institutional-role or 6 Vital copy (6 Vital now lives only under
  Research); the homepage routes onward via `#home-team` and `#home-routes`
  instead of duplicating the team page; the header is sticky; anchor jumps scroll
  smoothly and revert to instant under reduced motion; the footer keeps only
  support links.
- Final `npm run verify`: formatting, ESLint, Astro/TypeScript, 25 unit tests,
  and **170 Playwright checks passed** across Chromium, Firefox, WebKit, mobile
  Chrome, and mobile Safari.
- Visually reviewed the English desktop and Hebrew mobile homepages. Navigation,
  content, and publishing state otherwise unchanged: still a local, non-indexable
  draft with enquiries disabled.

## Fluid desktop canvas — 2026-10-31

- Owner report: content looked "narrow like built for mobile" in desktop Chrome.
  Diagnosis (measured, not guessed): at 1920px viewports the fixed 1140px
  container left ~390px empty margins per side, so desktop screens rendered a
  narrow strip; mobile/tablet widths were already fluid in Chromium and WebKit.
- Red: "wide desktop screens use the full canvas" failed (container 1140px,
  long-form column clinging to one edge). A no-overflow sweep across
  320/390/768/1024/1440/1920px passed before and after.
- Green: the container is fluid up to 1320px with balanced gutters, long-form
  article columns are centered inside the canvas, and the homepage headline
  scales up on large screens. Verified visually at 1920px (Chrome/WebKit),
  1440px (WebKit), and 390px mobile.
- Final `npm run verify`: formatting, ESLint, Astro/TypeScript, 25 unit tests,
  and **180 Playwright checks passed** across Chromium, Firefox, WebKit, mobile
  Chrome, and mobile Safari.

## User-facing copy — 2026-10-31

- Owner report: study copy read as registry metadata ("Registry lists
  researched", "Who the registry describes"), not copy for people. Researched
  participant-facing reference copy (NIHR Be Part of Research: "Who can take
  part", "What to expect on a study") and lab-site tone (Ranade Lab), and wrote
  two working personas in `docs/personas.md` (clinician/collaborator;
  patient/caregiver).
- Red: existing behavior tests pinned the old metadata strings ("Registry lists
  recruiting", "not available", "View official registry record") and failed once
  the labels changed — updated to the new user-facing behavior.
- Green: plain status words ("Recruiting"/"Completed") with dated source notes;
  task labels ("Who the study is for", "What taking part involves", "Time
  commitment"); enquiry states written for people ("We cannot accept enquiries
  yet…", "An enquiry is a question, not an application"); study JSON and research
  copy rewritten out of registry voice. Honesty rules unchanged: dated sources,
  eligibility by the study team, no recruitment claims.
- Final `npm run verify`: formatting, ESLint, Astro/TypeScript, 25 unit tests,
  and **180 Playwright checks passed** across Chromium, Firefox, WebKit, mobile
  Chrome, and mobile Safari.

## Persona depth pass — 2026-10-31

- Owner: personas were too shallow; enquiry-unavailable copy is build scaffolding
  for the owner, not user copy. Deepened `docs/personas.md` with an evidence base
  (CISCRP perceptions research, NIA clinical-trials guidance, NIHR patterns,
  older-adult participation and clinician-referral literature) — full context,
  two-reader decision model (patient + care partner), motivations/fears,
  stage-by-stage journeys, per-page needs, and cross-persona rules.
- Red: participant journey test failed on the missing "Things to consider"
  decision-support block and the renamed enquiry state.
- Green: study pages now carry a four-point consider list (voluntary/withdrawal,
  family and doctor discussion, team-checked eligibility and consent, asking ≠
  joining) beside the contact state; the enquiry-unavailable line is a terse
  build-state note marked for removal at launch.
- Final `npm run verify`: formatting, ESLint, Astro/TypeScript, 25 unit tests,
  and **180 Playwright checks passed** across Chromium, Firefox, WebKit, mobile
  Chrome, and mobile Safari.

## Persona-driven copy and journeys — 2026-10-31

- Implemented the approved plan from `docs/personas.md`. Red: the participant
  journey test failed on the missing "What happens next" roadmap and clinical
  details. Green: study pages now run relevance → burden → decision support →
  action (roadmap: ask a question → team replies → eligibility/consent at the
  clinic → decide in your own time), with a collapsible "Clinical details" strip
  for Maya. Studies index leads with "who they are for and what they involve";
  About participation is a "Questions people ask" FAQ (costs, stopping, placebo,
  other medicines, doctor); For clinicians splits into "Considering a referral?"
  (3-check flow) and "Working with us" (methods/collaboration). Two test failures
  were strict-mode collisions from the new markup (duplicate study ID, second
  `<details>` summary) — selectors fixed, behavior unchanged.
- Final `npm run verify`: formatting, ESLint, Astro/TypeScript, 25 unit tests,
  and **180 Playwright checks passed** across Chromium, Firefox, WebKit, mobile
  Chrome, and mobile Safari. Deferred: publication type labels and team↔study
  chips (need BIRAX/GRACE page identities first).

## Homepage reorder — 2026-10-31

- Owner direction: home runs hero → research areas → the team, with research-area
  study links leading to study detail pages. Red: the two homepage structure
  tests failed against the old studies-first order.
- Green: home studies/routes bands removed (study discovery now flows through
  research areas: GRACE-780G under cognitive function, STAY-STRONG under muscle
  strength, plus the hero's "Explore studies" → studies index). The completed
  study record now leads with its official name, GRACE-780G, per owner decision.
  One pre-existing assertion targeting the removed studies region was updated to
  the new gateway. A cleanup script briefly broke two CSS media rules (dangling
  selectors); caught by Prettier and repaired before verification.
- Final `npm run verify`: formatting, ESLint, Astro/TypeScript, 25 unit tests,
  and **180 Playwright checks passed** across Chromium, Firefox, WebKit, mobile
  Chrome, and mobile Safari.

## Minimal participation page — 2026-10-31

- Owner: the participation FAQ discussed too much (costs, placebo, medications)
  for a public site; the page needs minimal information and one clear call to
  action. Red: the new minimal/action-first test failed against the FAQ build
  (and one assertion was initially too broad — it counted the intentional
  sources section as content; narrowed to `.article-section:not(.sources)`).
- Green: participation is now one line of reassurance (voluntary; asking is not
  enrollment or consent) plus a primary "Explore studies" button placed directly
  under the intro, above quiet sources. All speculative FAQ disclosure removed
  in both languages. Decision details stay with the study team at consent.
- Final `npm run verify`: formatting, ESLint, Astro/TypeScript, 25 unit tests,
  and **185 Playwright checks passed** across Chromium, Firefox, WebKit, mobile
  Chrome, and mobile Safari.

## Navigation and link-graph cleanup — 2026-10-31

- Owner: navigation/links were confusing, with many links leading to the same
  place; required clicking through every journey before declaring done.
- Audit (scripted link inventory of `main` per page) found: registry record
  linked twice and the studies index twice on the study page; a duplicate
  "For clinicians & collaborators" hero CTA beside the header's "For clinicians";
  "Tel Aviv University" linking to Tali's personal CRIS profile; a "Referrals &
  collaboration" block on the studies index duplicating the header shortcut;
  an "Explore studies" button on the Research page duplicating global nav; and
  inconsistent internal/external arrow glyphs.
- Red: two new journey/consistency tests failed (duplicate destinations; hero
  duplication). Three click-through journeys (patient, clinician, academic) were
  written and pass after the fixes; the desktop-header journeys needed an
  explicit desktop viewport because the header collapses to a menu on mobile.
- Green: one link per destination in page content everywhere; hero has one
  primary action; institutional names are honest plain-text context; Research
  gained a real STAY-STRONG link (its prose previously promised one it didn't
  have); internal links use → and external links ↗.
- Final `npm run verify`: formatting, ESLint, Astro/TypeScript, 25 unit tests,
  and **210 Playwright checks passed** across Chromium, Firefox, WebKit, mobile
  Chrome, and mobile Safari.

## Persona copy pass 2 — 2026-10-31

- Applied review items 1–3: study activities rewritten out of registry voice with
  plain glosses (weekly weight-loss injection, groups by chance, body scans,
  optional muscle sample) and a concrete visit count (about five clinic visits);
  patient caution rewritten in user voice; removed the internal "Information
  checked" line; removed per-page draft/TODO sentences (team profiles, 6 Vital,
  collaboration); clinician referral and collaboration sections now point to the
  official Sheba page and TAU profile as interim routes.
- Also fixed a stray Russian word in the Hebrew "what happens next" heading.
- Copy-only changes; no new interactions. Final `npm run verify`: formatting,
  ESLint, Astro/TypeScript, 25 unit tests, **210 Playwright checks passed**.

## Disclaimer copy removed — 2026-10-31

- Owner: remove defensive boilerplate such as "Research information, not medical
  advice. This draft does not collect patient information or enroll participants."
- Removed the footer medical disclaimer, the repeated sources disclaimer, the
  per-page "Enquiries are not enabled on this draft" line (redundant with the
  global draft banner), and the unused string keys behind them. The participant
  explanation ("An enquiry is a question, not an application…") and the
  completed-study notice remain where they serve a reader.
- Final `npm run verify`: formatting, ESLint, Astro/TypeScript, 25 unit tests,
  **210 Playwright checks passed** across Chromium, Firefox, WebKit, mobile
  Chrome, and mobile Safari.
