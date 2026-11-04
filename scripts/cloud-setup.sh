#!/bin/bash
# Setup script for Claude Code cloud sessions (claude.ai/code).
# Paste this file's contents into the cloud environment's settings once:
# environment menu in the session title bar -> Edit -> Setup script.
#
# It holds no versions. It installs the Node and Playwright browsers that the
# main branch pins, using the repository's scripts/toolchain.sh, so version
# updates never need a new paste. The environment caches the result for about
# a week; a session whose checkout pins other versions is repaired by the
# SessionStart hook.
set -uo pipefail

TOOLCHAIN=https://raw.githubusercontent.com/Reakwind/tali-cukierman-yaffe/main/scripts/toolchain.sh
curl -fsSL "$TOOLCHAIN" | bash -s -- --from-main all || echo "Toolchain setup failed; the SessionStart hook retries it in the session."
