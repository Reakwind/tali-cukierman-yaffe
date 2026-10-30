# Project instructions

## Product

- Read `docs/project-brief.md` first. This is a research-group website, not a
  company landing page. Prioritize potential participants/caregivers and
  clinicians referring them, then academic collaborators and prospective students.
- Ship English and Hebrew together, with real RTL layouts, translated navigation,
  same-page language switching, and mixed-direction identifiers handled correctly.
- Content and translations are drafts until reviewed. Never invent team members,
  openings, endorsements, recruiting status, results, or contact details.

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
- Use official records and record their dates. Separate completed projects from
  studies that may be recruiting. Never display a completed study as open.
- Keep drafts visibly marked and non-indexable until the team approves launch.
- Do not activate registration without an approved destination and reviewed
  participant information in both languages. Enquiry is not informed consent or
  enrollment. No eligibility scoring, implied benefit, or automatic matching.
- Do not collect patient identifiers, medical histories, referrals, documents,
  or consent submissions in GitHub, browser storage, analytics, or a generic form.
- Prefer an institution-managed approved data-collection system. Do not assume
  that a vendor, encryption, or a checkbox alone establishes legal compliance.
- Never paste secrets into code, chat, logs, or PRs. `PUBLIC_*` variables are public.

## GitHub workflow

- Repository: `reakwind/tali-cukierman-yaffe` (public).
- One small feature per branch/PR. Only the minimum repository seed may be
  committed directly before protections are configured. Do not bundle unrelated
  features or silently push to `main` afterward.
- PR text: why, what changed, real test evidence, screenshots for visual changes,
  and known limitations/approvals needed. Keep it concise.
- The working agent reviews the full diff, confirms required checks for the exact
  head revision, and squash-merges when ready; delete the merged feature branch.
  Recheck if the head changes. Never use an admin bypass to ignore failed checks.
- A solo agent acting as the PR author cannot provide independent self-approval.
  Keep review rules compatible with the agreed solo workflow; request a separate
  reviewer for sensitive clinical content, permissions, billing, and DNS changes.
- Do not alter unfamiliar user work, force-push shared branches, discard changes,
  or merge unreviewed dependency major updates.
- Keep workflow permissions least-privileged, Actions pinned to full commit SHAs,
  and untrusted PR execution isolated from secrets. No privileged PR checkouts.

## Budget and scope

- No new paid subscriptions, larger GitHub runners, billable AI workers, or cloud
  upgrades. Use free public-repository standard runners and modest artifact retention.
- Do not change account-wide billing, DNS, or permissions without explicit consent.
- A custom domain, secure recruitment platform, and institutional approvals remain
  explicit decisions; do not claim they are already configured or free.
- Never claim remote security settings, tests, or deployments exist unless verified.
