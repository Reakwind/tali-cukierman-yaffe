---
name: day-finish
description: Open, check and merge the day's single pull request. Run only when the owner asks for the day's PR.
disable-model-invocation: true
---

The owner asked for today's pull request. Claude Code asks them to confirm
before the pull request opens and before it merges.

1. Every session worktree must be committed and pushed; `npm run day:finish`
   refuses while one has uncommitted changes.
2. From the root checkout run `npm run day:finish`. It merges the day's
   `session/*` branches into `day/<date>`, pushes it and opens one draft pull
   request listing every commit. To fold in a cloud session's branch, add
   `-- --include origin/<branch>`.
3. Fill in the pull request from `.github/pull_request_template.md`: why, real
   red/green evidence per change, screenshots of visual changes in both
   languages, limits and approvals still needed.
4. Review the full diff: `git diff origin/main...origin/day/<date>`.
5. Confirm `npm run verify` passes and CI is green on the exact head commit.
6. Merge with `gh pr merge --squash --delete-branch`. GitHub deletes the remote
   branch; the next `session:start` or `npm run day:cleanup` removes the local
   worktrees and branches.

A solo agent cannot approve its own work. Stop and ask the owner for a separate
reviewer when the pull request touches sensitive clinical content,
permissions, billing or DNS.
