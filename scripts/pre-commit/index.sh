#!/bin/sh

# Check if MAIN_DIR is set; if not, use the default directory calculation
if [ -z "$MAIN_DIR" ]; then
    SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)/../scripts/pre-commit"
else
    SCRIPT_DIR="$MAIN_DIR"
fi

. "$SCRIPT_DIR/log.sh"
log "Running pre-commit scripts from directory [${SCRIPT_DIR}]"


. "$SCRIPT_DIR/version.sh"

log 'All pre-commit checks passed.'
exit 0
