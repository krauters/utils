# Utils
A versatile TypeScript utility package packed with reusable, type-safe functions, scripts useful for all kinds of TypeScript projects, and precommit scripts to streamline your development workflow.

## Husky

Husky helps manage Git hooks easily, automating things like running tests or linting before a commit is made. This ensures your code is in good shape.

Pre-commit hooks run scripts before a commit is finalized to catch issues or enforce standards. With Husky, setting up these hooks across your team becomes easy, keeping your codebase clean and consistent.

### Our Custom Pre-Commit Hook

This project uses a custom pre-commit hook to run `npm run bundle`. This ensures that our bundled assets are always up to date before any commit (which is especially important for TypeScript GitHub Actions). Husky automates this, so no commits will go through without a fresh bundle, keeping everything streamlined.

### Using Utils as Pre-Commit Hooks

```sh
./husky/pre-commit
#!/bin/sh

RED='\033[1;31m'
GREEN='\033[1;32m'
NC='\033[0m'

PREFIX="${GREEN}[HUSKY]${NC} "

if ! OUTPUT=$(npx ts-node ./node_modules/@krauters/utils/src/version.ts 2>&1); then
    echo -e "${RED}${PREFIX}${OUTPUT}${NC}"
    echo -e "${RED}${PREFIX}Aborting commit.${NC}"
    echo -e "${RED}${PREFIX}Run commit with '-n' to skip pre-commit hooks.${NC}"
    exit 1
fi

```

## Contributing

The goal of this project is to continually evolve and improve its core features, making it more efficient and easier to use. Development happens openly here on GitHub, and we’re thankful to the community for contributing bug fixes, enhancements, and fresh ideas. Whether you're fixing a small bug or suggesting a major improvement, your input is invaluable.

## License

This project is licensed under the ISC License. Please see the [LICENSE](./LICENSE) file for more details.

## 🥂 Thanks Contributors

Thanks for spending time on this project.

<a href="https://github.com/krauters/utils/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=krauters/utils" />
</a>
