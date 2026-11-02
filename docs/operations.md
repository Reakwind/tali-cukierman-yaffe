# Operations

## GitHub

Repository: https://github.com/Reakwind/tali-cukierman-yaffe

The full codebase is published on `main` for cloud and multi-agent development
(including Claude Code in the cloud). Every feature or fix is developed on a
`<type>/<slug>` branch cut from `origin/main`, committed in short (`<= 72` char)
conventional commits, verified with `npm run verify`, and squash-merged through a
pull request. Do not force-push a shared branch or push directly to `main`.

Applied and read back through GitHub's API on 2026-10-30:

- Public visibility; squash-only merges; merged branches automatically deleted.
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
get a PR merged. After CI first runs, bind the required check to the GitHub Actions
application rather than accepting a check posted by any integration.

The account owner should use a passkey or two-factor authentication and store
recovery codes securely. Account authentication and billing settings have not
been changed by this project; never put recovery codes or tokens in the repo.

CI uses standard Ubuntu runners and pinned Actions, without repository secrets.
Failed browser traces/screenshots have a three-day retention period. Keep examples
synthetic and never include patient data. CodeQL setup remains a separate remote
verification step after analyzable source is on the default branch.

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
The test configuration also uses Astro's built-in `--ignore-lock` flag so its
agent-aware CLI stays in the foreground under Playwright. Each test run builds
fresh output and refuses to reuse an unrelated or stale server.

## Cloudflare deployment (not connected yet)

The owner's 2026-11-01 request for contact-form email delivery gives a concrete
need for one Worker endpoint. The current recommendation is **Workers Static
Assets plus the small enquiry Worker**, while Astro continues to generate static
HTML. See [architecture and setup order](architecture.md); the earlier Pages-only
recommendation is superseded for this feature.

Run `npm run dev:worker` for a local Cloudflare preview and `npm run check:worker`
for a bundle/configuration dry-run. Sending defaults to off. The static-only
`npm run preview` remains useful for content review; it does not serve the API.

When connecting the account, use the pinned Wrangler CLI, the selected domain,
four verified email destinations and Turnstile configuration. Review a hosted
preview, headers, bilingual routes, error states and an authorized delivery test
before enabling email. Do not connect/change DNS, billing or account permissions
without the owner's approval. Keep any Git integration scoped to this repository.

No production deployment, domain, billing control, or Cloudflare account permission
has been configured by this project yet.

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
