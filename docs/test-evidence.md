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

## Draft banner removed — 2026-10-31

- Owner removed the visible "Website draft" banner. Removed the banner markup,
  strings, and styles; the noindex/nofollow meta and robots policy remain, and
  content review status stays tracked in the docs. A pre-existing test now
  asserts the banner is absent while indexing protection stays on.
- Final `npm run verify`: formatting, ESLint, Astro/TypeScript, 25 unit tests,
  **210 Playwright checks passed**.

## Three-study content refresh — 2026-11-01

- Owner focus: BIRAX, STAY-STRONG, and MiniMed 780G (GRACE-780G); the owner
  confirmed the Swansea/Steve Bain BIRAX partnership during this iteration.
  See [content and source review](drafts/study-content.md). All wording remains
  draft, and publishing remains local-only.
- **Red, unit:** the new project representation test failed with `false !== true`
  because the previous schema required a trial registry record. Project fixtures
  now validate without an NCT ID or registry-update date; recruiting claims,
  invented IDs, unsafe URLs, and live enquiries are rejected for these projects.
- **Red, browser:**
  `npm run test:e2e -- --project=chromium tests/e2e/content.spec.ts --grep 'en:'`
  loaded the old site and failed four assertions: no homepage study entries,
  no structured publication entries, no GRACE output section, and no sourced
  highlights. The initial publication expectation was seven during broad source
  discovery; it was narrowed to six after the owner centered the work on the
  three studies. No unrelated 2026 dementia paper was added.
- The first sandboxed browser command could not bind localhost, and an intermediate
  build found that strict JSON collection schemas needed the file loader's `id`
  field. Neither is counted as behavior-test red evidence. Both were resolved
  before the successful browser journeys.
- **Green:** 37 unit tests; formatting, ESLint, and Astro/TypeScript checks; and
  the production static build. The initial focused Chromium run passed all
  18 content/study/journey checks.
- The full five-project Playwright run recorded **205 passed and 50 Firefox
  launch failures**. Firefox failed before loading a page with
  `Could not find profile folder`. A dedicated explicit profile and a fresh
  matching Firefox 157.0 / revision 1555 downloaded to a task-only temporary
  directory reproduced the same launch problem. No Firefox test was skipped or
  weakened, and Firefox coverage is not claimed.
- After screenshot review, Latin study/device identifiers were kept together,
  a long GRACE heading was shortened, publication-link wrapping was corrected,
  and completed/project section labels were made accurate. A further screenshot
  check exposed a reversed Hebrew glucose-range display. A focused browser test
  failed because `70–180` had no LTR isolation; numeric ranges and the BIRAX
  project-year label were then isolated as well. Final
  `npm run test:e2e -- --project=chromium --project=webkit --project=mobile-chrome --project=mobile-safari`
  passed **204 checks** on the final application content. The test server ran
  the production build first.
- Those checks cover every English/Hebrew built page, internal links/fragments,
  unique metadata and IDs, noindex, no runtime scripts/forms/third-party requests,
  automated accessibility, 320px layouts, keyboard navigation, reduced motion,
  and no-JavaScript navigation. Mobile profiles are emulations.
- Rendered English/Hebrew homepage study rows, GRACE outputs, Hebrew publication
  citations and DOI links, and all three Hebrew mobile study pages were inspected.
  Local review captures are in `/private/tmp/vital-content-review/`; no screenshot
  baselines were changed. Manual screen-reader and physical-device checks were
  not performed. Content/translation review and Firefox verification remain open;
  this is not merge or launch approval. No remote CI, PR, merge, or deployment
  was created or claimed.

## Recruitment CTAs and Cloudflare enquiry preparation — 2026-11-01

- Owner confirmed active BIRAX/STAY-STRONG recruitment, requested inviting CTAs,
  removed public completion labels for other studies, and specified a first-name
  and phone/email form sent to four team inboxes. Student/collaborator CTAs are
  plain Tali mail links. No legal/consent step is shown in the participation flow.
