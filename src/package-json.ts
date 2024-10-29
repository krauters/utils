import { debuggable } from '@krauters/debuggable'
import { log } from '@krauters/logger'
import { PackageJson as PackageJsonType } from '@krauters/structures'
import { existsSync, readFileSync } from 'fs'
import { dirname, join } from 'path'

interface PackageJsonOptions {
	maxDepth?: number
	scopeRegex?: RegExp
	startDir?: string
}

@debuggable(log)
export class PackageJson {
	/**
	 * Converts a package name to a formatted title by removing the scope, splitting by hyphens,
	 * capitalizing each word, and joining them with spaces.
	 *
	 * @param packageName The original package name.
	 * @param options The options object containing a scopeRegex to remove the package scope.
	 * @returns The formatted title.
	 */
	static formatPackageName(packageName: string, { scopeRegex = /^@[^/]+\// }: PackageJsonOptions = {}): string {
		const nameWithoutScope: string = packageName.replace(scopeRegex, '')

		return nameWithoutScope
			.split('-')
			.map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
			.join(' ')
	}

	/**
	 * Recursively searches for package.json starting from the specified directory and moving up the directory tree.
	 * Stops traversal when the maximum directory depth limit is reached or when no more parent directories are available.
	 *
	 * @param options The options object containing parameters like startDir and maxDepth.
	 * @returns The found PackageJson object.
	 * @throws {Error} If package.json is not found within the directory hierarchy or cannot be read.
	 */
	static getPackageJson({ maxDepth = 10, startDir = process.cwd() }: PackageJsonOptions = {}): PackageJsonType {
		let currentDir = startDir
		let depth = 0
		const checkedDirs = []

		while (depth < maxDepth) {
			checkedDirs.push(currentDir)
			const packageJsonPath = join(currentDir, 'package.json')

			if (existsSync(packageJsonPath)) {
				return PackageJson.loadPackageJson(packageJsonPath)
			}

			const parentDir = dirname(currentDir)
			if (parentDir === currentDir) {
				throw new Error(`No package.json found during directory traversal of dirs [${checkedDirs.join(', ')}].`)
			}

			currentDir = parentDir
			depth++
		}

		throw new Error(
			`Reached maximum directory traversal depth without finding a package.json. Checked dirs [${checkedDirs.join(', ')}].`,
		)
	}

	/**
	 * Reads and parses the package.json file.
	 *
	 * @param packageJsonPath - The path to the package.json file.
	 * @returns The parsed PackageJson object.
	 * @throws Will throw an error if the file cannot be read or parsed.
	 */
	static loadPackageJson(packageJsonPath: string): PackageJsonType {
		try {
			const packageJsonContent: string = readFileSync(packageJsonPath, 'utf8')
			const packageJson: PackageJsonType = JSON.parse(packageJsonContent)
			log.info(`Extracted package name [${packageJson.name}]`)

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

export const { formatPackageName, getPackageJson, loadPackageJson } = PackageJson
