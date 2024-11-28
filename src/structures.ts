/* eslint-disable @typescript-eslint/no-explicit-any */

import type { PackageJson } from '@krauters/structures'
import type { MakeDirectoryOptions } from 'fs'

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

export enum BadgeURL {
	LinkedIn = 'https://www.linkedin.com/in/',
	Shields = 'https://img.shields.io/',
	Visitors = 'https://visitor-badge.laobi.icu/badge?page_id=',
}

export enum SnapType {
	Day = 'day',
	Hour = 'hour',
	Minute = 'minute',
	Month = 'month',
	Second = 'second',
	Week = 'week',
	Year = 'year',
}

export interface BadgeSectionOptions {
	badgeTypes: BadgeType[]
	linkedInUsername?: string
	packageJson: PackageJson
	repoPath?: string
}

export interface Batch<T> {
	index: number
	items: T[]
}

export interface FromQueryParamsOptions {
	query: string
}

export type MakeDirectoryOptionsExtended = {
	suppressLogs?: boolean
} & MakeDirectoryOptions

export interface ParsedReadme {
	description: string
	sections: Section[]
	title: string
}

export interface ParsedReadme {
	description: string
	sections: Section[]
	title: string
}

export interface ReadDirectoryOptions {
	encoding: BufferEncoding | null
	withFileTypes?: false
}

export interface ReadJsonFileOptions {
	encoding: BufferEncoding
	flag?: string
}

export interface ReadmeParserOptions {
	autoCreateMissing?: boolean
	updateContent?: boolean
	validateOnly?: boolean
}

export interface Section {
	content?: string
	header: string
	placeholder?: string
	required: boolean
}

export interface Section {
	content?: string
	header: string
	placeholder?: string
	required: boolean
}

export interface SnapDateOptions {
	days?: number
	months?: number
	snap?: SnapType
}

export interface StringToArrayParsingOptions {
	delimiter?: string
	removeWhitespace?: boolean
}

export interface ToQueryParamsOptions {
	excludeKeys?: string[]
	includeKeys?: string[]
	params: Record<string, any>
	sortKeys?: boolean
	urlEncode?: boolean
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
export interface WriteJsonFileOptions {
	encoding: BufferEncoding
	flag?: string
	mode?: number | string
}
