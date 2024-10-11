#!/bin/sh

log 'Running version check...'

# Execute the version check from @krauters/utils
if ! OUTPUT=$(npx ts-node "$SCRIPT_DIR/../../dist/src/scripts/pre-commit.js" 2>&1); then
    error "Version check failed:\n\n${OUTPUT}\n"
    error 'Aborting commit.'
    error "Run commit with '-n' to skip pre-commit hooks."
    exit 1
fi

log "Version check output...\n\n${OUTPUT}\n"
log 'Version check passed.'
