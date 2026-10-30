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
