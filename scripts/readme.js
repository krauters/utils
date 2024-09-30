/* eslint-disable no-undef */

import { readFileSync, writeFileSync } from 'fs'
import { join, dirname as pathDirname } from 'path'
import { fileURLToPath } from 'url'

const filename = fileURLToPath(import.meta.url)
const dirname = pathDirname(filename)
console.debug(`Current directory [${dirname}]`)

const packageJsonPath = join(dirname, '../package.json')
const readmePath = join(dirname, '../README.md')
const packageNameScopeRegex = /^@.*\//

// Heading level regex constants
const h1HeadingRegex = /^# (.+)$/m

/**
 * Converts a package name to a formatted title.
 * @param {string} packageName - The original package name.
 * @returns {string} - The formatted title.
 */
const packageNameToTitle = (packageName) => {
	const nameWithoutScope = packageName.replace(packageNameScopeRegex, '')

	return nameWithoutScope
		.split('-')
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(' ')
}

/**
 * Reads and parses the package.json file.
 * @param {string} packageJsonPath - The path to the package.json file.
 * @returns {object} - The parsed package.json content.
 */
const readPackageJson = (packageJsonPath) => {
	console.debug(`Reading package.json from [${packageJsonPath}]...`)
	const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'))
	console.info(`Extracted package name [${packageJson.name}]`)

	// eslint-disable-next-line @typescript-eslint/no-unsafe-return
	return packageJson
}

/**
 * Reads the README.md file.
 * @param {string} readmePath - The path to the README.md file.
 * @returns {string} - The content of the README.md file.
 */
const readReadme = (readmePath) => {
	console.debug(`Reading README.md from [${readmePath}]...`)

	return readFileSync(readmePath, 'utf8')
}

/**
 * Writes the updated content to the README.md file.
 * @param {string} readmePath - The path to the README.md file.
 * @param {string} content - The content to write to the README.md file.
 */
const writeReadme = (readmePath, content) => {
	writeFileSync(readmePath, content)
	console.info(`README.md updated successfully at [${readmePath}]`)
}

/**
 * Ensures the specified section exists in the README content.
 * @param {string} content - The README content.
 * @param {string} sectionTitle - The section title to ensure exists.
 * @returns {string} - The updated README content.
 */
const ensureSectionExists = (content, sectionTitle) => {
	const sectionRegex = new RegExp(`^## ${sectionTitle}$`, 'm')
	if (!sectionRegex.test(content)) {
		console.info(`[${sectionTitle}] section not found, adding it to README.md`)
		content += `\n\n## ${sectionTitle}\n\n`
	}

	return content
}

/**
 * Ensures the title exists in the README content and updates it if necessary.
 * @param {string} content - The README content.
 * @param {RegExp} titleRegex - The regex to match the title.
 * @param {string} newTitle - The new title to set.
 * @returns {string} - The updated README content.
 */
const ensureTitleExists = (content, titleRegex, newTitle) => {
	const currentTitleMatch = content.match(titleRegex)
	const currentTitle = currentTitleMatch ? currentTitleMatch[1] : ''
	console.info(`Current README title [${currentTitle}]`)

	if (currentTitle !== newTitle) {
		content = content.replace(titleRegex, `# ${newTitle}`)
		console.info(`README.md title updated to [${newTitle}]`)
	}

	return content
}

try {
	const packageJson = readPackageJson(packageJsonPath)
	const packageName = packageJson.name
	// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
	const desiredTitle = packageNameToTitle(packageName)
	let readmeContent = readReadme(readmePath)

	readmeContent = ensureTitleExists(readmeContent, h1HeadingRegex, desiredTitle)

	const sections = ['Usage', 'Collaboration', 'Development']
	sections.forEach((section) => {
		readmeContent = ensureSectionExists(readmeContent, section)
	})

	writeReadme(readmePath, readmeContent)
} catch (error) {
	console.error(`Failed with error [${error}]`)
}
