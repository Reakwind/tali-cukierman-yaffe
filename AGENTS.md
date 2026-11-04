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

- `prototype/index.html`, `prototype/he.html` and `prototype/404.html` — The
  published site: one page per language plus the not-found page. `he.html`
  holds only the Hebrew words; the build takes fonts, styles, painting, script
  and the English publication list from `index.html`. No inline `style=` or
  `on...=` attributes: the CSP admits only the pages' own `<style>`/`<script>`.
- `public/images/` — Portraits, logos and the research image the pages use
  (sources and credits in `docs/third-party.md`).
- `scripts/site.ts` & `wrangler.json` — `npm run build` writes `dist/site`
  (pages, content-hashed images, `404.html`, `robots.txt`, `_headers` with a
  hash-based CSP). Cloudflare's Git integration deploys it to the Worker
  `diabetes-360` (https://diabetes-360.reakwind.workers.dev/); a plain
  `wrangler deploy` does the same. `wrangler.site.json` links to
  `wrangler.json`. No server code, form or email. `npm run dev` serves the
  build locally exactly as Cloudflare does.
- `scripts/prototype.ts` — Assembles the pages. `npm run prototype:build`
  writes `dist/prototype/` with images inlined, for the owner's review as an
  artifact; publish that build (the Hebrew page as a supporting file), never a
  copy edited elsewhere.
- `scripts/session.ts` — Session worktrees and the daily PR (`session:start`,
  `day:finish`, `day:cleanup`).
- `scripts/cloud-setup.sh` — The cloud environment's setup script (pinned
  Node and Playwright browsers); paste it into the environment settings.
- `tests/unit/` & `tests/e2e/` — Node unit tests and Playwright checks of the
  built site served by `wrangler dev` (`site.spec.ts`) and of the pages'
  layout, scrolling and Hebrew version (`prototype-*.spec.ts`).
- `docs/` — Project brief (`project-brief.md`), architecture
  (`architecture.md`), operations, registration plan and content records.
- `.claude/`, `.mcp.json` & `.githooks/` — Agent permissions, the
  destructive-git hook, the cloud SessionStart hook, the `site-reviewer`
  subagent, the Playwright MCP server, and Git commit/push hooks.
- The earlier Astro draft and its enquiry Worker were never deployed and were
  retired on 2026-11-04. Recover any part with `git show d3e5b5b:<path>`.

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
- Run formatting, linting, TypeScript checks, unit tests, production build,
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
  an assigned branch, so skip `session:start`. The SessionStart hook installs
  dependencies; if it reports the wrong Node, the environment's setup script
  (`scripts/cloud-setup.sh`) is missing or failed. Commit per change and push that
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
