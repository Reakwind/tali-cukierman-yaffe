# Contributing

Read `AGENTS.md` and the project brief before changing code or content.

1. From the root `main` checkout, run `npm run session:start -- <slug>` and work
   in the worktree it creates.
2. Describe the audience need and acceptance behavior.
3. Write the test and run it. Confirm it fails for the intended missing behavior.
4. Implement the simplest change, verify green, then refactor if needed.
   Commit each change (code or docs) on its own.
5. Run `npm run verify`; inspect both language versions for visual changes.
6. At the end of the day, run `npm run day:finish` for one draft PR of all the
   day's commits. Complete its why/what, actual red/green evidence and limitations.
7. The working agent reviews the diff and required checks on the exact revision,
   then squash-merges. The next `session:start` trims merged worktrees and
   fast-forwards root `main`. No direct main pushes or protection bypasses.

For biography, study, recruitment, and translated medical content, distinguish
editorial drafts from team-approved material. Public sources do not replace
institutional approval of recruitment advertising. No patient details, medical
documents, credentials, or confidential research belong in issues or PRs.

Use private vulnerability reporting for security issues; see `SECURITY.md`.
