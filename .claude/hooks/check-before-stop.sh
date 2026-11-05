#!/bin/sh
# Stop hook: before Claude ends a turn, runs the fast checks (lint, types,
# unit tests) on the checkout as it stands. A failure sends Claude back with
# the output (exit 2). A state that passed is recorded and not checked again,
# so a turn that changes nothing costs nothing. Browser tests stay in
# `npm run verify` and CI. CLAUDE_STOP_CHECK replaces the checks in tests.
set -eu

cd "${CLAUDE_PROJECT_DIR:-.}"
git rev-parse --git-dir >/dev/null 2>&1 || exit 0
check="${CLAUDE_STOP_CHECK:-}"
if [ -z "$check" ]; then
  [ -d node_modules ] || exit 0
  check='npm run --silent lint && npm run --silent check && npm run --silent test:unit'
fi

# The tree of every tracked and untracked (not ignored) file, from a scratch
# copy of the index so the real staging area is left untouched.
index="$(mktemp)"
rm -f "$index"
cp "$(git rev-parse --git-path index)" "$index" 2>/dev/null || true
state="$(GIT_INDEX_FILE="$index" git add -A >/dev/null 2>&1 &&
  GIT_INDEX_FILE="$index" git write-tree)"
rm -f "$index"

stamp="$(git rev-parse --git-path claude-stop-check)"
if [ -f "$stamp" ] && [ "$(cat "$stamp")" = "$state" ]; then
  exit 0
fi

out="$(mktemp)"
if sh -c "$check" >"$out" 2>&1; then
  printf '%s\n' "$state" >"$stamp"
  rm -f "$out"
  exit 0
fi
{
  echo "The fast checks (lint, types, unit tests) fail. Fix them before finishing:"
  tail -n 80 "$out"
} >&2
rm -f "$out"
exit 2
