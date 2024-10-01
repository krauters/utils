/* eslint-disable @typescript-eslint/no-unsafe-return */
import { existsSync, readFileSync, writeFileSync } from 'fs'
import { join } from 'path'

import type { PackageJsonType } from '../src/structures'

import { ReadmeValidator } from '../src/readme-validator'

jest.mock('fs')

const mockExistsSync = existsSync as jest.Mock
const mockReadFileSync = readFileSync as jest.Mock
const mockWriteFileSync = writeFileSync as jest.Mock
const mockPackageJson: PackageJsonType = {
	description: 'A test package description',
	name: 'test-package',
	version: '1.0.0',
}

const mockRepoPath = '/mock-repo'
const mockReadmePath = join(mockRepoPath, 'README.md')
const packageJsonPath = join(mockRepoPath, 'package.json')

beforeEach(() => {
	jest.resetAllMocks()

	mockExistsSync.mockImplementation((filePath) => filePath === mockReadmePath || filePath === packageJsonPath)
	mockReadFileSync.mockImplementation((filePath) => {
		if (filePath === mockReadmePath)
			return '# test-package\n\nA test package description\n\n## Existing Section\n\nExisting content\n'
		if (filePath === packageJsonPath) return JSON.stringify(mockPackageJson)
		throw new Error(`File not found: ${filePath}`)
	})

	// eslint-disable-next-line @typescript-eslint/no-empty-function
	mockWriteFileSync.mockImplementation(() => {})
})

// eslint-disable-next-line max-lines-per-function
describe('ReadmeValidator', () => {
	it('should throw an error if README.md does not exist', () => {
		mockExistsSync.mockImplementation((filePath) => filePath === packageJsonPath)

		expect(() => ReadmeValidator.load({ packageJsonPath, repoPath: mockRepoPath })).toThrow(
			'README.md file not found in the repository',
		)
	})

	it('should initialize with package.json data and existing README content', () => {
		const data = ReadmeValidator.load({ packageJsonPath, repoPath: mockRepoPath })
		expect(data).toBeDefined()
		expect(mockReadFileSync).toHaveBeenCalledWith(mockReadmePath, 'utf8')
		expect(mockReadFileSync).toHaveBeenCalledWith(packageJsonPath, 'utf8')
	})

	it('should validate missing required sections and throw an error', () => {
		const { content } = ReadmeValidator.load({ packageJsonPath, repoPath: mockRepoPath })
		const sections = [
			{ header: 'Missing Section', required: true },
			{ header: 'Existing Section', required: true },
		]

		expect(() => {
			ReadmeValidator.validateSections(content, sections)
		}).toThrow('Validation failed. Required section [Missing Section] is missing.')
	})

	it('should not throw an error when all required sections exist', () => {
		const { content } = ReadmeValidator.load({ packageJsonPath, repoPath: mockRepoPath })
		const sections = [{ header: 'Existing Section', required: true }]

		expect(() => {
			ReadmeValidator.validateSections(content, sections)
		}).not.toThrow()
	})

	it('should auto-create missing sections when the option is enabled', () => {
		ReadmeValidator.validateAndUpdate({
			autoCreateMissing: true,
			packageJsonPath,
			repoPath: mockRepoPath,
			sections: [{ header: 'New Section', placeholder: 'Placeholder content here', required: true }],
		})

		expect(mockWriteFileSync).toHaveBeenCalledWith(
			mockReadmePath,
			expect.stringContaining('## New Section\n\nPlaceholder content here\n'),
			'utf8',
		)
	})

	it('should handle autoCreateMissing for multiple missing sections', () => {
		const sections = [
			{ header: 'First Missing Section', required: true },
			{ header: 'Second Missing Section', required: false },
		]

		ReadmeValidator.validateAndUpdate({
			autoCreateMissing: true,
			packageJsonPath,
			repoPath: mockRepoPath,
			sections,
		})
		expect(mockWriteFileSync).toHaveBeenCalledWith(
			mockReadmePath,
			expect.stringContaining('## First Missing Section\n\nPlaceholder content here\n'),
			'utf8',
		)
		expect(mockWriteFileSync).toHaveBeenCalledWith(
			mockReadmePath,
			expect.stringContaining('## Second Missing Section\n\nPlaceholder content here\n'),
			'utf8',
		)
	})

	it('should replace existing section content when updateContent is true', () => {
		const sections = [{ content: 'Updated content', header: 'Existing Section', required: true }]

		ReadmeValidator.validateAndUpdate({ packageJsonPath, repoPath: mockRepoPath, sections, updateContent: true })
		expect(mockWriteFileSync).toHaveBeenCalledWith(
			mockReadmePath,
			expect.stringContaining('## Existing Section\n\nUpdated content'),
			'utf8',
		)
	})

	it('should maintain existing sections when updateContent is false', () => {
		const sections = [{ content: 'Should not overwrite', header: 'Existing Section', required: true }]

		ReadmeValidator.validateAndUpdate({ packageJsonPath, repoPath: mockRepoPath, sections, updateContent: false })
		expect(mockWriteFileSync).not.toHaveBeenCalledWith(
			mockReadmePath,
			expect.stringContaining('Should not overwrite'),
			'utf8',
		)
	})

	it('should include the main title and description if missing', () => {
		mockReadFileSync.mockImplementation((filePath) => {
			if (filePath === mockReadmePath) return '## Existing Section\n\nContent here\n'
			if (filePath === packageJsonPath) return JSON.stringify(mockPackageJson)
			throw new Error(`File not found: ${filePath}`)
		})
		const sections = [{ header: 'Existing Section', required: true }]
		ReadmeValidator.validateAndUpdate({
			autoCreateMissing: true,
			packageJsonPath,
			repoPath: mockRepoPath,
			sections,
		})

		expect(mockWriteFileSync).toHaveBeenCalledWith(
			mockReadmePath,
			expect.stringContaining('# test-package\n\nA test package description\n'),
			'utf8',
		)
	})

	it('should handle an empty README correctly', () => {
		mockReadFileSync.mockImplementation((filePath) => {
			if (filePath === mockReadmePath) return ''
			if (filePath === packageJsonPath) return JSON.stringify(mockPackageJson)
			throw new Error(`File not found: ${filePath}`)
		})

		const sections = [{ content: 'Content for empty section', header: 'Empty Section', required: true }]

		ReadmeValidator.validateAndUpdate({
			autoCreateMissing: true,
			packageJsonPath,
			repoPath: mockRepoPath,
			sections,
			updateContent: true,
		})
		expect(mockWriteFileSync).toHaveBeenCalledWith(
			mockReadmePath,
			expect.stringContaining('## Empty Section\n\nContent for empty section\n'),
			'utf8',
		)
	})

	it('should return the parsed readme data correctly', () => {
		const sections = [{ header: 'Existing Section', required: true }]
		const parsedReadme = ReadmeValidator.validateAndUpdate({ packageJsonPath, repoPath: mockRepoPath, sections })
		expect(parsedReadme).toEqual({
			description: 'A test package description',
			sections: [{ header: 'Existing Section', required: true }],
			title: '# test-package',
		})
	})
})
