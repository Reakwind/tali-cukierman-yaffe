# Operations

## GitHub

Repository: https://github.com/Reakwind/tali-cukierman-yaffe

The full codebase is published on `main` for cloud and multi-agent development
(including Claude Code in the cloud). Each local session works in its own git
worktree on a `session/<date>-<slug>` branch and commits every change. At the end
of the day `npm run day:finish` merges the sessions into `day/<date>` and opens one
PR, verified with `npm run verify` and squash-merged. GitHub deletes the merged
branch; the next `npm run session:start` (or `day:cleanup`) removes local worktrees
and branches already on `origin/main` and fast-forwards the root `main` checkout.
Do not force-push a shared branch or push directly to `main`.

Applied and read back through GitHub's API on 2026-10-30:

- Public visibility; squash-only merges; merged branches automatically deleted.
- Applied by the owner and read back through the API on 2026-11-02: squash
  commits use the PR title and list each commit's message
  (`squash_merge_commit_title: PR_TITLE`,
  `squash_merge_commit_message: COMMIT_MESSAGES`), so `main` history names
  every change in the day's PR.
- `main` requires PRs, the `quality` check, up-to-date branches, resolved
  conversations, and linear history. Administrators are covered. Force pushes
  and branch deletion are disabled.
- Required independent approvals are zero for the agreed solo-agent workflow.
  This does not authorize the agent to approve clinical content on the team's behalf.
- Secret scanning and push protection enabled; dependency vulnerability alerts
  and security updates enabled; private vulnerability reporting enabled.
- Actions restricted to GitHub-owned actions and the CodeQL action, with full-SHA
  pinning enforced. Default workflow tokens are read-only and cannot approve PRs.
  All external-contributor fork workflows require maintainer approval. Repository
  logs/checks have seven-day retention; failure artifacts use three days.

The JSON files in `.github/` document the settings submitted to GitHub. They are
**not** automatically applied by GitHub when edited. Apply and verify deliberate
future changes through the API/settings interface; do not weaken safeguards to
get a PR merged. The required `quality` check is bound to the GitHub Actions app
(`app_id` 15368, applied by the owner and read back on 2026-11-02), so a check of
the same name posted by any other integration does not satisfy it.

The account owner should use a passkey or two-factor authentication and store
recovery codes securely. Account authentication and billing settings have not
been changed by this project; never put recovery codes or tokens in the repo.

CI (`.github/workflows/ci.yml`) runs on every PR and push to `main`. The
`checks` job runs the dependency audit and every non-browser step of
`npm run verify` plus the site build. The `browsers` job runs one Playwright
project per parallel job inside Microsoft's Playwright image for the pinned
version, so browsers and their system libraries are never installed with apt
(on 2026-11-03 that install took 14.5 minutes and timed CI out on `main`).
The `quality` job, the check branch protection requires, passes only when
every other job passed. Dependency review runs on PRs. It first ran on
2026-11-02 and passed (415 browser checks). It uses standard Ubuntu runners,
which are free for public repositories, pinned Actions and a digest-pinned
image, without repository secrets. Do not add larger or paid runners.

When `@playwright/test` changes, `tests/unit/tooling.test.ts` fails until the
image tag and digest in `ci.yml` match it. Read the digest with:

```sh
curl -sI -H 'Accept: application/vnd.oci.image.index.v1+json' \
  https://mcr.microsoft.com/v2/playwright/manifests/v<version>-noble |
  grep -i docker-content-digest
```

Failed browser traces/screenshots have a three-day retention period. Keep examples
synthetic and never include patient data. CodeQL setup remains a separate remote
verification step after analyzable source is on the default branch.

### Cloud session setup

Claude Code cloud containers start with Node 22, no version manager and
older Playwright browsers than this project pins, so browser tests fail there
for reasons unrelated to the site. `scripts/cloud-setup.sh` installs the
pinned Node from nodejs.org (checked against its published checksums) and
links it into `~/.local/bin`, which comes before the image's Node on `PATH`.
It then installs the matching Chromium, Firefox and WebKit builds with their
system libraries. Paste its contents into the cloud environment's settings
(environment menu in the session title bar, then Edit, then Setup script);
new sessions run it. `tests/unit/cloud-session.test.ts` fails when its two
version numbers drift from `.node-version` and `@playwright/test`. The
environment's network access must allow nodejs.org and Playwright's browser
downloads.

The SessionStart hook in `.claude/settings.json`
(`.claude/hooks/session-start.sh`) runs only in cloud sessions. It runs
`npm ci` when `node_modules` is missing or older than the lockfile, and tells
the agent when the pinned Node is not running, which means the setup script
is missing or failed. On a Mac it does nothing.

### Local browser tooling note

The current Playwright Firefox 157 bundle has a known macOS 27 app-data/profile
startup issue (upstream issue `microsoft/playwright#42768`). This machine reproduced
it. Tests passed by giving the browser process a fresh isolated application home
through `CFFIXED_USER_HOME`; no Full Disk Access was granted and no user's Firefox
profile was read or changed. Linux CI does not need this macOS-only workaround.

When needed locally, use an empty temporary directory, for example:

```sh
CFFIXED_USER_HOME="$(mktemp -d)" npm run verify
```

