import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'

interface PackageJson {
	version: string
}

/**
 * Retrieves the version from a specified Git reference's package.json.
 *
 * @param ref The Git reference (e.g., "HEAD", "HEAD~1")
 * @returns The version string from the package.json
 * @throws {Error} If fetching fails
 */
function getVersionFromGit(ref: string): string {
	try {
		const packageJsonContent: string = execSync(`git show ${ref}:package.json`, { encoding: 'utf8' })
		const data: PackageJson = JSON.parse(packageJsonContent)

		return data.version
	} catch (error: unknown) {
		throw new Error(`Failed fetching package.json from ${ref} with error [${error}]`)
	}
}

/**
 * Recursively searches for package.json starting from the given directory and moving up.
 *
 * @param dir The directory to start searching from (defaults to current working directory)
 * @returns The version string from the found package.json
 * @throws {Error} If package.json is not found or cannot be read
 */
function getLocalVersion(dir: string = process.cwd()): string {
	const packageJsonPath = path.join(dir, 'package.json')

	if (fs.existsSync(packageJsonPath)) {
		try {
			const packageJsonContent = fs.readFileSync(packageJsonPath, 'utf8')
			const data: PackageJson = JSON.parse(packageJsonContent)

			return data.version
		} catch (error: unknown) {
			throw new Error(`Failed reading local package.json at ${packageJsonPath} with error [${error}]`)
		}
	}

	// Move up to the parent directory
	const parentDir = path.dirname(dir)
	if (parentDir === dir) {
		throw new Error('No package.json found in this project')
	}

	return getLocalVersion(parentDir)
}

/**
 * Retrieves the commit SHA for a specified Git reference.
 *
 * @param ref The Git reference (e.g., "HEAD", "HEAD~1")
 * @param short If true, fetch the short SHA (default is true)
 * @returns The commit SHA
 */
function getCommitSha(ref: string, short = true): string {
	try {
		const command = `git rev-parse ${short ? '--short' : ''} ${ref}`

		return execSync(command, { encoding: 'utf8' }).trim()
	} catch (error: unknown) {
		throw new Error(`Failed to get commit SHA for ${ref} with error [${error}]`)
	}
}

/**
 * Retrieves the version from the previous commit's package.json.
 *
 * @returns The previous version string
 */
function getPreviousVersion(): string {
	return getVersionFromGit('HEAD~1')
}

/**
 * Compares the previous and current package.json versions.
 *
 * @param [allowMatchWithoutError=false] - If true, do not throw an error when versions match
 * @throws {Error} If versions are the same and `allowMatchWithoutError` is false
 * @returns
 */
function compareVersions(allowMatchWithoutError = false): void {
	const previous: string = getPreviousVersion()
	const current: string = getLocalVersion()
	const previousSha = getCommitSha('HEAD~1')

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

export { compareVersions, getLocalVersion as getCurrentVersion, getPreviousVersion }
