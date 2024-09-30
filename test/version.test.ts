/* eslint-disable @typescript-eslint/no-empty-function */

import { beforeEach, describe, expect, it, jest } from '@jest/globals'
import { execSync } from 'child_process'
import fs from 'fs'

import { compareVersions } from '../src/version'

jest.mock('child_process')
jest.mock('fs')

const mockedExecSync = execSync as jest.Mock
const mockedFs = fs as jest.Mocked<typeof fs>

// eslint-disable-next-line max-lines-per-function
describe('compareVersions', () => {
	beforeEach(() => {
		jest.clearAllMocks()
	})

	it('should log when versions differ', () => {
		// Mock Git commands for fetching the previous version and commit SHA
		mockedExecSync.mockImplementation((...args: unknown[]) => {
			const command = args[0] as string
			if (command === 'git show HEAD~1:package.json') {
				return JSON.stringify({ version: '1.0.0' })
			}
			if (command.startsWith('git rev-parse')) {
				return 'abcd123'
			}
			throw new Error('Unexpected command')
		})

		// Mock reading the local package.json
		mockedFs.readFileSync.mockReturnValue(JSON.stringify({ version: '1.0.1' }))
		mockedFs.existsSync.mockReturnValue(true)

		const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {})

		compareVersions()

		expect(mockedExecSync).toHaveBeenCalledWith('git show HEAD~1:package.json', { encoding: 'utf8' })
		expect(consoleLogSpy).toHaveBeenCalledWith(
			'Version changed from [1.0.0] (commit: abcd123) to [1.0.1] (latest local changes).',
		)

		consoleLogSpy.mockRestore()
	})

	it('should throw an error when versions are the same (default behavior)', () => {
		// Mock Git commands for fetching the previous version and commit SHA
		mockedExecSync.mockImplementation((...args: unknown[]) => {
			const command = args[0] as string
			if (command === 'git show HEAD~1:package.json') {
				return JSON.stringify({ version: '1.0.0' })
			}
			if (command.startsWith('git rev-parse')) {
				return 'abcd123'
			}
			throw new Error('Unexpected command')
		})

		// Mock reading the local package.json
		mockedFs.readFileSync.mockReturnValue(JSON.stringify({ version: '1.0.0' }))
		mockedFs.existsSync.mockReturnValue(true)

		expect(() => {
			compareVersions()
		}).toThrow(
			`Version has not been changed:
	Previous version: [1.0.0] (commit: abcd123)
	Current version: [1.0.0] (latest local changes)
	Please update the version before committing.`,
		)
	})

	it('should log a warning instead of throwing an error when versions are the same if allowMatchWithoutError is true', () => {
		// Mock Git commands for fetching the previous version and commit SHA
		mockedExecSync.mockImplementation((...args: unknown[]) => {
			const command = args[0] as string
			if (command === 'git show HEAD~1:package.json') {
				return JSON.stringify({ version: '1.0.0' })
			}
			if (command.startsWith('git rev-parse')) {
				return 'abcd123'
			}
			throw new Error('Unexpected command')
		})

		// Mock reading the local package.json
		mockedFs.readFileSync.mockReturnValue(JSON.stringify({ version: '1.0.0' }))
		mockedFs.existsSync.mockReturnValue(true)

		const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {})

		compareVersions(true)

		expect(consoleWarnSpy).toHaveBeenCalledWith(
			`Version has not been changed:
	Previous version: [1.0.0] (commit: abcd123)
	Current version: [1.0.0] (latest local changes)
	Please update the version before committing.`,
		)

		consoleWarnSpy.mockRestore()
	})

	it('should throw an error when fetching the previous package.json fails', () => {
		mockedExecSync.mockImplementation((...args: unknown[]) => {
			const command = args[0] as string
			if (command === 'git show HEAD~1:package.json') {
				throw new Error('Git command failed')
			}

			return 'abcd123'
		})

		mockedFs.readFileSync.mockReturnValue(JSON.stringify({ version: '1.0.0' }))
		mockedFs.existsSync.mockReturnValue(true)

		expect(() => {
			compareVersions()
		}).toThrow('Failed fetching package.json from HEAD~1 with error [Error: Git command failed]')
	})

	it('should throw an error when reading the local package.json fails', () => {
		mockedExecSync.mockImplementation((...args: unknown[]) => {
			const command = args[0] as string
			if (command === 'git show HEAD~1:package.json') {
				return JSON.stringify({ version: '1.0.0' })
			}

			return 'abcd123'
		})

		// Mock reading the local package.json to throw an error
		mockedFs.readFileSync.mockImplementation(() => {
			throw new Error('Failed to read package.json')
		})
		mockedFs.existsSync.mockReturnValue(true)

		expect(() => {
			compareVersions()
		}).toThrow(
			'Failed reading local package.json at /Users/coltenkrauter/Repositories/utils/package.json with error [Error: Failed to read package.json]',
		)
	})
})
