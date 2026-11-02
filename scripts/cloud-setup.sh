#!/bin/bash
# Setup script for Claude Code cloud sessions (claude.ai/code).
# Paste this file's contents into the cloud environment's settings:
# environment menu in the session title bar -> Edit -> Setup script.
# It runs before each new session, without the repository checked out, so
# the versions below are written out. Keep them in step with .node-version
# and the @playwright/test version in package.json.
set -euo pipefail

NODE_VERSION=24.22.2
PLAYWRIGHT_VERSION=1.64.1

# Node: the project's exact version, first on PATH for every new shell.
export NVM_DIR=/opt/nvm
# shellcheck disable=SC1091
. "$NVM_DIR/nvm.sh"
nvm install "$NODE_VERSION"
NODE_BIN="$NVM_DIR/versions/node/v$NODE_VERSION/bin"
grep -qF "$NODE_BIN" ~/.bashrc ||
  printf 'export PATH="%s:$PATH"\n' "$NODE_BIN" >>~/.bashrc

# Browsers: the builds the pinned Playwright expects, with system libraries,
# so Chromium, Firefox and WebKit tests can run in the session as in CI.
PATH="$NODE_BIN:$PATH" npx --yes "playwright@$PLAYWRIGHT_VERSION" install \
  --with-deps chromium firefox webkit
