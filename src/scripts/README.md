# Scripts

This folder contains reusable TypeScript scripts intended for pre-commit checks and other automation tasks, designed to be used across multiple repositories.

## Purpose

- **Centralized Automation:** Provides a consistent way to enforce checks, such as version validation, before committing changes.
- **Ease of Integration:** Ensures all consuming repositories maintain uniform pre-commit behavior.

## Key Script

- **`pre-commit.ts`**: This script handles pre-commit checks (like version validation). It’s meant to be executed via a bash script.

## Usage

1. **Install Dependencies**:
    ```
    npm install --save-dev @krauters/utils ts-node
    ```
2. **Set Up Your Pre-Commit Hook**:
   - Use a bash script to call `pre-commit.ts` (or other specific scripst) in your repo.

For a detailed example, see [example.sh](./example.sh).