- Red: the owner-confirmed project-recruitment schema test failed; three new
  Chromium recruitment journeys failed against the previous copy and badges.
  Separate form-success, form-error and collaborator-mail tests failed before
  those behaviors were implemented.
- Red, API: four Worker tests failed with 503 instead of the required success,
  validation failure, provider failure and native-form redirect. Green tests now
  verify the exact four recipients, Reply-To behavior, request restrictions,
  disabled delivery, provider failures and server-side bot verification. Email
  and Turnstile are mocked; no messages or real contact data were sent.
- A browser test using the actual production CSP exposed Astro inlining the
  small form script. It failed before `assetsInlineLimit: 0` kept the handler in
  a same-origin file. The form then passed under the real CSP without unsafe
  inline scripts. Same-origin form submission and Turnstile script/frame origins
  are explicitly allowed; arbitrary form destinations remain blocked.
- Wrangler 4.156.0 is pinned as a development dependency; no existing dependency
  version changed. Its dry-run successfully bundled the Worker and validated the
  static-asset/email bindings without deploying. The first local start rejected
  today's compatibility date because bundled workerd supports 2026-10-30; pinning
  that supported date resolved the startup failure.
- The native local Cloudflare runtime served English/Hebrew pages with the
  configured security headers, returned a real 404 for an unknown path, and
  returned 503 for a dummy enquiry with delivery disabled. This does not claim
  real recipient verification or inbox delivery.
- Verification covers formatting, lint, Astro/TypeScript, unit tests, production
  build, and the bilingual/browser journeys. The final run passed all 47 unit
  tests and 252 browser checks across Chromium, WebKit, mobile Chrome and mobile
  Safari. The prior Firefox profile-startup limitation remains open.
  English desktop recruitment rows/contact form and the Hebrew mobile contact
  form were inspected in the native local Cloudflare preview; review captures
  are in `/private/tmp/vital-content-review/recruitment/`. No screenshot
  baselines were changed.
  Manual screen-reader/physical-device checks and live Turnstile/inbox verification
  have not been performed. No cloud account, DNS, billing, publishing or deployment
  change was made. The email-enable flag remains false.

## Team-page copy corrections — 2026-11-01

- Removed Itay's rehabilitation-psychologist wording from the English/Hebrew
  role and draft biography. The student email button now uses a translated
  descriptive label and retains the blank `mailto:tcukierm@gmail.com` destination.
- Formatting, lint, Astro/TypeScript, 47 unit tests and production build passed.
  The existing team journeys passed 12 checks after the profile edit; eight
  focused contact/team/accessibility checks passed after the button-label edit
  across Chromium and mobile Safari. Both languages were visually inspected in
  the local Cloudflare preview. No new behavior tests or deployment were added.
- Subsequent review removed the team page's "Sources & further reading" section
  in both languages. Formatting, lint, Astro/TypeScript, 47 unit tests, production
  build and all 12 existing Chromium/mobile Safari team checks passed again.
  Native preview inspection confirmed no sources section and checked the page
  ending in English desktop and Hebrew mobile layouts.

## Continuous page and parallax — 2026-11-01

- Implemented the owner's final order: sticky title/menu, hero, research areas,
  current studies, then one shared participant contact section. Publications,
  team and clinician information remain reachable by scrolling; menu shortcuts
  use native fragment navigation. Existing deep URLs remain available.
- Red: the new general-enquiry Worker test received 400 instead of 200. The
  shared form now accepts general interest and sends only to the fixed four
  recipients in mocked tests. Delivery stays disabled in local configuration.
- Red: English/Hebrew continuous-page tests found missing inline study details
  and page navigation instead of section anchors. The final-order test then
  caught the previous section sequence. These now pass with the full content
  in static HTML and a single homepage participant form.
- Red: the parallax test found `animation-timeline: auto`. Production CSS had
  combined the timeline into shorthand that the browser rejected. Preserving
  the timeline declaration separately fixed the actual browser output. Tests
  verify transform changes during native scrolling while the menu stays fixed,
  and verify reduced motion removes the effect.
- Red: applying the real production CSP exposed four blocked portrait inline
  styles. Crop positions now use stylesheet rules; the policy was not weakened.
  The final native Cloudflare preview reported no console/page errors.
