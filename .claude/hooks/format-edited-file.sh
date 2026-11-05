#!/bin/sh
# PostToolUse hook: formats the file Claude just edited or wrote with the
# project's Prettier, so `npm run format:check` does not fail on its edits.
# Files outside the project, ignored files and unknown types are left alone.
set -eu

repo="$(cd "$(dirname "$0")/../.." && pwd)"
project="${CLAUDE_PROJECT_DIR:-$repo}"
prettier="$repo/node_modules/.bin/prettier"
[ -x "$prettier" ] || exit 0

file="$(node -e '
  let s = "";
  process.stdin.on("data", (d) => (s += d)).on("end", () => {
    try { process.stdout.write(JSON.parse(s).tool_input?.file_path ?? ""); }
    catch { /* not JSON: nothing to format */ }
  });
')"
[ -n "$file" ] && [ -f "$file" ] || exit 0
case "$file" in "$project"/*) ;; *) exit 0 ;; esac

cd "$project"
if ! "$prettier" --write --ignore-unknown --log-level warn "$file" >&2; then
  echo "Prettier could not format $file; fix its syntax." >&2
  exit 2
fi
