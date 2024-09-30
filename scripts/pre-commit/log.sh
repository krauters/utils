#!/bin/sh

# This script provides reusable logging functions for other scripts.

# Color codes
RED='\033[1;31m'
GREEN='\033[1;32m'
NC='\033[0m' # No Color

# Prefix for log messages
PREFIX='[CHECKS]'

# Log functions
log() {
    echo "${GREEN}${PREFIX}${NC} $1"
}

error() {
    echo "${RED}${PREFIX}${NC} $1"
}