- Final verification: formatting, lint, Astro/TypeScript (50 files), all **48
  unit tests**, production build, Worker dry-run, and **292 browser checks**
  passed across Chromium, WebKit, mobile Chrome and mobile Safari profiles.
  Coverage includes both languages, links/fragments, metadata, automated
  accessibility, responsive layouts, native Back, keyboard focus, mobile menu
  closing, section/language orientation, reduced motion and disabled JavaScript.
- Mobile WebKit's driver does not implement mouse-wheel input. That profile
  verifies the same native document-scroll/parallax path with `scrollBy`;
  desktop profiles use wheel input. This is not a physical touch-device test.
  The earlier Firefox profile-startup failure remains unresolved; Firefox
  coverage, manual screen-reader checks and eye-tracking tests are not claimed.
- English desktop and Hebrew mobile hero/research/study/contact renders were
  inspected in the actual Cloudflare runtime. The header remained at viewport
  y=0 (92px desktop, 80px mobile); the native view timeline was active. Captures:
  `/private/tmp/vital-content-review/final-scroll-*.png`. No baselines changed.
- The Worker dry-run bundled 4.46 KiB, retained the four-address allowlist and
  `ENQUIRIES_ENABLED=false`, and did not deploy. No messages, account changes,
  DNS changes, billing changes, PR, merge or public launch occurred.

## Visual communication, deeper parallax and art correction — 2026-11-01

- Owner requested a visually led six-part page, pastel magenta/teal, diabetes
  graphics and a much stronger depth effect. After viewing the initial drawings,
  the owner rejected SVG anatomy and human figures. The final draft uses original
  device/instrument geometry, a sensor/pen/symbol-grid hero, real team photos and
  initials for missing photos. No new dependency, paid service, image API or
  purchased asset was introduced.
- Read the primary Firewatch example, Keith Clark's layered CSS demonstration,
  Chrome's scroll-animation documentation, Anthropic's frontend guidance,
  Lucide's icon-design guidance and MDN's SVG pattern API. Working URLs and
  access failures are recorded in `visual-direction.md`. Live Firewatch layer
  motion was inspected before/after scrolling; no artwork or code was copied.
- Red: the new EN/HE six-part tests found no part markers, and the visual-layout
  test found no hero visual. Red: the forced-unsupported-browser fallback test
  found no fallback engine. Red after owner review: EN/HE checks found the rejected
  brain/person drawings. All now pass with the geometric hero and no SVG people
  or anatomy. The content-order and actual depth tests were written before the
  corresponding implementation, not after screenshot-baseline changes.
- Red/green, data: the initial permissive visual-data schema accepted an impossible
  percentage. The strict discriminated schema now validates both languages,
  icon names, ordered visits within duration and percentages from 0 to 100.
  Tests preserve STAY-STRONG's 0/8/16/26-week visits and the sourced GRACE figures.
  An intermediate import-extension error was fixed but is not counted as a
  behavioral red result.
- The first full browser run caught horizontal overflow at 320px from the footer
  subject-icon row (18 failed checks). The row now scales down; timeline labels
  are larger on phones. All responsive checks then passed without hiding page
  overflow or changing screenshot baselines.
- The desktop hero dedicates 65% of its two-column layout to the illustration.
  Actual layer translations over a 600px scroll were approximately −118px at
  the back and −323px at the front, a separation of about 206px. Tests require
  over 100px of relative layer travel. Native scroll, stable copy/controls,
  sticky header, same-section language switching and Back remain intact.
  The 40/60 meaning budget is an editorial design constraint, not a measured
  percentage of reader comprehension or eye-tracking result.
- Native CSS timelines drive the three SVG layers. The forced fallback test
  verifies paused WAAPI animations also separate the layers and cancel completely
  when reduced motion is enabled during the session. HTML starts visible and
  no-JavaScript navigation still works. JavaScript is 4,565 bytes in two files;
  CSS is 35,928 bytes; local fonts are 108,104 bytes in the final build.
