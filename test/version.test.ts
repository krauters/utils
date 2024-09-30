/* eslint-disable @typescript-eslint/no-empty-function */

import { beforeEach, describe, expect, it, jest } from '@jest/globals'
import { execSync } from 'child_process'
import fs from 'fs'

import { compareVersions } from '../src/version'

jest.mock('child_process')
jest.mock('fs')

const mockedExecSync = execSync as jest.Mock
const mockedFs = fs as jest.Mocked<typeof fs>

describe('compareVersions', () => {
	beforeEach(() => {
		jest.clearAllMocks()
	})

	it('should return true when versions differ', () => {
		mockedExecSync.mockReturnValue(JSON.stringify({ version: '1.0.0' }))
		mockedFs.readFileSync.mockReturnValue(JSON.stringify({ version: '1.0.1' }))

		const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {})

		const result = compareVersions()

		expect(result).toBe(true)
		expect(mockedExecSync).toHaveBeenCalledWith('git show HEAD~1:package.json', { encoding: 'utf8' })
		expect(mockedFs.readFileSync).toHaveBeenCalledWith(expect.stringContaining('package.json'), 'utf8')
		expect(consoleLogSpy).toHaveBeenCalledWith('Version changed from 1.0.0 to 1.0.1.')

		consoleLogSpy.mockRestore()
	})

	it('should return false when versions are the same', () => {
		mockedExecSync.mockReturnValue(JSON.stringify({ version: '1.0.0' }))
		mockedFs.readFileSync.mockReturnValue(JSON.stringify({ version: '1.0.0' }))

		const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})

		const result = compareVersions()

		expect(result).toBe(false)
		expect(mockedExecSync).toHaveBeenCalledWith('git show HEAD~1:package.json', { encoding: 'utf8' })
		expect(mockedFs.readFileSync).toHaveBeenCalledWith(expect.stringContaining('package.json'), 'utf8')
		expect(consoleErrorSpy).toHaveBeenCalledWith(
			'Version has not been changed. Please update the version before committing.',
		)

		consoleErrorSpy.mockRestore()
	})

	it('should throw an error when fetching previous package.json fails', () => {
		mockedExecSync.mockImplementation(() => {
			throw new Error('Git command failed')
		})

		expect(() => compareVersions()).toThrow(
			'Failed fetching previous package.json with error [Error: Git command failed]',
		)
	})

	it('should throw an error when reading current package.json fails', () => {
		mockedExecSync.mockReturnValue(JSON.stringify({ version: '1.0.0' }))
		mockedFs.readFileSync.mockImplementation(() => {
			throw new Error('Failed to read package.json')
		})

		expect(() => compareVersions()).toThrow(
			'Failed reading current package.json with error [Error: Failed to read package.json]',
		)
	})
})
