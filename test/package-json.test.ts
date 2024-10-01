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

	describe('readPackageJson', () => {
		it('should read and parse a valid package.json file', () => {
			writeFileSync(packageJsonPath, validPackageJsonContent, 'utf8')

			const packageJson = PackageJson.readPackageJson(packageJsonPath)

			expect(packageJson.name).toBe('test-package')
			expect(packageJson.version).toBe('1.0.0')
			expect(packageJson.description).toBe('A test package.json file')
		})

		it('should throw an error when reading an invalid package.json file', () => {
			writeFileSync(packageJsonPath, invalidPackageJsonContent, 'utf8')

			expect(() => {
				PackageJson.readPackageJson(packageJsonPath)
			}).toThrow(/Failed to read package.json/)
		})
	})

	describe('findPackageJson', () => {
		it('should find package.json in the current directory', () => {
			writeFileSync(packageJsonPath, validPackageJsonContent, 'utf8')

			const packageJson = PackageJson.findPackageJson(testDir)

			expect(packageJson.name).toBe('test-package')
		})

		it('should find package.json in a parent directory', () => {
			const nestedDir = join(testDir, 'nested')
			mkdirSync(nestedDir)

			const packageJson = PackageJson.findPackageJson(nestedDir)

			expect(packageJson.name).toBe('test-package')
		})

		it('should throw an error if package.json is not found', () => {
			rmSync(packageJsonPath)

			expect(() => {
				PackageJson.findPackageJson('/test-root-dir')
			}).toThrow('No package.json found in this project hierarchy.')
		})
	})

	describe('packageNameToTitle', () => {
		it('should convert package name to title without scope', () => {
			const packageName = 'test-package-name'
			const regex = /^@.*\//

			const title = PackageJson.packageNameToTitle(packageName, regex)

			expect(title).toBe('Test Package Name')
		})

		it('should remove scope from package name and convert to title', () => {
			const packageName = '@scope/test-package-name'
			const regex = /^@.*\//

			const title = PackageJson.packageNameToTitle(packageName, regex)

			expect(title).toBe('Test Package Name')
		})
	})
})
