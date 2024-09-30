#!/bin/sh

# This script is an example of how a pre-commit hook might be set up 
# to execute pre-commit scripts from @krauters/utils.
#
# Prerequisite: Make sure to install @krauters/utils and ts-node in your project
# npm install --save-dev @krauters/utils ts-node

RED='\033[1;31m'
GREEN='\033[1;32m'
NC='\033[0m'

PREFIX="[@krauters/utils]"

log() {
    echo "${GREEN}${PREFIX}${NC} $1"
}

error() {
    echo "${RED}${PREFIX}${NC} $1$"
}

log "Running pre-commit scripts..."

# Adjust the path based on whether it's run from node_modules or locally as shown
# if ! OUTPUT=$(npx ts-node ./node_modules/@krauters/utils/scripts/pre-commit.ts 2>&1); then
if ! OUTPUT=$(npx ts-node ./pre-commit.ts 2>&1); then
    error "Pre-commit check failed:\n\n${OUTPUT}\n"
    error "Aborting commit."
    error "Run commit with '-n' to skip pre-commit hooks."
    exit 1
fi

log "Script output...\n\n${OUTPUT}\n"
log "Pre-commit checks passed."
exit 0
