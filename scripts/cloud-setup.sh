#!/bin/bash
# Setup script for Claude Code cloud sessions (claude.ai/code).
# Paste this file's contents into the cloud environment's settings:
# environment menu in the session title bar -> Edit -> Setup script.
# It runs as root before each new session, without the repository checked
# out, so the versions below are written out. tests/unit/cloud-session.test.ts
# fails when they drift from .node-version or @playwright/test.
set -euo pipefail

NODE_VERSION=24.22.2
PLAYWRIGHT_VERSION=1.64.1

# Node: the official build, checked against the checksums nodejs.org
# publishes. Cloud images ship Node 22 and no version manager. ~/.local/bin is
# before the image's Node on PATH, so shells, hooks and Claude Code find it.
case "$(uname -m)" in
  x86_64) ARCH=x64 ;;
  aarch64 | arm64) ARCH=arm64 ;;
  *) echo "Unsupported architecture: $(uname -m)" >&2 && exit 1 ;;
esac
NODE_DIR="/opt/node-v$NODE_VERSION"
if [ ! -x "$NODE_DIR/bin/node" ]; then
  TMP="$(mktemp -d)"
  FILE="node-v$NODE_VERSION-linux-$ARCH.tar.xz"
  URL="https://nodejs.org/dist/v$NODE_VERSION/"
  curl -fsSL -o "$TMP/$FILE" "$URL$FILE"
  curl -fsSL -o "$TMP/SHASUMS256.txt" "${URL}SHASUMS256.txt"
  (cd "$TMP" && grep " $FILE\$" SHASUMS256.txt | sha256sum --check --status)
  mkdir -p "$NODE_DIR"
  tar -xJf "$TMP/$FILE" -C "$NODE_DIR" --strip-components=1
  rm -rf "$TMP"
fi
mkdir -p "$HOME/.local/bin"
for TOOL in node npm npx corepack; do
  ln -sf "$NODE_DIR/bin/$TOOL" "$HOME/.local/bin/$TOOL"
done

# Browsers: the builds the pinned Playwright expects, with their system
# libraries, in the folder the image tells Playwright to use.
export PLAYWRIGHT_BROWSERS_PATH="${PLAYWRIGHT_BROWSERS_PATH:-/opt/pw-browsers}"
PATH="$NODE_DIR/bin:$PATH" npx --yes "playwright@$PLAYWRIGHT_VERSION" install \
  --with-deps chromium firefox webkit
