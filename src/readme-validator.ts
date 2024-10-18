import { debuggable } from '@krauters/debuggable'
import { existsSync, readFileSync, writeFileSync } from 'fs'
import { join } from 'path'

import { PackageJson } from './package-json'
import {
	FileEncoding,
	type PackageJsonType,
	type ParsedReadme,
	type Section,
	type ValidateAndUpdateReadmeOptions,
} from './structures'

@debuggable()
export class ReadmeValidator {
	/**
	 * Creates a missing section in the README content.
	 *
	 * @param readmeContent - The current content of the README file.
	 * @param section - The section to be added, containing header, content, or a placeholder.
	 * @returns The updated README content with the new section added.
	 */
	public static createSection(readmeContent: string, section: Section): string {
		const { content, header, placeholder } = section
		// eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
		const sectionContent = content || placeholder || 'Placeholder content here'

		console.log(`Creating section [${header}]...`)

		return `${readmeContent}\n## ${header}\n\n${sectionContent}\n`
	}

	/**
	 * Loads the README content and package.json data.
	 *
	 * @param options - Contains paths to the package.json and the repository.
	 * @returns An object containing `packageJson`, `readmeContent`, and `readmePath`.
	 * @throws {Error} - Throws an error if the README.md file does not exist.
	 */
	public static load({ packageJsonPath, repoPath = '' }: Partial<ValidateAndUpdateReadmeOptions>) {
		const packageJson = PackageJson.findPackageJson(packageJsonPath)
		const path = join(repoPath, 'README.md')

		console.log(`Loading README.md from [${path}]...`)
		if (!existsSync(path)) {
			throw new Error(`README.md file not found in the repository at [${path}]`)
		}

		const content = readFileSync(path, FileEncoding.UTF8)
		console.log(`Successfully loaded README.md`)

		return { content, packageJson, path }
	}

	/**
	 * Saves the current readme content to the README.md file.
	 *
	 * @param path - The path to the README.md file.
	 * @param content - The content to be written to the README file.
	 */
	public static save(path: string, content: string) {
		console.log(`Saving README.md to [${path}]...`)
		writeFileSync(path, content, FileEncoding.UTF8)
		console.log(`Successfully saved README.md`)
	}

	/**
	 * Updates the content of an existing section in the README.
	 *
	 * @param readmeContent - The current content of the README file.
	 * @param section - The section containing the header and new content to update.
	 * @returns The updated README content with the new section content.
	 */
	public static updateSectionContent(readmeContent: string, section: Section): string {
		const { content, header } = section
		const updatedContent = `## ${header}\n\n${content}`
		const sectionRegex = new RegExp(`## ${header}\\n[\\s\\S]*?(?=## |$)`, 'i')

		console.log(`Updating section [${header}]...`)

		return readmeContent.replace(sectionRegex, updatedContent)
	}

	/**
	 * Orchestrates the process of validating and updating the README file.
	 *
	 * @param options - Configuration for validating and updating the README.
	 * @returns An object containing the main title, description, and the sections after processing.
	 * @throws {Error} - Throws an error if required sections are missing and `autoCreateMissing` is false.
	 */
	public static validateAndUpdate(options: ValidateAndUpdateReadmeOptions = {}): ParsedReadme {
		const { content, packageJson, path } = ReadmeValidator.load(options)
		const { autoCreateMissing, badgeSection = '', sections = [], updateContent, validateOnly } = options
		let readmeContent =
			badgeSection + ReadmeValidator.validateTitleAndDescription(packageJson, content, validateOnly)

		sections.forEach((section) => {
			const { content, header, required } = section
			const sectionExists = new RegExp(`## ${header}`, 'i').test(readmeContent)

			if (!sectionExists && required && !autoCreateMissing) {
				throw new Error(`Validation failed. Required section [${header}] is missing.`)
			}

			if (!sectionExists && autoCreateMissing) {
				readmeContent = ReadmeValidator.createSection(readmeContent, section)
			}

			if (sectionExists && updateContent && content) {
				readmeContent = ReadmeValidator.updateSectionContent(readmeContent, section)
			}
		})

		if (validateOnly) {
			ReadmeValidator.validateSections(readmeContent, sections)
			console.log('README.md has been successfully validated.')
		} else {
			ReadmeValidator.save(path, readmeContent)
			console.log('README.md has been successfully validated and updated.')
		}

		return {
			description: packageJson.description ?? '',
			sections,
			title: `# ${packageJson.name}`,
		}
	}

	/**
	 * Validates that all required sections are present in the README content.
	 *
	 * @param readmeContent - The current content of the README file.
	 * @param sections - The list of sections to validate.
	 * @throws {Error} - Throws an error if any required section is missing from the README content.
	 */
	public static validateSections(readmeContent: string, sections: Section[]) {
		sections.forEach(({ header, required }) => {
			if (required && !new RegExp(`## ${header}`, 'i').test(readmeContent)) {
				throw new Error(`Validation failed. Required section [${header}] is missing.`)
			}
		})
	}

	/**
	 * Ensures the main title and description are present in the README content.
	 *
	 * @param packageJson - The package.json data containing the name and description.
	 * @param readmeContent - The current content of the README file.
	 * @param validateOnly - Flag to indicate whether to only validate or add the title and description if missing.
	 * @returns The updated README content if `validateOnly` is false; otherwise, returns the original content.
	 * @throws {Error} - Throws an error if the title or description do not match when `validateOnly` is true.
	 */
	public static validateTitleAndDescription(
		packageJson: PackageJsonType,
		readmeContent: string,
		validateOnly = false,
	): string {
		const expectedTitle = `# ${packageJson.name}`
		const expectedDescription = packageJson.description ?? ''

		const titleExists = readmeContent.includes(expectedTitle)
		const descriptionExists = expectedDescription === '' || readmeContent.includes(expectedDescription)

		if (validateOnly) {
			if (!titleExists || !descriptionExists) {
				throw new Error(
					`Validation failed. README does not match expected title and description from package.json.\n` +
						`Expected Title [${expectedTitle}]\nExpected Description [${expectedDescription}]`,
				)
			}
			console.log(`Main title and description validated successfully for [${packageJson.name}].`)

			return readmeContent
		}

		if (!titleExists) {
			console.log(`Adding main title and description for [${packageJson.name}]...`)

			return `${expectedTitle}\n\n${expectedDescription}\n\n${readmeContent}`
		}

		console.log(`Main title already exists for [${packageJson.name}]`)

		return readmeContent
	}
}

export const {
	createSection,
	load,
	save,
	updateSectionContent,
	validateAndUpdate,
	validateSections,
	validateTitleAndDescription,
} = ReadmeValidator
