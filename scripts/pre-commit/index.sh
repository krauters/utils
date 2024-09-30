#!/bin/sh

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)/../scripts/pre-commit"

# Source the logging utilities
. "$SCRIPT_DIR/log.sh"

log "Running pre-commit scripts from directory [${SCRIPT_DIR}]"

# Run the version check script
. "$SCRIPT_DIR/version.sh"

log 'All pre-commit checks passed.'
exit 0
