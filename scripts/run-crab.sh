#!/usr/bin/env bash
set -euo pipefail

# TransCrab agent wrapper (no model call inside scripts).
#
# Usage:
#   ./scripts/run-crab.sh <url> [--lang zh] [--mode auto|quick|normal|refined] [--audience <name>] [--style <name>] [--config <path>]
#
# What it does:
#   1) Fetch + extract + convert to Markdown
#   2) Writes content/articles/<slug>/source.md + meta.json
#   3) Writes translation prompt files:
#      - canonical: content/articles/<slug>/translate.prompt.txt
#      - compatibility copy (deprecated): content/articles/<slug>/translate.<lang>.prompt.txt
#
# Next step (active agent):
#   - Read agent-task.json or the JSON summary printed to stdout
#   - Translate with the current conversation model
#   - Run the listed draft/final apply steps

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd -- "$SCRIPT_DIR/.." && pwd)"
cd "$REPO_ROOT"
exec node "$SCRIPT_DIR/add-url.mjs" "$@"
