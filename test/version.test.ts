import { execSync } from 'child_process'
import { describe, beforeEach, it, expect, jest } from '@jest/globals'

import { PackageJson } from '../src/package-json'
import { Version } from '../src/version'

jest.mock('child_process')
jest.mock('../src/package-json')

const mockedExecSync = execSync as jest.MockedFunction<typeof execSync>
const mockedFindPackageJson = PackageJson.findPackageJson as jest.MockedFunction<typeof PackageJson.findPackageJson>

describe('Version', () => {
	beforeEach(() => {
		jest.resetAllMocks()
	})

	describe('getCommitSha', () => {
		it('should return the commit SHA', () => {
			mockedExecSync.mockReturnValue('abc123\n')

			const sha = Version.getCommitSha('HEAD', true)

			expect(mockedExecSync).toHaveBeenCalledWith('git rev-parse --short HEAD', { encoding: 'utf8' })
			expect(sha).toBe('abc123')
		})

		it('should throw an error if execSync fails', () => {
			mockedExecSync.mockImplementation(() => {
				throw new Error('Command failed')
			})

			expect(() => {
				Version.getCommitSha('HEAD', true)
			}).toThrow('Failed to get commit SHA for HEAD with error [Command failed]')
		})
	})

	describe('getLocalVersion', () => {
		it('should return the local package version', () => {
			const packageJson = { name: 'test-package', version: '1.0.0' }
			mockedFindPackageJson.mockReturnValue(packageJson)

			const version = Version.getLocalVersion()

			expect(mockedFindPackageJson).toHaveBeenCalled()
			expect(version).toBe('1.0.0')
		})
	})

	describe('getVersionFromGit', () => {
		it('should return the version from git', () => {
			const packageJsonContent = JSON.stringify({ name: 'test-package', version: '0.9.0' })
			mockedExecSync.mockReturnValue(packageJsonContent)

			const version = Version.getVersionFromGit('HEAD~1')

			expect(mockedExecSync).toHaveBeenCalledWith('git show HEAD~1:package.json', { encoding: 'utf8' })
			expect(version).toBe('0.9.0')
		})

		it('should throw an error if execSync fails', () => {
			mockedExecSync.mockImplementation(() => {
				throw new Error('Command failed')
			})

			expect(() => {
				Version.getVersionFromGit('HEAD~1')
			}).toThrow('Failed fetching package.json from HEAD~1 with error [Command failed]')
		})
	})

	describe('compareVersions', () => {
		it('should log version change if versions are different', () => {
			const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
			jest.spyOn(Version, 'getPreviousVersion').mockReturnValue('0.9.0')
			jest.spyOn(Version, 'getLocalVersion').mockReturnValue('1.0.0')
			jest.spyOn(Version, 'getCommitSha').mockReturnValue('abc123')

			Version.compareVersions()

			expect(consoleLogSpy).toHaveBeenCalledWith(
				'Version changed from [0.9.0] (commit: abc123) to [1.0.0] (latest local changes).',
			)
			consoleLogSpy.mockRestore()
		})

		it('should throw an error if versions are the same and allowMatchWithoutError is false', () => {
			jest.spyOn(Version, 'getPreviousVersion').mockReturnValue('1.0.0')
			jest.spyOn(Version, 'getLocalVersion').mockReturnValue('1.0.0')
			jest.spyOn(Version, 'getCommitSha').mockReturnValue('abc123')

			expect(() => {
				Version.compareVersions()
			}).toThrow(
				`Version has not been changed:
    Previous version: [1.0.0] (commit: abc123)
    Current version: [1.0.0] (latest local changes)
    Please update the version before committing.`,
			)
		})

		it('should warn if versions are the same and allowMatchWithoutError is true', () => {
			const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
			jest.spyOn(Version, 'getPreviousVersion').mockReturnValue('1.0.0')
			jest.spyOn(Version, 'getLocalVersion').mockReturnValue('1.0.0')
			jest.spyOn(Version, 'getCommitSha').mockReturnValue('abc123')

			Version.compareVersions(true)

			expect(consoleWarnSpy).toHaveBeenCalledWith(
				`Version has not been changed:
    Previous version: [1.0.0] (commit: abc123)
    Current version: [1.0.0] (latest local changes)
    Please update the version before committing.`,
			)
			consoleWarnSpy.mockRestore()
		})
	})
})
