import { debuggable } from '@krauters/debuggable'
import { log } from '@krauters/logger'
import { PackageJson as PackageJsonType } from '@krauters/structures'
import { existsSync, readFileSync } from 'fs'
import { dirname, join } from 'path'

interface LoadPackageJsonOptions {
	// eslint-disable-next-line @stylistic/ts/lines-around-comment
	/**
	 * When set to `true`, the method will return `undefined` rather than
	 * throwing an error if reading or parsing `package.json` fails.
	 */
	returnUndefinedOnError?: boolean
}

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
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				return PackageJson.loadPackageJson(packageJsonPath)!
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
	 * @param options - The options object controlling method behavior.
	 * @returns The parsed `PackageJson` object, or `undefined` if `options.returnUndefinedOnError` is `true`
	 *          and an error occurs.
	 * @throws Will throw an error if `options.returnUndefinedOnError` is `false` (default) and the file
	 *         cannot be read or parsed.
	 */
	static loadPackageJson(packageJsonPath: string, options: LoadPackageJsonOptions = {}): PackageJsonType | undefined {
		// Destructure the options and set a default value for `returnUndefinedOnError`
		const { returnUndefinedOnError = false } = options

		try {
			const packageJsonContent = readFileSync(packageJsonPath, 'utf8')
			const packageJson: PackageJsonType = JSON.parse(packageJsonContent)
			log.info(`Extracted package name [${packageJson.name}]`)

			return packageJson
		} catch (error: unknown) {
			if (returnUndefinedOnError) {
				log.warn(
					`Failed to read package.json at [${packageJsonPath}] with error [${String(error)}], returning undefined.`,
				)

				return undefined
			}

			throw new Error(`Failed to read package.json at [${packageJsonPath}] with an unknown error.`)
		}
	}
}

export const { formatPackageName, getPackageJson, loadPackageJson } = PackageJson
