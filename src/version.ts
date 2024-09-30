import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'

interface PackageJson {
	version: string
}

/**
 * Retrieves the version from the previous commit's package.json.
 *
 * @returns {string} The previous version string.
 * @throws {Error} If fetching fails.
 */
function getPreviousVersion(): string {
	try {
		const previousPackageJson: string = execSync('git show HEAD~1:package.json', { encoding: 'utf8' })
		const data: PackageJson = JSON.parse(previousPackageJson)

		return data.version
	} catch (error: unknown) {
		throw new Error(`Failed fetching previous package.json with error [${error}]`)
	}
}

/**
 * Retrieves the current version from package.json.
 *
 * @returns {string} The current version string.
 * @throws {Error} If reading fails.
 */
function getCurrentVersion(): string {
	try {
		const packageJsonPath: string = path.resolve(process.cwd(), 'package.json')
		const packageJson: string = fs.readFileSync(packageJsonPath, 'utf8')
		const data: PackageJson = JSON.parse(packageJson)

		return data.version
	} catch (error: unknown) {
		throw new Error(`Failed reading current package.json with error [${error}]`)
	}
}

/**
 * Compares the previous and current package.json versions.
 *
 * @returns {boolean} True if versions differ, false otherwise.
 * @throws {Error} If fetching or reading package.json fails.
 */
function compareVersions(): boolean {
	const previous: string = getPreviousVersion()
	const current: string = getCurrentVersion()

	if (previous !== current) {
		console.log(`Version changed from [${previous}] to [${current}].`)

		return true
	}

	console.error('Version has not been changed. Please update the version before committing.')

	return false
}

export { compareVersions, getCurrentVersion, getPreviousVersion }
