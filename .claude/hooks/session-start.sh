#!/bin/sh
# SessionStart hook. In Claude Code cloud sessions it installs dependencies
# when they are missing or older than the lockfile, and tells the agent when
# the pinned Node is not the one running (the environment's setup script,
# scripts/cloud-setup.sh, is missing or failed). On a Mac it does nothing.
set -eu

[ "${CLAUDE_CODE_REMOTE:-}" = "true" ] || exit 0
cd "${CLAUDE_PROJECT_DIR:-.}"

want="v$(tr -d '[:space:]' <.node-version)"
have="$(node --version 2>/dev/null || echo 'no Node')"
if [ "$have" != "$want" ]; then
  echo "This cloud session runs Node $have, but the project pins $want, so" \
    "browser tests may fail here. The environment's setup script is missing" \
    "or failed: see docs/operations.md, Cloud session setup."
fi

if [ ! -f node_modules/.package-lock.json ] ||
  [ package-lock.json -nt node_modules/.package-lock.json ]; then
  npm ci --no-audit --no-fund >&2 ||
    echo "npm ci failed in the SessionStart hook; run it before testing."
fi
