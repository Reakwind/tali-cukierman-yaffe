#!/bin/sh
# Blocks destructive git and GitHub CLI commands in agent Bash invocations.
set -eu

INPUT="$(cat)"

COMMAND="$(node -e '
const fs = require("node:fs");
const raw = fs.readFileSync(0, "utf8").trim();
if (!raw) process.exit(0);
try {
  const parsed = JSON.parse(raw);
  const cmd = parsed?.tool_input?.command ?? parsed?.command ?? "";
  process.stdout.write(String(cmd));
} catch {
  process.stdout.write(raw);
}
' <<EOF
$INPUT
EOF
)"

if [ -z "$COMMAND" ]; then
  exit 0
fi

refuse() {
  printf 'REFUSED git-safety: %s. Fix: %s.\n' "$1" "$2" >&2
  exit 2
}

case "$COMMAND" in
  *"git push"*"--force"*|*"git push"*" -f "*|*"git push -f"|*"git push"*"--mirror"*)
    refuse "Force pushes are forbidden" "Push a fast-forward commit on your feature branch or open a new PR"
    ;;
  *"git push origin main"*|*"git push -u origin main"*|*"git push origin HEAD:main"*|*"git push origin main:main"*|*"git push origin refs/heads/main"*)
    refuse "Direct pushes to main are forbidden" "Push to a <type>/<slug> feature branch and open a pull request"
    ;;
  *"git reset --hard"*)
    refuse "git reset --hard is forbidden because it destroys uncommitted work" "Inspect git status/diff and revert specific lines or commits safely"
    ;;
  *"git clean -f"*|*"git clean -d"*|*"git clean -fd"*|*"git clean -df"*)
    refuse "git clean -f/-d is forbidden because it deletes untracked files permanently" "Remove only explicitly verified temporary files"
    ;;
  *"git checkout -- ."*|*"git checkout ."*|*"git restore ."*|*"git restore --staged --worktree ."*)
    refuse "Whole-tree checkout/restore is forbidden" "Restore only specific paths you verified"
    ;;
  *"git branch -D"*|*"git branch --delete --force"*)
    refuse "Force-deleting branches (git branch -D) is forbidden" "Keep unmerged branches intact or merge via PR with --delete-branch"
    ;;
  *"git filter-branch"*|*"git filter-repo"*|*"git update-ref -d"*)
    refuse "Rewriting git history is forbidden" "Create a new forward commit on a feature branch"
    ;;
  *"gh pr merge"*"--admin"*)
    refuse "Merging with --admin bypass is forbidden" "Wait for required status checks to pass, then run gh pr merge --squash --delete-branch"
    ;;
  *"gh repo delete"*|*"gh repo archive"*|*"gh api"*"DELETE"*)
    refuse "Destructive GitHub repository API operations are forbidden" "Ask the repository owner before deleting or archiving remote resources"
    ;;
esac

exit 0
