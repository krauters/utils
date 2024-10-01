/* eslint-disable @typescript-eslint/no-explicit-any */

export interface PackageJsonType {
	[key: string]: any
	author?: Person | string
	bin?: Bin | string
	browser?: Browser | string
	bugs?: Bugs | string
	bundledDependencies?: string[]
	config?: Record<string, any>
	contributors?: Person[] | string[]
	cpu?: string[]
	dependencies?: Dependencies
	description?: string
	devDependencies?: Dependencies
	directories?: Directories
	engines?: Engines
	files?: string[]
	homepage?: string
	keywords?: string[]
	license?: string
	main?: string
	man?: string | string[]
	module?: string
	name: string
	optionalDependencies?: Dependencies
	os?: string[]
	peerDependencies?: Dependencies
	private?: boolean
	publishConfig?: PublishConfig
	repository?: Repository | string
	scripts?: Scripts
	type?: 'commonjs' | 'module'
	types?: string
	version: string
}

interface Bugs {
	email?: string
	url?: string
}

interface Person {
	email?: string
	name?: string
	url?: string
}

interface Repository {
	type: string
	url: string
}

type Scripts = Record<string, string>

type Dependencies = Record<string, string>

type Browser = Record<string, string>

type Bin = Record<string, string>

interface Directories {
	bin?: string
	doc?: string
	example?: string
	lib?: string
	man?: string
}

interface Engines {
	[engine: string]: string | undefined
	node?: string
	npm?: string
	yarn?: string
}

interface PublishConfig {
	[key: string]: any
	access?: 'public' | 'restricted'
	registry?: string
}

export interface Section {
	content?: string
	header: string
	placeholder?: string
	required: boolean
}

export interface ReadmeParserOptions {
	autoCreateMissing?: boolean
	updateContent?: boolean
	validateOnly?: boolean
}

export interface ParsedReadme {
	description: string
	sections: Section[]
	title: string
}

export interface Section {
	content?: string
	header: string
	placeholder?: string
	required: boolean
}

export interface ParsedReadme {
	description: string
	sections: Section[]
	title: string
}

export enum FileEncoding {
	UTF8 = 'utf8',
}

export interface ValidateAndUpdateReadmeOptions {
	autoCreateMissing?: boolean
	badgeSection?: string
	packageJsonPath?: string
	repoPath?: string
	sections?: Section[]
	updateContent?: boolean
	validateOnly?: boolean
}

export enum BadgeURL {
	LinkedIn = 'https://www.linkedin.com/in/',
	Shields = 'https://img.shields.io/',
	Visitors = 'https://visitor-badge.laobi.icu/badge?page_id=',
}

export enum BadgeType {
	CodeSize = 'languages/code-size',
	CommitsPerMonth = 'commit-activity/m',
	Contributors = 'contributors',
	Forks = 'forks',
	GitHubStars = 'stars',
	InstallSize = 'npm/dw',
	Issues = 'issues',
	LastCommit = 'last-commit',
	License = 'license',
	LinkedIn = 'LinkedIn',
	NpmVersion = 'npm',
	OpenPRs = 'issues-pr',
	RepoSize = 'repo-size',
	Version = 'v/release',
	Visitors = 'visitors',
}

export interface BadgeSectionOptions {
	badgeTypes: BadgeType[]
	linkedInUsername?: string
	packageJson: PackageJsonType
	repoPath?: string
}