- Final checks passed: formatting, lint, Astro/TypeScript (60 files, no diagnostics),
  all **50 unit tests**, production build and **308 browser checks** across
  Chromium, WebKit, mobile Chrome and mobile Safari. These include automated
  accessibility, both languages, RTL, all built-page links/metadata, 320–1920px
  layouts, keyboard navigation, native anchors/Back, strict CSP, reduced motion,
  no JavaScript, one shared participant form, and success/error handling with
  mocked delivery. Mobile coverage uses emulation, not physical devices.
- Rechecked Firefox separately: the bundled firefox-1555 process still exits
  with “Could not find profile folder” before opening a page. This is not a
  passing Firefox test or application failure; Firefox coverage remains open.
  Manual screen-reader, physical-device and eye-tracking checks were not done.
- Inspected the actual 8787 Cloudflare preview in English desktop and Hebrew
  mobile, including hero before/after scroll, topic focus, study timeline and
  participation. Chromium/WebKit reported no application console, page or CSP
  errors in either language. WebKit screenshot instrumentation itself injects
  a blocked inline stylesheet; a separate check proved that occurs only on the
  screenshot call. The page's policy was not weakened to accommodate that tool.
  Captures are local in `/private/tmp/vital-content-review/`; no baselines changed.
- Worker dry-run passed (4.46 KiB). `ENQUIRIES_ENABLED=false` and the existing fixed
  recipient allowlist remain unchanged. No messages, cloud deployment, account,
  DNS, billing, PR, merge or launch occurred. This is a local visual-review draft;
  source/content/translation review and production delivery setup remain open.

## White canvas and motion refinement — 2026-11-01

- Owner accepted the geometric direction and requested white backgrounds plus
  further SVG/transition refinement. Page, header, hero, research, studies,
  participation, form and footer now all compute to `rgb(255, 255, 255)`.
  Color remains in the original graphics, meaningful protocol arms and selected
  borders/controls. No content, study values or enquiry delivery settings changed.
- Refined the sensor rim, background-grid density, pen and symbol-sheet detail.
  Scroll adds small opposing foreground rotations and resolves the magenta signal
  trace over an always-visible connector. Strong three-layer depth remains.
  All drawings remain geometric, with no SVG people or anatomy and no invented
  patient readings or scores.
- Red: both new phone-reading journeys failed because the illustration did not
  stay in its intended viewport area alongside the topic (English/Hebrew).
  Green: tall phones now reserve space below the sticky illustration for the
  heading and paragraph. The topic observer's pixel margins use the actual art
  and header dimensions and update after resize/preference changes. Short screens
  and reduced motion return to normal flow. Initial focused verification passed
  32 checks across Chromium and mobile Safari.
- Native CSS and forced WAAPI fallback were inspected under the real Cloudflare
  CSP. At scroll 0/600/0, the signal offset was approximately .69743/.027202/.69743
  and foreground matrices returned exactly to their initial values; native and
  fallback values matched. No application console/page/CSP errors were reported.
  Reduced-motion tests verify cancellation of both depth layers and detail motion.
- Inspected white-background English desktop and Hebrew phone renders, including
  all three research topics, hero before/after scrolling and backward restoration.
  Phone headings remain below the graphic, within the viewport. Captures and
  computed-style reports are in `/private/tmp/vital-content-review/refinement/`.
  The local 8787 runtime was restarted after it was found stopped; it is serving
  the current production build. No screenshot baselines were changed.
- Final formatting, lint, Astro/TypeScript (60 files, no diagnostics), **50 unit
  tests**, production build and **316 browser checks** passed across Chromium,
  WebKit, mobile Chrome and mobile Safari. Coverage includes both languages,
  RTL, actual motion, fallback, keyboard/Back, no JavaScript, reduced motion,
  automated accessibility, CSP and responsive layouts. Assets remain small:
  CSS 37,571 bytes; JavaScript 5,595 bytes in two files.
- The previously reproduced Firefox launcher failure remains an open coverage
  limitation and was not rerun in this refinement. No manual screen-reader or
  physical-device checks are claimed. No new dependency, paid service, external
  asset/API, message, cloud deployment, account/DNS/billing change, PR or merge.
  Participant email delivery remains disabled; this is a local review draft.

