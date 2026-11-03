# Project instructions

## Product

- Read `docs/project-brief.md` first. This is a research-group website, not a
  company landing page. Prioritize potential participants/caregivers and
  clinicians referring them, then academic collaborators and prospective students.
- Ship English and Hebrew together, with real RTL layouts, translated navigation,
  same-page language switching, and mixed-direction identifiers handled correctly.
- Content and translations are drafts until reviewed. Never invent team members,
  openings, endorsements, recruiting status, results, or contact details.
- The group is the **Diabetes 360 Research Group**; Prof. Tali Cukierman-Yaffe is
  its principal investigator, not its name. She leads the Team section, not the
  opening (owner, 2026-11-03).
- Information hierarchy is a pyramid. Each section goes one level deeper, and a
  visitor can stop at any level: About (bird's-eye view: should I keep reading?)
  -> Research (what the group studies and how) -> Ongoing studies (concrete
  studies to ask about) -> Publications (the deepest dive). Team, Contact and
  the footer follow. Keep every fact at its own level; do not repeat it above.
- No duplicate places (owner, 2026-11-03): name each ongoing study in one place
  only, the Ongoing studies section. No shortcuts or markers that repeat a
  section's content elsewhere on the page.
- Site copy only states verified facts or offers an action. Never write prose
  addressed to the builder, design notes, or placeholders such as "to confirm"
  into the site; open questions stay in the project docs. Email addresses are
  links, not printed text.

## Repository structure

- `src/pages/[locale]/` — Bilingual static routes (`en` LTR and `he` RTL), including `/[locale]/`, `/[locale]/studies/[study]`, and `/[locale]/participation/thank-you`.
- `src/components/` — Page sections and layered SVG visual storytelling (`Home.astro`, `HeroGraphic.astro`, `ResearchVisual.astro`, `ResearchScene.astro`, `VisualMethods.astro`, `MethodsScene.astro`, `VisualStudy.astro`, `VisualFooter.astro`, `ScrollExperience.astro`, `DiabetesIcon.astro`).
- `src/content/` — Validated bilingual JSON content (`studies/*.json`, `visual-studies.json`, `publications.json`, `highlights.json`).
- `src/lib/` — Zod content schemas (`study-schema.ts`, `visual-study-schema.ts`, `output-schema.ts`) and shared helpers.
- `src/data/` & `src/i18n/` — Team profiles (`team.ts`), page copy (`pages.ts`), and UI strings (`ui.ts`).
- `src/styles/site.css` — Logical RTL-safe CSS and scroll-driven parallax layers.
- `worker/index.ts` & `wrangler.jsonc` — Cloudflare Worker endpoint (`POST /api/participation`) + static assets.
- `scripts/site.ts` & `wrangler.site.json` — The published site: the two prototype pages as full documents plus a no-index `_headers` file in `dist/site`, deployed as static files only (`npm run site:deploy`). No server code, form or email.
- `scripts/session.ts` — Session worktrees and the daily PR (`session:start`, `day:finish`, `day:cleanup`).
- `tests/unit/` & `tests/e2e/` — Node unit tests and Playwright E2E/visual-story journeys.
- `prototype/index.html` and `prototype/he.html` — The current one-page draft of the site in English and Hebrew, reviewed by the owner as an artifact. `he.html` holds only the Hebrew words; the build takes fonts, styles, painting, script and the English publication list from `index.html`. `npm run prototype:build` inlines images into `dist/prototype/index.html` and `dist/prototype/he.html`; publish that build (the Hebrew page as a supporting file), never a copy edited elsewhere.
- `docs/` — Project brief (`project-brief.md`), architecture (`architecture.md`), registration plan (`registration-plan.md`), and visual/scrolling specs.
- `.claude/` & `.githooks/` — Agent permissions, PreToolUse destructive-git blocker, and Git commit/push hooks.

## Approved design direction

- The owner rejected the original wellness-style draft and the university-template
  references. The approved references are https://www.sarvestanilab.com/ and
  https://www.ranadelab.org/: independent identity, short consistent navigation,
  readable sans-serif type, purposeful imagery, and restrained color.
- Avoid the rejected AI-template bundle: gradient headlines, glowing backgrounds,
  glossy decorative 3D objects, pill-button clusters, repeated three-card sections,
  arbitrary metric bars, and ornamental filler. These are quality warnings, not
  evidence that a particular author used AI.
- Write specific factual copy. No manufactured slogans such as "Aging well.
  Living fully.", "Three perspectives. One person.", "The next question starts
  here", or interchangeable "science with people at its heart" language.
- A section must serve a real visitor task. Do not invent content to fill a design.
  Use plain page/section names and show study information early.
- Borrow principles, not another lab's logo, photographs, text, or illustrations.
  Do not invent a portrait or use stock people as if they were the research group.
- Check the actual rendered design, not just passing tests. Present a reviewable
  draft before expanding an unapproved visual direction across more features.

## Keep it simple

- Astro static HTML, TypeScript, plain CSS, and the smallest necessary JavaScript.
- Prefer native browser features and maintained official capabilities before a
  dependency or custom implementation. No React, database, custom CMS, account
  system, tracking, or clinical-data backend without a demonstrated need/approval.
- Content lives in versioned Markdown/JSON with validated structure. Do not fetch
  third-party APIs during normal page loads or make builds depend on registry uptime.
- Consult Context7 and verify examples against installed versions and primary
  documentation. Its public HTTP API is available if no MCP tool is connected.
  Report access/rate-limit failures rather than pretending to have used it.

## Test first

- Red -> green -> refactor: write the behavior test, observe the intended failure,
  implement the smallest change, rerun, and refactor with tests green.
- Record actual red/green evidence in the PR. A missing tool, syntax error, or
  network failure is not evidence that the missing behavior was tested.
- Run formatting, linting, Astro/TypeScript checks, unit tests, production build,
  and relevant Playwright journeys before requesting a merge.
- Test Chromium, Firefox, WebKit, mobile viewports, keyboard navigation, reduced
  motion, no-JavaScript navigation, RTL, links, metadata, and automated accessibility.
- Inspect the rendered preview. Do not update screenshot baselines just to hide a
  regression. Report manual screen-reader/physical-device checks honestly.

## Research recruitment and privacy

- Follow `docs/registration-plan.md`. A registry listing is not approval to publish
  a recruitment advertisement or confirmation that a particular site has openings.
- Use official records and record their dates. The site lists "Ongoing studies"
  without recruitment status or timelines, because they change too often to keep
  current (owner, 2026-11-03). A completed study appears only through its
  publications, never among ongoing studies.
- Keep drafts non-indexable until the team approves launch. The owner removed the
  visible "Website draft" banner on 2026-10-31; content review status stays
  tracked in the project docs.
- Do not activate registration without an approved destination and reviewed
  participant information in both languages. Enquiry is not informed consent or
  enrollment. No eligibility scoring, implied benefit, or automatic matching.
- Do not collect patient identifiers, medical histories, referrals, documents,
  or consent submissions in GitHub, browser storage, analytics, or a generic form.
- Prefer an institution-managed approved data-collection system. Do not assume
  that a vendor, encryption, or a checkbox alone establishes legal compliance.
- Never paste secrets into code, chat, logs, or PRs. `PUBLIC_*` variables are public.

## Multi-agent version control & short commits

- **Repository**: `reakwind/tali-cukierman-yaffe` (public).
- **Root stays on `main`**: the root checkout is a clean, fast-forwarded `main`
  that shows the next agent what has been merged. Never edit or commit in it.
- **One worktree per session** (local): from the root, run
  `npm run session:start -- <slug>`. It fetches, trims finished worktrees,
  fast-forwards root `main`, then creates `../<root>.worktrees/<date>-<slug>`
  on branch `session/<date>-<slug>` and prints recent `main` history and other
  open worktrees. Work only inside that worktree. Parallel sessions each get one.
- **One commit per change**, code or docs: commit each logical step separately
  (failing test -> implementation -> docs), so `git log --oneline` stays scannable.
  - Subject: `<type>: <imperative summary>` (`feat`, `fix`, `test`, `docs`, `refactor`, `chore`, `build`, `ci`), **72 characters or fewer** (enforced by `.githooks/commit-msg`).
  - Bodies optional, at most 1-3 short bullet lines. No transcripts or status dumps.
- **Pull requests only when the owner asks** (owner, 2026-11-03): during the day,
  commit each change and push the branch, but do not open, update or watch a
  pull request. The day's PR is the end of the day and happens only on the
  owner's request.
- **One pull request per day**: when the owner asks for it, run
  `npm run day:finish` from the root. It merges that day's session branches into
  `day/<date>`, pushes it and opens one draft PR listing every commit. It refuses
  while a session worktree has uncommitted changes.
  - Fill in the PR (`.github/pull_request_template.md`): Why, real Red/Green
    evidence per change, screenshots for visual changes, limitations/approvals.
  - Review the full diff (`git diff origin/main...origin/day/<date>`), confirm
    `npm run verify` and CI on the exact head, then
    `gh pr merge --squash --delete-branch`. GitHub deletes the remote branch.
  - A solo agent cannot self-approve. Request a separate reviewer for sensitive
    clinical content, permissions, billing, and DNS changes.
- **After the merge**: the next `session:start` (or `npm run day:cleanup`)
  removes worktrees and `session/*`/`day/*` branches whose changes reached
  `origin/main` (some `main` commit since they branched contains them, or they
  are part of a merged day branch), and fast-forwards root `main`. It keeps
  anything with uncommitted changes or commits made after the merge.
- **Cloud sessions** (Claude Code on the web) already run in an isolated clone on
  an assigned branch, so skip `session:start`. Commit per change and push that
  branch; open no PR for it. When the owner asks for the day's PR, fold the
  branch in with `npm run day:finish -- --include origin/<branch>`.
- Keep workflow permissions least-privileged, Actions pinned to full commit SHAs,
  and untrusted PR execution isolated from secrets. No privileged PR checkouts.

## Forbidden git & GitHub commands

The following destructive commands are strictly forbidden and blocked by `.claude/settings.json`, `.claude/hooks/block-destructive-git.sh`, `.githooks/pre-push`, and GitHub branch protection:

- **No force pushes**: `git push --force`, `git push -f`, `git push --force-with-lease`, `git push --mirror`.
- **No direct pushes to `main`**: Always push a feature branch and merge through a pull request.
- **No destructive working-tree wipes**: `git reset --hard`, `git clean -f`, `git checkout -- .`, `git restore .`.
- **No history rewrites or unmerged branch deletions**: `git branch -D`, `git filter-branch`, `git filter-repo`, `git update-ref -d`.
  The only branch deletion is `npm run day:cleanup`/`session:start`, which removes
  `session/*` and `day/*` branches only after verifying their changes are on `origin/main`.
- **No admin bypasses or repository deletions**: `gh pr merge --admin`, `gh repo delete`, `gh repo archive`, `gh api -X DELETE`.

## Budget and scope

- No new paid subscriptions, larger GitHub runners, billable AI workers, or cloud
  upgrades. Use free public-repository standard runners and modest artifact retention.
- Do not change account-wide billing, DNS, or permissions without explicit consent.
- A custom domain, secure recruitment platform, and institutional approvals remain
  explicit decisions; do not claim they are already configured or free.
- Never claim remote security settings, tests, or deployments exist unless verified.
