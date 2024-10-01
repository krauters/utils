import { existsSync, readFileSync } from 'fs'
import { dirname, join } from 'path'

import type { PackageJsonType as PackageJsonType } from './structures'

export class PackageJson {
	/**
	 * Recursively searches for package.json starting from the given directory and moving up.
	 *
	 * @param dir - The directory to start searching from (defaults to current working directory).
	 * @returns The found PackageJson object.
	 * @throws {Error} If package.json is not found or cannot be read.
	 */
	static findPackageJson(dir: string = process.cwd()): PackageJsonType {
		const packageJsonPath = dir.includes('package.json') ? dir : join(dir, 'package.json')

		if (existsSync(packageJsonPath)) {
			return PackageJson.readPackageJson(packageJsonPath)
		}

		const parentDir = dirname(dir)
		if (parentDir === dir) {
			throw new Error('No package.json found in this project hierarchy.')
		}

		return PackageJson.findPackageJson(parentDir)
	}

	/**
	 * Converts a package name to a formatted title.
	 * Removes the scope, splits by hyphens, capitalizes each word, and joins them with spaces.
	 *
	 * @param packageName - The original package name.
	 * @param packageNameScopeRegex - The regex to remove the scope from the package name.
	 * @returns The formatted title.
	 */
	static packageNameToTitle(packageName: string, packageNameScopeRegex: RegExp): string {
		const nameWithoutScope: string = packageName.replace(packageNameScopeRegex, '')

		return nameWithoutScope
			.split('-')
			.map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
			.join(' ')
	}

	/**
	 * Reads and parses the package.json file.
	 *
	 * @param packageJsonPath - The path to the package.json file.
	 * @returns The parsed PackageJson object.
	 * @throws Will throw an error if the file cannot be read or parsed.
	 */
	static readPackageJson(packageJsonPath: string): PackageJsonType {
		try {
			const packageJsonContent: string = readFileSync(packageJsonPath, 'utf8')
			const packageJson: PackageJsonType = JSON.parse(packageJsonContent)
			console.info(`Extracted package name [${packageJson.name}]`)

			return packageJson
		} catch (error: unknown) {
			if (error instanceof Error) {
				throw new Error(`Failed to read package.json at [${packageJsonPath}] with error [${error.message}]`)
			} else {
				throw new Error(`Failed to read package.json at [${packageJsonPath}] with unknown error.`)
			}
		}
	}
}

export const { findPackageJson, packageNameToTitle, readPackageJson } = PackageJson
