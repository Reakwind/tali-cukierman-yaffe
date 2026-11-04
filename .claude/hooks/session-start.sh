#!/bin/sh
# SessionStart hook. In Claude Code cloud sessions it makes the session match
# this checkout: the pinned Node, current dependencies and the browsers
# @playwright/test expects (scripts/toolchain.sh installs what is missing).
# It prints only what it changed or could not fix. On a Mac it does nothing.
set -eu

[ "${CLAUDE_CODE_REMOTE:-}" = "true" ] || exit 0
cd "${CLAUDE_PROJECT_DIR:-.}"

want="v$(tr -d '[:space:]' <.node-version)"
have="$(node --version 2>/dev/null || echo 'no Node')"
if [ "$have" != "$want" ]; then
  if bash scripts/toolchain.sh node >&2 &&
    [ "$(node --version 2>/dev/null)" = "$want" ]; then
    echo "Installed Node $want (the cloud environment had $have)."
  else
    echo "This cloud session runs Node $have, but the project pins $want, so" \
      "browser tests may fail here. Installing it failed: see" \
      "docs/operations.md, Cloud session setup."
  fi
fi

if [ ! -f node_modules/.package-lock.json ] ||
  [ package-lock.json -nt node_modules/.package-lock.json ]; then
  npm ci --no-audit --no-fund >&2 ||
    echo "npm ci failed in the SessionStart hook; run it before testing."
fi

if ! bash scripts/toolchain.sh check-browsers >/dev/null 2>&1; then
  if bash scripts/toolchain.sh browsers >&2 &&
    bash scripts/toolchain.sh check-browsers >/dev/null 2>&1; then
    echo "Installed the Playwright browsers this checkout pins."
  else
    echo "The Playwright browsers this checkout pins are missing and could" \
      "not be installed; run 'bash scripts/toolchain.sh browsers'."
  fi
fi
