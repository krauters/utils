import { debuggable } from '@krauters/debuggable'

import type { StringToArrayParsingOptions } from './structures.ts'

@debuggable()
export class Strings {
	/**
	 * Converts a string to camelCase.
	 *
	 * @param text The string to convert.
	 * @returns The camelCase string.
	 */
	static camelCase(text: string): string {
		text = Strings.pascalCase(text)

		return text.charAt(0).toLowerCase() + text.slice(1)
	}

	/**
	 * Capitalizes the first letter of the string and makes the rest lowercase.
	 *
	 * @param text The string to capitalize.
	 * @returns The capitalized string.
	 */
	static capitalize(text: string): string {
		return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()
	}

	/**
	 * Determines if a given string should be considered falsy based on predefined and optional values.
	 *
	 * @param text The string to analyze.
	 * @param additionalFalsyValues Optional additional strings to consider as falsy.
	 * @returns Whether the string is falsy or not.
	 */
	static isFalsy(text: string, additionalFalsyValues: string[] = []): boolean {
		const defaultFalsyValues = ['', '0', 'false', 'no', 'nil', 'none', 'n/a', 'undefined', 'null', 'off']
		const falsyValues = [...defaultFalsyValues, ...additionalFalsyValues.map((v) => v.toLowerCase())]

		return falsyValues.includes(text.trim().toLowerCase())
	}

	/**
	 * Checks if a string is numeric.
	 *
	 * @param text The string to check.
	 * @returns Whether the string is numeric or not.
	 */
	static isNumber(text: string): boolean {
		return !isNaN(parseFloat(text)) && isFinite(Number(text))
	}

	/**
	 * Returns true if a string is truthy.
	 *
	 * @param text The string to analyze.
	 * @returns Whether the string is truthy or not.
	 */
	static isTruthy(text: string): boolean {
		return !Strings.isFalsy(text)
	}

	/**
	 * Converts a string to kebab-case.
	 *
	 * @param text The string to convert.
	 * @returns The kebab-case string.
	 */
	static kebabCase(text: string): string {
		return text.toLowerCase().split(/\s+/).join('-')
	}

	/**
	 * Counts the occurrences of a specified substring in a string.
	 *
	 * @param text The string to check.
	 * @param substring The substring to count.
	 * @returns The number of occurrences.
	 */
	static occurrences(text: string, substring: string): number {
		return text.split(substring).length - 1
	}

	/**
	 * Pads a string with a specific character to reach a desired length.
	 *
	 * @param text The string to pad.
	 * @param length The desired length of the string.
	 * @param char The character to use for padding. Defaults to a space.
	 * @returns The padded string.
	 */
	static padString(text: string, length: number, char = ' '): string {
		if (text.length >= length) return text
		const padLength = length - text.length

		return text + char.repeat(padLength)
	}

	/**
	 * Converts a string to PascalCase.
	 *
	 * @param text The string to convert.
	 * @returns The PascalCase string.
	 */
	static pascalCase(text: string): string {
		return Strings.removeWhitespace(Strings.titleCase(text))
	}

	/**
	 * Gets the correct version of a word depending on quantity context.
	 *
	 * @param word The word that may need to be pluralized.
	 * @param number The number of entities in question.
	 * @returns The pluralized or singular word.
	 */
	static plural(word: string, number: number): string {
		return number === 1 ? word : `${word}s`
	}

	/**
	 * Removes all whitespace from a string.
	 *
	 * @param text The string to modify.
	 * @returns The string without whitespace.
	 */
	static removeWhitespace(text: string): string {
		return text.replace(/\s+/g, '')
	}

	/**
	 * Reverses a string.
	 *
	 * @param text The string to reverse.
	 * @returns The reversed string.
	 */
	static reverseString(text: string): string {
		return text.split('').reverse().join('')
	}

	/**
	 * Converts a string to snake_case.
	 *
	 * @param text The string to convert.
	 * @returns The snake_case string.
	 */
	static snakeCase(text: string): string {
		return text.toLowerCase().split(/\s+/).join('_')
	}

	/**
	 * Converts a string to an array.
	 *
	 * @param text Text that will be converted into an array.
	 * @param options Parsing options.
	 * @returns The array of strings.
	 */
	static stringToArray(text: string, options?: StringToArrayParsingOptions): string[] {
		let result: string[] = []

		if (options?.removeWhitespace ?? true) {
			text = Strings.removeWhitespace(text)
		}
		if (text) {
			result = text.split(options?.delimiter ?? ',')
		}

		return result
	}

	/**
	 * Converts a string to Title Case, supporting a custom delimiter.
	 *
	 * @param text The string to convert.
	 * @param delimiter The delimiter used to split the string. Defaults to any whitespace.
	 * @returns The Title Case string.
	 */
	static titleCase(text: string, delimiter: RegExp | string = /\s+/): string {
		return text
			.split(delimiter)
			.map((word) => Strings.capitalize(word))
			.join(' ')
	}

	/**
	 * Truncates a string to a specified length.
	 *
	 * @param text The string to truncate.
	 * @param length The length to truncate to.
	 * @returns The truncated string.
	 */
	static truncateString(text: string, length: number): string {
		return text.length > length ? text.slice(0, length) + '...' : text
	}

	/**
	 * Splits a string into an array of words.
	 *
	 * @param text The string to split.
	 * @returns An array of words.
	 */
	static words(text: string): string[] {
		return text.trim().split(/\s+/)
	}
}

export const {
	camelCase,
	capitalize,
	isFalsy,
	isNumber,
	isTruthy,
	kebabCase,
	occurrences,
	padString,
	pascalCase,
	plural,
	removeWhitespace,
	reverseString,
	snakeCase,
	stringToArray,
	titleCase,
	truncateString,
	words,
} = Strings