This agent session uses its approved temporary directory for that isolated home.
Remove the workaround once the upstream fix is in a supported stable release.
Browser tests serve the built site with `wrangler dev`, which reproduces
Cloudflare's headers, redirects and 404 handling locally. Each test run builds
fresh output and refuses to reuse an unrelated or stale server.

## Cloudflare deployment

The published site is the one-page prototype in English and Hebrew, as static
files, at https://diabetes-360.reakwind.workers.dev/ (Worker `diabetes-360`,
connected through Cloudflare's Git import on 2026-11-03). The defaults publish
it: `npm run build` builds `dist/site`, and the root `wrangler.json` runs that
build before every `wrangler deploy`. `wrangler.site.json` is a link to
`wrangler.json`, so a deploy command written as
`npx wrangler deploy -c wrangler.site.json` keeps working. Run
`npm run site:deploy` to deploy by hand with a token. The owner's first import
(Worker `tali-cukierman-yaffe`) published the old Astro draft because the
defaults then pointed to it.

The earlier Astro draft and its enquiry Worker were never deployed and were
retired on 2026-11-04, because most browser tests checked it instead of the
published site. Recover any part with `git show d3e5b5b:<path>`.

The build also writes `404.html`, `robots.txt` (disallow all) and `_headers`
with a hash-based Content-Security-Policy, `nosniff`, `no-referrer`, a
Permissions-Policy and Cross-Origin-Opener-Policy; images get one-year
immutable caching. See [architecture](architecture.md). Cloudflare deploys
`main` whether or not the push's CI run passed; branch protection, which
requires `quality` before a merge, is the gate.

Do not connect/change DNS, billing or account permissions without the owner's
approval. Keep any Git integration scoped to this repository.

## Claude Code setup

Committed in this repository, so every session (cloud or Mac) gets it:

- `CLAUDE.md` imports `AGENTS.md`. `.claude/settings.json` holds the git
  safety denials, the destructive-git hook, and the cloud-only SessionStart
  hook described above.
- `.mcp.json` adds the Playwright MCP server, so agents can open and inspect
  the rendered pages as `AGENTS.md` requires. Project MCP servers load in
  cloud sessions without a prompt.
- `.claude/agents/site-reviewer.md`: a read-only reviewer for the content,
  bilingual and accessibility rules, for a second look at a change.
- `.claude/worktrees/` is ignored, for Claude Code's built-in worktrees
  (`claude -w <name>`), an alternative to `npm run session:start`.

Account settings only the owner can change (claude.ai):

- Cloudflare: the "Cloudflare Developer Platform" connector describes itself
  as deprecated; Cloudflare's current server is `https://mcp.cloudflare.com/mcp`
  (on the Mac: `claude mcp add --transport http cloudflare
https://mcp.cloudflare.com/mcp`). The token this cloud environment injects
  can read Workers and deployments but not Workers Builds.
- The GitHub plugin's MCP server fails to connect (HTTP 400); the built-in
  GitHub tools work. Reconnect or remove it.
- The anchor-memory plugin reports "memory drift" at every session start
  because `memory/` does not exist here. Run its init for this repository or
  disable it for this project.
- Many unrelated plugins and connectors (healthcare, marketing, bio-research,
  voice) load into every session and crowd each agent's context. Disable the
  ones this project does not use.
- Paste `scripts/cloud-setup.sh` into the cloud environment's setup script.

## Draft and launch

Drafts are not private just because they are non-indexable. The public source and
standard branch previews can be read by anyone. Use only public, cleared material.

Before making the site an official recruitment resource, resolve the launch gates
in `project-brief.md`, obtain the team's content/translation approvals, and approve
the actual enquiry/referral workflow. Update the meta robots policy, `robots.txt`,
and the `X-Robots-Tag` header together in a dedicated, tested launch PR.

Set a real canonical domain and sitemap only after the destination is confirmed;
do not emit invented production URLs. Add an accessibility contact only when a
real approved channel is supplied. Never claim formal accessibility/compliance
certification merely because an automated scan passes.

## Maintaining studies

- Keep source URLs and registry update dates with the content.
- Record team review separately; a registry timestamp is not a recruitment approval.
- When a study closes, remove any participation action and keep a clearly marked
  archive page if it is useful. Do not simply remove the page and break links.
- Confirm status and contact routes with the coordinator before launch and agree
  a recurring review schedule. Flag stale content; do not auto-publish third-party
  status changes as approved recruitment copy.
- An enquiry system must support prompt closure, retention/deletion, role-based
  access, and actual coordinator follow-up. This remains institution-owned.

## Rollback and dependency maintenance

Revert a faulty feature through a new PR and rerun checks; do not force-reset
`main`. Cloudflare deployment history can provide a production rollback once
hosting is configured. Never discard unrelated local work.

Run `npm run check:dependencies` (`npm audit`, moderate or worse fails); CI runs
it after install.

Review Dependabot PRs and vulnerability alerts regularly. Prefer compatible small
updates; verify breaking changes against current docs/Context7. No blanket
auto-merge for major dependency upgrades. No paid scanning/agent services are
required for the planned workflow.

`package.json` overrides `minimatch` to `11.0.1` for GHSA-g3hv-75wg-m249
(2026-11-02). ESLint and typescript-eslint still declare `^10`, so the override
sits outside their ranges. Remove it once both depend on a fixed release, and
keep `tests/unit/tooling.test.ts` passing.
