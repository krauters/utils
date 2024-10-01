import { execSync } from 'child_process'

import { type BadgeSectionOptions, BadgeType, BadgeURL, type PackageJsonType, type Section } from './structures'

/**
 * Provides custom sections to be added to the README, incorporating data from `packageJson`.
 *
 * @param packageJson - The package.json data to help enrich custom sections.
 * @returns An array of custom sections.
 */
export function getCustomSections(packageJson: PackageJsonType): Section[] {
	console.log(`Generating custom sections using package.json data for [${packageJson.name}]...`)

	return [
		{
			content:
				'This project is licensed under the ISC License. Please see the [LICENSE](./LICENSE) file for more details.',
			header: 'License',
			required: false,
		},
		{
			content: [
				'Thanks for spending time on this project.',
				`<a href="https://github.com/${packageJson.name}/utils/graphs/contributors">`,
				`  <img src="https://contrib.rocks/image?repo=${packageJson.name}/utils" />`,
				'</a>',
			].join('\n'),
			header: '🥂 Thanks Contributors',
			required: false,
		},
		{
			content: [
				'We’ve got more than just this one in our toolbox – check out the rest of our `@krauters` collection on [npm/@krauters](https://www.npmjs.com/search?q=%40krauters).',
				'It’s the whole kit and caboodle you didn’t know you needed.',
			].join(' '),
			header: '🔗 Other packages in the family',
			required: false,
		},
	]
}

/**
 * Gets GitHub repository path from the local Git configuration via CLI.
 *
 * @returns The GitHub repository path in the format "owner/repo" or `undefined` if not found.
 */
export function getRepoPathFromGit(): string | undefined {
	try {
		const remoteUrl = execSync('git config --get remote.origin.url', { encoding: 'utf8' }).trim()
		const match = /github\.com[:/](.+\/.+?)(\.git)?$/.exec(remoteUrl)

		return match ? match[1] : undefined
	} catch (error: unknown) {
		console.warn(`Warning: Could not determine Git repository information [${error}].`)

		return undefined
	}
}

/**
 * Generates a badge section in Markdown/HTML format based on the selected `BadgeType`s.
 *
 * @param options - Configuration containing the list of `BadgeType`s, `packageJson`, `linkedInUsername`, and `repoPath`.
 * @returns The generated Markdown/HTML badge section.
 */
export function getBadgeSection(options: BadgeSectionOptions): string {
	const { badgeTypes, linkedInUsername, packageJson, repoPath = getRepoPathFromGit() } = options
	const { name } = packageJson
	const packageName = name.startsWith('@') ? name.replace('/', '%2F') : name

	if (!repoPath && badgeTypes.some((badge) => badge !== BadgeType.LinkedIn)) {
		console.warn(
			`Warning: One or more badges are enabled but 'repoPath' is not supplied. Badge URLs may not be generated correctly.`,
		)
	}

	const badges = {
		[BadgeType.CodeSize]: `![Code Size](${BadgeURL.Shields}github/${BadgeType.CodeSize}/${repoPath})`,
		[BadgeType.CommitsPerMonth]: `![Commits per Month](${BadgeURL.Shields}github/${BadgeType.CommitsPerMonth}/${repoPath})`,
		[BadgeType.Contributors]: `![Contributors](${BadgeURL.Shields}github/${BadgeType.Contributors}/${repoPath})`,
		[BadgeType.Forks]: `![Forks](${BadgeURL.Shields}github/${BadgeType.Forks}/${repoPath})`,
		[BadgeType.GitHubStars]: `![GitHub Stars](${BadgeURL.Shields}github/${BadgeType.GitHubStars}/${repoPath})`,
		[BadgeType.InstallSize]: `![Install Size](${BadgeURL.Shields}npm/${BadgeType.InstallSize}/${packageName})`,
		[BadgeType.Issues]: `![GitHub Issues](${BadgeURL.Shields}github/${BadgeType.Issues}/${repoPath})`,
		[BadgeType.LastCommit]: `![Last Commit](${BadgeURL.Shields}github/${BadgeType.LastCommit}/${repoPath})`,
		[BadgeType.License]: `![License](${BadgeURL.Shields}github/license/${repoPath})`,
		[BadgeType.LinkedIn]: linkedInUsername
			? `<a href="${BadgeURL.LinkedIn}${linkedInUsername}" target="_blank"><img src="${BadgeURL.Shields}badge/LinkedIn-%230077B5.svg?&style=flat-square&logo=linkedin&logoColor=white" alt="LinkedIn"></a>`
			: '',
		[BadgeType.NpmVersion]: `[![npm version](${BadgeURL.Shields}npm/v/${packageName}.svg?style=flat-square)](https://www.npmjs.org/package/${packageJson.name})`,
		[BadgeType.OpenPRs]: `![Open PRs](${BadgeURL.Shields}github/${BadgeType.OpenPRs}/${repoPath})`,
		[BadgeType.RepoSize]: `![Repo Size](${BadgeURL.Shields}github/${BadgeType.RepoSize}/${repoPath})`,
		[BadgeType.Version]: `![Version](${BadgeURL.Shields}github/${BadgeType.Version}/${repoPath})`,
		[BadgeType.Visitors]: `![visitors](${BadgeURL.Visitors}${repoPath})`,
	}

	const badgesSection = badgeTypes.filter((badgeType) => badges[badgeType]).map((badgeType) => badges[badgeType])

	return badgesSection.length > 0 ? `<div align="center">\n\n${badgesSection.join('\n')}\n\n</div>` : ''
}
