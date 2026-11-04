#!/bin/bash
# Installs the toolchain this project pins, for Claude Code cloud sessions:
# Node from .node-version and the browsers @playwright/test expects. Anything
# already installed is skipped, so it is quick to run again.
#
#   bash scripts/toolchain.sh [all|node|browsers]   versions from this checkout
#   bash scripts/toolchain.sh versions              print the pinned versions
#   bash scripts/toolchain.sh check-browsers        exit 1 if browsers missing
#   ... | bash -s -- --from-main [all]              versions from GitHub main
#
# The cloud environment's setup script (scripts/cloud-setup.sh) runs it with
# --from-main; the SessionStart hook runs it to repair a session whose
# checkout pins other versions than the cached environment has.
set -euo pipefail

RAW=https://raw.githubusercontent.com/Reakwind/tali-cukierman-yaffe/main
FROM_MAIN=false
if [ "${1:-}" = "--from-main" ]; then
  FROM_MAIN=true
  shift
fi
COMMAND="${1:-all}"

# The image always has some Node; it is only used here to read JSON.
playwright_version() {
  node -e 'process.stdout.write(JSON.parse(require("fs").readFileSync(0, "utf8")).devDependencies["@playwright/test"] ?? "")'
}

if [ "$FROM_MAIN" = true ]; then
  NODE_VERSION="$(curl -fsSL "$RAW/.node-version" | tr -d '[:space:]')"
  PLAYWRIGHT_VERSION="$(curl -fsSL "$RAW/package.json" | playwright_version)"
  ROOT=""
else
  ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
  NODE_VERSION="$(tr -d '[:space:]' <"$ROOT/.node-version")"
  PLAYWRIGHT_VERSION="$(playwright_version <"$ROOT/package.json")"
fi

# Plain versions only: these values reach URLs and commands below.
for VERSION in "$NODE_VERSION" "$PLAYWRIGHT_VERSION"; do
  if ! [[ "$VERSION" =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
    echo "toolchain: not a plain version: '$VERSION'" >&2
    exit 2
  fi
done

install_node() {
  # The official build, checked against the checksums nodejs.org publishes.
  # ~/.local/bin comes before the image's Node on PATH, so shells, hooks and
  # Claude Code find it.
  local arch dir tmp file url
  case "$(uname -m)" in
    x86_64) arch=x64 ;;
    aarch64 | arm64) arch=arm64 ;;
    *) echo "toolchain: unsupported architecture $(uname -m)" >&2 && return 1 ;;
  esac
  dir="/opt/node-v$NODE_VERSION"
  if [ ! -x "$dir/bin/node" ]; then
    tmp="$(mktemp -d)"
    file="node-v$NODE_VERSION-linux-$arch.tar.xz"
    url="https://nodejs.org/dist/v$NODE_VERSION/"
    curl -fsSL -o "$tmp/$file" "$url$file"
    curl -fsSL -o "$tmp/SHASUMS256.txt" "${url}SHASUMS256.txt"
    (cd "$tmp" && grep " $file\$" SHASUMS256.txt | sha256sum --check --status)
    mkdir -p "$dir"
    tar -xJf "$tmp/$file" -C "$dir" --strip-components=1
    rm -rf "$tmp"
  fi
  mkdir -p "$HOME/.local/bin"
  for tool in node npm npx corepack; do
    ln -sf "$dir/bin/$tool" "$HOME/.local/bin/$tool"
  done
}

install_browsers() {
  # The builds this Playwright version expects, with their system libraries,
  # in the folder the image tells Playwright to use.
  export PLAYWRIGHT_BROWSERS_PATH="${PLAYWRIGHT_BROWSERS_PATH:-/opt/pw-browsers}"
  PATH="/opt/node-v$NODE_VERSION/bin:$PATH" npx --yes \
    "playwright@$PLAYWRIGHT_VERSION" install --with-deps chromium firefox webkit
}

# Lists the browsers @playwright/test in node_modules expects but are not
# installed; exits 1 when any is missing.
check_browsers() {
  PLAYWRIGHT_BROWSERS_PATH="${PLAYWRIGHT_BROWSERS_PATH:-/opt/pw-browsers}" \
    node -e '
      const { existsSync, readFileSync } = require("fs");
      const { join } = require("path");
      const wanted = ["chromium", "chromium-headless-shell", "firefox", "webkit"];
      const { browsers } = JSON.parse(readFileSync(process.argv[1], "utf8"));
      const missing = browsers
        .filter((b) => wanted.includes(b.name))
        .map((b) => `${b.name.replaceAll("-", "_")}-${b.revision}`)
        .filter((d) => !existsSync(join(process.env.PLAYWRIGHT_BROWSERS_PATH, d, "INSTALLATION_COMPLETE")));
      if (missing.length) { console.log(missing.join(" ")); process.exit(1); }
    ' "$ROOT/node_modules/playwright-core/browsers.json"
}

case "$COMMAND" in
  versions) echo "node=$NODE_VERSION playwright=$PLAYWRIGHT_VERSION" ;;
  node) install_node ;;
  browsers) install_browsers ;;
  check-browsers) check_browsers ;;
  all)
    install_node
    install_browsers
    ;;
  *)
    echo "toolchain: unknown command '$COMMAND'" >&2
    exit 2
    ;;
esac