## Scene containment, section clearance and diagram framing — 2026-11-01

- Screenshot inspection of the white-canvas homepage exposed four scroll/layout
  defects: the hero arch clipped at the top of `.hero-pin` at 600px scroll, the
  research scene's sensor and cognition icons drifted outside the teal backdrop
  and clipped against `.research-visual`, the "Research areas" heading straddled
  the sticky header when viewing the first topic, and the `GRACE-780G` result
  card intruded below the sticky research scene while reading the third topic.
- Red (`npm run test:e2e -- --project=chromium tests/e2e/visual-story.spec.ts --grep "unclipped inside their frames"`):
  both English and Hebrew checks failed on the hero far layer clipping above
  `.hero-pin` (`88.43px < 117px`) and research scene overflow.
- Green: rebalanced the hero and research SVG coordinates and calibrated layer
  travel in both native CSS keyframes and the WAAPI fallback (`HeroGraphic.astro`,
  `ResearchScene.astro`, `site.css`, `ScrollExperience.astro`), adjusted research
  topic cadence and section spacing (`Home.astro`), and framed the `GRACE-780G`
  result stage and study protocol cards (`VisualResult.astro`, `VisualStudy.astro`).
- Cross-browser Firefox check exposed a Gecko `getBoundingClientRect()` quirk on
  `<g>` wrappers around nested `<svg viewBox>` icons; asserting the rendered
  `.icon-lines` geometry directly verified actual icon containment in all engines.
- Visually inspected fresh English desktop (`1440×1000`) and Hebrew phone
  (`390×844`) captures across hero, scrolled hero, all three research topics,
  `GRACE-780G`, `STAY-STRONG`, and participation.
- Final `CFFIXED_USER_HOME=/tmp/vital-ff-home npm run verify` and
  `npm run check:worker`: formatting, ESLint, Astro/TypeScript (60 files, zero
  diagnostics), **50 unit tests**, production build, Worker dry-run, and all
  **405 Playwright checks passed** across Chromium, Firefox, WebKit, mobile
  Chrome and mobile Safari. Delivery remains disabled (`ENQUIRIES_ENABLED=false`).

## Repository setup for fast iteration — 2026-11-04

Measured in a Claude Code cloud session (4 cores) and on GitHub Actions.
The Astro sections above describe the retired draft (commit `d3e5b5b`).

- CI: on `main`, `playwright install --with-deps` took 14.5 minutes and hit
  the 15-minute timeout (runs 22 and 26 cancelled). Browser jobs now run in
  parallel in the digest-pinned Playwright image: manual run 41782176271 on
  the session branch passed every job in 2 minutes 48 seconds.
- Cloud setup: the old script failed at its first line (`/opt/nvm` no longer
  exists). The new script exited 0 in 98 seconds; `node` resolved to
  v24.22.2. SessionStart hook: quiet when current, `npm ci` in 17 seconds
  when the lockfile is newer.
- Flaky tests, 10 runs per engine without retries: the language-switch test
  failed 13/20 on Chromium (Locator.click scrolled from the sticky link),
  then 100/100. The painting test failed 5/30, then 50/50, and fails when
  the painting is disabled. Desktop scroll checks on the iPhone project
  failed 46 times at 10 workers (3x pixel density starved WebKit), then
  210/210 at 1x.
- Git hook: refused `git push` lines containing `pkill -f`; now checks flags
  per push, still blocks `-f`, `--force`, `--mirror` and `+refspec`.
- Retired the Astro draft: 81 of 104 browser tests per project checked it, not
  the published site. New `site.spec.ts` checks the built site through
  `wrangler dev`; its axe check found phone header targets under 24px (WCAG
  2.2 2.5.8), fixed (header 70px to 71px; screenshots compared).
- Site build: pages 478 KB to 50–54 KB with content-hashed images; hash-based
  CSP with no violations in five browser projects; 404 page and robots.txt.
  The painting renders byte-identically before and after.
