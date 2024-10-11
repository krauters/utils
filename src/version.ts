import { execSync } from 'child_process'

import type { PackageJsonType as PackageJsonType } from './structures'

import { PackageJson } from './package-json'

export class Version {
	/**
	 * Compares the previous and current package.json versions.
	 *
	 * @param allowMatchWithoutError - If true, do not throw an error when versions match.
	 * @throws {Error} If versions are the same and `allowMatchWithoutError` is false.
	 */
	static compareVersions(allowMatchWithoutError = false): void {
		const previous: string = Version.getPreviousVersion()
		const current: string = Version.getLocalVersion()
		const previousSha: string = Version.getCommitSha('HEAD~1')

		if (previous !== current) {
			console.log(
				`Version changed from [${previous}] (commit: ${previousSha}) to [${current}] (latest local changes).`,
			)

			return
		}

		const message = `Version has not been changed:
    Previous version: [${previous}] (commit: ${previousSha})
    Current version: [${current}] (latest local changes)
    Please update the version before committing.`

		if (!allowMatchWithoutError) {
			throw new Error(message)
		}

		console.warn(message)
	}

	/**
	 * Retrieves the commit SHA for a specified Git reference.
	 *
	 * @param ref - The Git reference (e.g., "HEAD", "HEAD~1").
	 * @param short - If true, fetch the short SHA (default is true).
	 * @returns The commit SHA.
	 */
	static getCommitSha(ref: string, short = true): string {
		try {
			const command = `git rev-parse ${short ? '--short' : ''} ${ref}`

			return execSync(command, { encoding: 'utf8' }).trim()
		} catch (error: unknown) {
			if (error instanceof Error) {
				throw new Error(`Failed to get commit SHA for ${ref} with error [${error.message}]`)
			} else {
				throw new Error(`Failed to get commit SHA for ${ref} with unknown error.`)
			}
		}
	}

	/**
	 * Recursively searches for package.json starting from the given directory and moving up.
	 *
	 * @param dir - The directory to start searching from (defaults to current working directory).
	 * @returns The version string from the found package.json.
	 * @throws {Error} If package.json is not found or cannot be read.
	 */
	static getLocalVersion(dir: string = process.cwd()): string {
		const packageJson: PackageJsonType = PackageJson.findPackageJson(dir)

		return packageJson.version
	}

	/**
	 * Retrieves the version from the previous commit's package.json.
	 *
	 * @returns The previous version string.
	 */
	static getPreviousVersion(): string {
		return Version.getVersionFromGit('HEAD~1')
	}

	/**
	 * Retrieves the version from a specified Git reference's package.json.
	 *
	 * @param ref - The Git reference (e.g., "HEAD", "HEAD~1").
	 * @returns The version string from the package.json.
	 * @throws {Error} If fetching fails.
	 */
	static getVersionFromGit(ref: string): string {
		try {
			const packageJsonContent: string = execSync(`git show ${ref}:package.json`, { encoding: 'utf8' })
			const data: PackageJsonType = JSON.parse(packageJsonContent)

			return data.version
		} catch (error: unknown) {
			if (error instanceof Error) {
				throw new Error(`Failed fetching package.json from ${ref} with error [${error.message}]`)
			} else {
				throw new Error(`Failed fetching package.json from ${ref} with unknown error.`)
			}
		}
	}
}

export const { compareVersions, getCommitSha, getLocalVersion, getPreviousVersion, getVersionFromGit } = Version
