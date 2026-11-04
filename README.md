# Diabetes 360 Research Group website

The English/Hebrew website of the Diabetes 360 Research Group, led by Prof.
Tali Cukierman-Yaffe: diabetes, cognition, healthy aging, and digital-health
research. Draft, published for team review at
https://diabetes-360.reakwind.workers.dev/ (hidden from search engines).

The main audience is people considering research participation, their caregivers,
and clinicians or academic collaborators who may refer participants.

## Status

Work in progress. Public-source content and translations are drafts requiring
review by the research team. This is not an official hospital service, an
eligibility assessment, or an enrollment system. No patient information should
be placed in this repository, its issues, or pull requests.

## Project documentation

- [Confirmed direction](docs/project-brief.md)
- [Research, design references, and initial personas](docs/discovery.md)
- [Participant-enquiry plan](docs/registration-plan.md)
- [Agent workflow & git policy](AGENTS.md)
- [Content editing](docs/content-editing.md)

## Multi-agent & cloud workflow

Repository: `https://github.com/Reakwind/tali-cukierman-yaffe`

- **Single source of instructions**: `AGENTS.md` (imported by `CLAUDE.md` for Claude Code in the cloud and CLI).
- **Short commits**: Every commit uses `<type>: <imperative summary>` (`feat:`, `fix:`, `test:`, `docs:`, `refactor:`, `chore:`) in `<= 72` characters (enforced by `.githooks/commit-msg`).
- **Sessions and daily PRs**: `npm run session:start -- <slug>` gives each session its own worktree beside the root checkout. Commit every change; `npm run day:finish` opens one PR for the day, which is squash-merged (`gh pr merge --squash --delete-branch`). The next `session:start` trims merged worktrees and fast-forwards root `main`.
- **Destructive git protection**: Force pushes, direct pushes to `main`, `git reset --hard`, `git clean -f`, `git branch -D`, and `gh pr merge --admin` are blocked by `.claude/settings.json`, `.claude/hooks/block-destructive-git.sh`, `.githooks/pre-push`, and GitHub branch protection.

## Development

Use Node.js 24 (the exact version is in `.node-version`) and npm. On this Mac,
Homebrew's versioned Node may need to be added to the terminal's path:

```sh
export PATH="/opt/homebrew/opt/node@24/bin:$PATH"
npm ci
npx playwright install chromium firefox webkit
npm run dev
```

`npm run dev` builds the site and serves it at the local URL Wrangler prints,
with the same headers, redirects and 404 page as Cloudflare. The pages are
edited in `prototype/` (see [content editing](docs/content-editing.md)); the
site is static files in `dist/site`, with no server code or database.
`npm run prototype:build` writes the self-contained version for artifact review.

Before opening or merging a PR:

```sh
npm run verify
```

This runs formatting, linting, type checks, Node tests, and Playwright on three
desktop engines plus Android/iPhone viewports, against the built site served as
Cloudflare serves it. These viewports are emulation, not physical-device
testing. Automated accessibility checks do not replace manual checks.

Use `npm run format` to format files.

## Deployment and security

See [operations](docs/operations.md) and [architecture](docs/architecture.md).
Cloudflare's Git integration deploys `main` to the Worker `diabetes-360`.
Drafts are deliberately non-indexable, but **noindex is not access control**:
this repository and the deployed site are public.

## Rights

Public visibility does not grant a blanket license to site content, photographs,
institutional logos, or publications. A project code license has not yet been
selected. Reused third-party materials retain their original licenses.
