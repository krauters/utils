import { afterAll, beforeAll, describe, expect, it } from '@jest/globals'
import { existsSync, mkdirSync, rmSync, writeFileSync } from 'fs'
import { join } from 'path'

import { PackageJson } from '../src/package-json'

describe('PackageJson', () => {
	const testDir = join(__dirname, 'test-dir')
	const packageJsonPath = join(testDir, 'package.json')

	const validPackageJsonContent = JSON.stringify({
		description: 'A test package.json file',
		name: 'test-package',
		version: '1.0.0',
	})

	// Missing closing brace -> invalid JSON
	const invalidPackageJsonContent = `{
    "name": "test-package",
    "version": "1.0.0",
    "description": "A test package.json file",`

	beforeAll(() => {
		if (!existsSync(testDir)) {
			mkdirSync(testDir)
		}
	})

	afterAll(() => {
		rmSync(testDir, { force: true, recursive: true })
	})

	describe('loadPackageJson', () => {
		it('should read and parse a valid package.json file', () => {
			writeFileSync(packageJsonPath, validPackageJsonContent, 'utf8')

			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			const packageJson = PackageJson.loadPackageJson(packageJsonPath)!

			expect(packageJson.name).toBe('test-package')
			expect(packageJson.version).toBe('1.0.0')
			expect(packageJson.description).toBe('A test package.json file')
		})

		it('should throw an error when reading an invalid package.json file', () => {
			writeFileSync(packageJsonPath, invalidPackageJsonContent, 'utf8')

			expect(() => {
				PackageJson.loadPackageJson(packageJsonPath)
			}).toThrow(/Failed to read package.json/)
		})

		it('should return undefined when reading an invalid package.json file if returnUndefinedOnError is true', () => {
			writeFileSync(packageJsonPath, invalidPackageJsonContent, 'utf8')

			const result = PackageJson.loadPackageJson(packageJsonPath, {
				returnUndefinedOnError: true,
			})

			expect(result).toBeUndefined()
		})

		it('should return undefined if package.json does not exist and returnUndefinedOnError is true', () => {
			rmSync(packageJsonPath, { force: true })

			const result = PackageJson.loadPackageJson(packageJsonPath, {
				returnUndefinedOnError: true,
			})

			expect(result).toBeUndefined()
		})
	})

	describe('getPackageJson', () => {
		it('should find package.json in the current directory', () => {
			writeFileSync(packageJsonPath, validPackageJsonContent, 'utf8')

			const packageJson = PackageJson.getPackageJson({ startDir: testDir })
			expect(packageJson.name).toBe('test-package')
		})

		it('should find package.json in a parent directory', () => {
			const nestedDir = join(testDir, 'nested')
			mkdirSync(nestedDir)

			writeFileSync(packageJsonPath, validPackageJsonContent, 'utf8')
			const packageJson = PackageJson.getPackageJson({ startDir: nestedDir })
			expect(packageJson.name).toBe('test-package')
		})

		it('should throw an error if package.json is not found', () => {
			rmSync(packageJsonPath, { force: true })

			expect(() => {
				PackageJson.getPackageJson({ startDir: '/test-root-dir' })
			}).toThrow('No package.json found during directory traversal of dirs [/test-root-dir, /].')
		})
	})

	describe('formatPackageName', () => {
		it('should convert package name to title without scope', () => {
			const packageName = 'test-package-name'
			const regex = /^@.*\//

			const title = PackageJson.formatPackageName(packageName, { scopeRegex: regex })
			expect(title).toBe('Test Package Name')
		})

		it('should remove scope from package name and convert to title', () => {
			const packageName = '@scope/test-package-name'
			const regex = /^@.*\//

			const title = PackageJson.formatPackageName(packageName, { scopeRegex: regex })
			expect(title).toBe('Test Package Name')
		})
	})
})
