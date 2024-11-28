import { beforeEach, describe, expect, it, jest } from '@jest/globals'
import { log } from '@krauters/logger'
import { execSync } from 'child_process'

import { PackageJson } from '../src/package-json'
import { Version } from '../src/version'

jest.mock('child_process')
jest.mock('../src/package-json')

const mockedExecSync = execSync as jest.MockedFunction<typeof execSync>
const mockedFindPackageJson = PackageJson.getPackageJson as jest.MockedFunction<typeof PackageJson.getPackageJson>

// eslint-disable-next-line max-lines-per-function
describe('Version', () => {
	beforeEach(() => {
		jest.resetAllMocks()
	})

	describe('getCommitSha', () => {
		it('should return the commit SHA for a branch', () => {
			mockedExecSync.mockReturnValue('abc123\n')

			const sha = Version.getCommitSha('origin/main', true)

			expect(mockedExecSync).toHaveBeenCalledWith('git rev-parse --short origin/main', { encoding: 'utf8' })
			expect(sha).toBe('abc123')
		})

		it('should return the commit SHA for HEAD', () => {
			mockedExecSync.mockReturnValue('def456\n')

			const sha = Version.getCommitSha('HEAD', true)

			expect(mockedExecSync).toHaveBeenCalledWith('git rev-parse --short HEAD', { encoding: 'utf8' })
			expect(sha).toBe('def456')
		})

		it('should throw an error if execSync fails', () => {
			mockedExecSync.mockImplementation(() => {
				throw new Error('Command failed')
			})

			expect(() => {
				Version.getCommitSha('origin/main', true)
			}).toThrow('Failed to get commit SHA for [origin/main] with error [Command failed]')
		})
	})

	describe('getCurrentBranch', () => {
		it('should return the current branch name', () => {
			mockedExecSync.mockReturnValue('feature-branch\n')

			const branch = Version.getCurrentBranch()

			expect(mockedExecSync).toHaveBeenCalledWith('git rev-parse --abbrev-ref HEAD', { encoding: 'utf8' })
			expect(branch).toBe('feature-branch')
		})

		it('should throw an error if execSync fails', () => {
			mockedExecSync.mockImplementation(() => {
				throw new Error('Command failed')
			})

			expect(() => {
				Version.getCurrentBranch()
			}).toThrow('Failed to get current branch name with error [Command failed]')
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

			const version = Version.getVersionFromGit('origin/main')

			expect(mockedExecSync).toHaveBeenCalledWith('git show origin/main:package.json', { encoding: 'utf8' })
			expect(version).toBe('0.9.0')
		})

		it('should throw an error if execSync fails', () => {
			mockedExecSync.mockImplementation(() => {
				throw new Error('Command failed')
			})

			expect(() => {
				Version.getVersionFromGit('origin/main')
			}).toThrow('Failed fetching package.json from [origin/main] with error [Command failed]')
		})
	})

	describe('compareVersions', () => {
		it('should log version change if versions are different', () => {
			// eslint-disable-next-line @typescript-eslint/no-empty-function
			const consoleLogSpy = jest.spyOn(log, 'info').mockImplementation(() => {})
			jest.spyOn(Version, 'getBranchVersion').mockReturnValue('1.0.1')
			jest.spyOn(Version, 'getLocalVersion').mockReturnValue('1.1.0')
			jest.spyOn(Version, 'getCurrentBranch').mockReturnValue('main')
			jest.spyOn(Version, 'getCommitSha').mockImplementation((ref) => {
				if (ref === 'origin/main') return '4e658fb'

				return ''
			})

			Version.compareVersions('main')

			expect(consoleLogSpy).toHaveBeenCalledWith(
				'Version changed from [1.0.1] in [main][4e658fb] to [1.1.0] in [main] (latest local changes).',
			)
			consoleLogSpy.mockRestore()
		})

		it('should throw an error if versions are the same and allowMatchWithoutError is false', () => {
			jest.spyOn(Version, 'getBranchVersion').mockReturnValue('1.0.1')
			jest.spyOn(Version, 'getLocalVersion').mockReturnValue('1.0.1')
			jest.spyOn(Version, 'getCurrentBranch').mockReturnValue('main')
			jest.spyOn(Version, 'getCommitSha').mockImplementation((ref) => {
				if (ref === 'origin/main') return '4e658fb'

				return ''
			})

			expect(() => {
				Version.compareVersions('main')
			}).toThrow(
				'Version has not been changed. [1.0.1] in [main][4e658fb] is the same as [1.0.1] in [main] (latest local changes). Please update the version before committing.',
			)
		})

		it('should warn if versions are the same and allowMatchWithoutError is true', () => {
			// eslint-disable-next-line @typescript-eslint/no-empty-function
			const consoleWarnSpy = jest.spyOn(log, 'warn').mockImplementation(() => {})
			jest.spyOn(Version, 'getBranchVersion').mockReturnValue('1.0.1')
			jest.spyOn(Version, 'getLocalVersion').mockReturnValue('1.0.1')
			jest.spyOn(Version, 'getCurrentBranch').mockReturnValue('main')
			jest.spyOn(Version, 'getCommitSha').mockImplementation((ref) => {
				if (ref === 'origin/main') return '4e658fb'

				return ''
			})

			Version.compareVersions('main', true)

			expect(consoleWarnSpy).toHaveBeenCalledWith(
				'Version has not been changed. [1.0.1] in [main][4e658fb] is the same as [1.0.1] in [main] (latest local changes). Please update the version before committing.',
			)
			consoleWarnSpy.mockRestore()
		})
	})
})
