// version.ts
import type { PackageJson as PackageJsonType } from '@krauters/structures'

import { debuggable } from '@krauters/debuggable'
import { log } from '@krauters/logger'
import { execSync } from 'child_process'

import { PackageJson } from './package-json'

@debuggable(log)
export class Version {
	/**
	 * Compares the local package.json version with the version from a specified branch.
	 *
	 * @param branch The branch to compare to (defaults to 'main').
	 * @param allowMatchWithoutError If true, do not throw an error when versions match.
	 * @throws If versions are the same and `allowMatchWithoutError` is false.
	 */
	static compareVersions(branch = 'main', allowMatchWithoutError = false): void {
		// Fetch the latest changes for the branch
		execSync(`git fetch origin ${branch}`, { encoding: 'utf8' })

		const branchVersion: string = Version.getBranchVersion(branch)
		const currentVersion: string = Version.getLocalVersion()
		const branchSha: string = Version.getCommitSha(branch)

		if (branchVersion !== currentVersion) {
			log.info(
				`Version changed from [${branchVersion}] (branch [${branch}] commit: [${branchSha}]) to [${currentVersion}] (latest local changes).`,
			)

			return
		}

		const message = `Version has not been changed:
Branch version: [${branchVersion}] (branch [${branch}] commit: [${branchSha}])
Current version: [${currentVersion}] (latest local changes)
Please update the version before committing.`

		if (!allowMatchWithoutError) {
			throw new Error(message)
		}

		log.warn(message)
	}

	/**
	 * Retrieves the version from the specified branch's package.json.
	 *
	 * @param branch The branch to get the version from.
	 * @returns The version string from the package.json on the specified branch.
	 * @throws If fetching fails.
	 */
	static getBranchVersion(branch: string): string {
		return Version.getVersionFromGit(branch)
	}

	/**
	 * Retrieves the commit SHA for a specified Git branch.
	 *
	 * @param branch The branch name.
	 * @param short If true, fetch the short SHA (default is true).
	 * @returns The commit SHA.
	 */
	static getCommitSha(branch: string, short = true): string {
		try {
			const command = `git rev-parse ${short ? '--short' : ''} origin/${branch}`

			return execSync(command, { encoding: 'utf8' }).trim()
		} catch (error: unknown) {
			if (error instanceof Error) {
				throw new Error(`Failed to get commit SHA for [origin/${branch}] with error [${error.message}]`)
			} else {
				throw new Error(`Failed to get commit SHA for [origin/${branch}] with unknown error.`)
			}
		}
	}

	/**
	 * Retrieves the local version from package.json.
	 *
	 * @param dir The directory to start searching from (defaults to current working directory).
	 * @returns The version string from the local package.json.
	 * @throws If package.json is not found or cannot be read.
	 */
	static getLocalVersion(dir: string = process.cwd()): string {
		const packageJson: PackageJsonType = PackageJson.getPackageJson({ startDir: dir })

		return packageJson.version
	}

	/**
	 * Retrieves the version from a specified Git branch's package.json.
	 *
	 * @param branch The branch name.
	 * @returns The version string from the package.json.
	 * @throws If fetching fails.
	 */
	static getVersionFromGit(branch: string): string {
		try {
			const packageJsonContent: string = execSync(`git show origin/${branch}:package.json`, { encoding: 'utf8' })
			const data: PackageJsonType = JSON.parse(packageJsonContent)

			return data.version
		} catch (error: unknown) {
			if (error instanceof Error) {
				throw new Error(`Failed fetching package.json from [origin/${branch}] with error [${error.message}]`)
			} else {
				throw new Error(`Failed fetching package.json from [origin/${branch}] with unknown error.`)
			}
		}
	}
}

export const { compareVersions, getBranchVersion, getCommitSha, getLocalVersion, getVersionFromGit } = Version
