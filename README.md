<div align="center">

![Code Size](https://img.shields.io/github/languages/code-size/krauters/utils)
![Commits per Month](https://img.shields.io/github/commit-activity/m/krauters/utils)
![Contributors](https://img.shields.io/github/contributors/krauters/utils)
![Forks](https://img.shields.io/github/forks/krauters/utils)
![GitHub Stars](https://img.shields.io/github/stars/krauters/utils)
![Install Size](https://img.shields.io/npm/npm/dw/@krauters%2Futils)
![GitHub Issues](https://img.shields.io/github/issues/krauters/utils)
![Last Commit](https://img.shields.io/github/last-commit/krauters/utils)
![License](https://img.shields.io/github/license/krauters/utils)
<a href="https://www.linkedin.com/in/coltenkrauter" target="_blank"><img src="https://img.shields.io/badge/LinkedIn-%230077B5.svg?&style=flat-square&logo=linkedin&logoColor=white" alt="LinkedIn"></a>
[![npm version](https://img.shields.io/npm/v/@krauters%2Futils.svg?style=flat-square)](https://www.npmjs.org/package/@krauters/utils)
![Open PRs](https://img.shields.io/github/issues-pr/krauters/utils)
![Repo Size](https://img.shields.io/github/repo-size/krauters/utils)
![Version](https://img.shields.io/github/v/release/krauters/utils)
![visitors](https://visitor-badge.laobi.icu/badge?page_id=krauters/utils)

</div>

# @krauters/utils

A versatile TypeScript utility package packed with reusable, type-safe functions, scripts useful for all kinds of TypeScript projects, and precommit scripts to streamline your development workflow.

## Husky

Husky helps manage Git hooks easily, automating things like running tests or linting before a commit is made. This ensures your code is in good shape.

Pre-commit hooks run scripts before a commit is finalized to catch issues or enforce standards. With Husky, setting up these hooks across your team becomes easy, keeping your codebase clean and consistent.

### Our Custom Pre-Commit Hook

This project uses a custom pre-commit hook to run `npm run bundle`. This ensures that our bundled assets are always up to date before any commit (which is especially important for TypeScript GitHub Actions). Husky automates this, so no commits will go through without a fresh bundle, keeping everything streamlined.

### Using Utils as Pre-Commit Hooks

```sh
# ./husky/pre-commit
#!/bin/sh

MAIN_DIR=./node_modules/@krauters/utils/scripts/pre-commit
. $MAIN_DIR/index.sh

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

## 🔗 Other packages in the family
We’ve got more than just this one in our toolbox – check out the rest of our `@krauters` collection on [npm/@krauters](https://www.npmjs.com/search?q=%40krauters). It’s the whole kit and caboodle you didn’t know you needed.
