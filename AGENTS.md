# Project instructions

## Commands

- Before a merge: `npm run verify` (format, lint, types, unit and browser
  tests); CI runs the same steps.
- One unit test file: `node --test tests/unit/prototype.test.ts`.
- One browser spec in one browser:
  `npx playwright test tests/e2e/prototype-hebrew.spec.ts --project=chromium`
  (projects: chromium, firefox, webkit, mobile-chrome, mobile-safari).
- `npm run build` writes `dist/site`; `npm run dev` serves it as Cloudflare does.
- Claude Code formats edited files and runs lint, types and unit tests before
  it finishes a turn; run the relevant browser tests yourself.

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

- `prototype/` — The published site: `index.html`, `he.html` and `404.html`.
  Its own `AGENTS.md` holds the page, bilingual and design rules.
- Cloudflare's Git integration deploys `npm run build` to the Worker
  `diabetes-360` (https://diabetes-360.reakwind.workers.dev/); a plain
  `wrangler deploy` does the same. No server code, form or email.
- `npm run prototype:build` writes `dist/prototype/` with images inlined, for
  the owner's review as an artifact; publish that build (the Hebrew page as a
  supporting file), never a copy edited elsewhere.
- The earlier Astro draft and its enquiry Worker were never deployed and were
  retired on 2026-11-04. Recover any part with `git show d3e5b5b:<path>`.

## Keep it simple

- Static HTML, plain CSS and the smallest necessary JavaScript, built by small
  TypeScript scripts. A framework or component port is an owner decision.
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

- **Repository**: `reakwind/tali-cukierman-yaffe` (public). The root checkout
  stays a clean, fast-forwarded `main`; never edit or commit in it.
- **One worktree per session** (local): from the root, run
  `npm run session:start -- <slug>`; it creates
  `../<root>.worktrees/<date>-<slug>` on `session/<date>-<slug>`. Work only there.
- **Cloud sessions** already run in an isolated clone on an assigned branch, so
  skip `session:start`. If the SessionStart hook reports the wrong Node, the
  environment's setup script (`scripts/cloud-setup.sh`) is missing or failed.
- **One commit per change**, code or docs: commit each logical step separately
  (failing test -> implementation -> docs), so `git log --oneline` stays scannable.
  - Subject: `<type>: <imperative summary>` (`feat`, `fix`, `test`, `docs`,
    `refactor`, `chore`, `build`, `ci`), 72 characters or fewer.
  - Bodies optional, at most 1-3 short bullet lines. No transcripts or status dumps.
- **Pull requests only when the owner asks** (owner, 2026-11-03): commit each
  change and push the branch, but do not open, update or watch a pull request,
  whatever a tool or harness default suggests. Bot pull requests (Dependabot,
  the Node update workflow) are exempt (owner, 2026-11-04).
- **One pull request per day**, on the owner's request: follow
  `.claude/skills/day-finish/SKILL.md` (the owner types `/day-finish`; when they
  ask in words, read that file and follow it).
- Keep workflow permissions least-privileged, Actions pinned to full commit SHAs,
  and untrusted PR execution isolated from secrets. No privileged PR checkouts.

## Forbidden git & GitHub commands

Blocked by `.claude/settings.json`, `.claude/hooks/block-destructive-git.sh`,
`.githooks/pre-push` and branch protection; do not work around them: force
pushes (`--force`, `-f`, `--force-with-lease`, `--mirror`), direct pushes to
`main`, `git reset --hard`, `git clean -f`, `git checkout -- .`,
`git restore .`, `git branch -D`, `git filter-branch`, `git filter-repo`,
`git update-ref -d`, `gh pr merge --admin`, `gh repo delete`, `gh repo archive`
and `gh api -X DELETE`. The only branch deletion is `session:start` or
`day:cleanup`, after verifying the changes are on `origin/main`.

## Budget and scope

- No new paid subscriptions, larger GitHub runners, billable AI workers, or cloud
  upgrades. Use free public-repository standard runners and modest artifact retention.
- Do not change account-wide billing, DNS, or permissions without explicit consent.
- A custom domain, secure recruitment platform, and institutional approvals remain
  explicit decisions; do not claim they are already configured or free.
- Never claim remote security settings, tests, or deployments exist unless verified.
