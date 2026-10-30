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
