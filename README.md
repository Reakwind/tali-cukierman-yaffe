# Tali Cukierman-Yaffe research group

An English/Hebrew research-group website, bringing together diabetes, cognition,
healthy aging, and digital-health projects.

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
- [Agent workflow](AGENTS.md)

Every feature is developed through a focused PR and squash-merged only when its
checks pass. No additional paid services are authorized.

## Development

Use Node.js 24 (the exact version is in `.node-version`) and npm. On this Mac,
Homebrew's versioned Node may need to be added to the terminal's path:

```sh
export PATH="/opt/homebrew/opt/node@24/bin:$PATH"
npm ci
npx playwright install chromium firefox webkit
npm run dev
```

Open the local URL Astro prints. The public site is generated as static files in
`dist/`; no server adapter, database, or production Node.js process is required.

Before opening or merging a PR:

```sh
npm run verify
```

This runs formatting, linting, type checks, Node tests, a production build, and
Playwright on three desktop engines plus Android/iPhone viewports. Browser tests
start their own local production preview. These viewports are emulation, not
physical-device testing. Automated accessibility checks do not replace manual checks.

Use `npm run format` to format files. Set `ASTRO_TELEMETRY_DISABLED=1` to disable
Astro development telemetry, as CI does.

## Deployment and security

See [operations](docs/operations.md). Cloudflare has not yet been connected.
Drafts are deliberately non-indexable, but **noindex is not access control**:
this repository is public, and a deployed preview would normally be public too.

## Rights

Public visibility does not grant a blanket license to site content, photographs,
institutional logos, or publications. A project code license has not yet been
selected. Reused third-party materials retain their original licenses.
