import { describe, expect, it } from '@jest/globals'

import { Strings } from '../src/strings'

describe('Strings Utility Functions', () => {
	it('should convert string to camelCase', () => {
		expect(Strings.camelCase('Hello World')).toBe('helloWorld')
	})

	it('should capitalize the string', () => {
		expect(Strings.capitalize('hello')).toBe('Hello')
	})

	it('should determine if a string is falsy', () => {
		expect(Strings.isFalsy('')).toBe(true)
		expect(Strings.isFalsy('false')).toBe(true)
		expect(Strings.isFalsy('yes')).toBe(false)
	})

	it('should check if a string is a number', () => {
		expect(Strings.isNumber('123')).toBe(true)
		expect(Strings.isNumber('abc')).toBe(false)
	})

	describe('Strings.kebabCase', () => {
		it('should convert string to kebab-case', () => {
			expect(Strings.kebabCase('Hello World')).toBe('hello-world')
		})

		it('should handle PascalCase and camelCase when splitCase is true', () => {
			expect(Strings.kebabCase('HelloWorld', true)).toBe('hello-world')
			expect(Strings.kebabCase('camelCaseInput', true)).toBe('camel-case-input')
			expect(Strings.kebabCase('PascalCaseOrCamelCase', true)).toBe('pascal-case-or-camel-case')
		})

		it('should handle PascalCase and camelCase when splitCase is false', () => {
			expect(Strings.kebabCase('HelloWorld')).toBe('helloworld')
			expect(Strings.kebabCase('camelCaseInput')).toBe('camelcaseinput')
			expect(Strings.kebabCase('PascalCaseOrCamelCase')).toBe('pascalcaseorcamelcase')
		})

		it('should handle strings with special characters', () => {
			expect(Strings.kebabCase('Hello, World!')).toBe('hello-world')
			expect(Strings.kebabCase('String-with-dashes--and--spaces')).toBe('string-with-dashes-and-spaces')
			expect(Strings.kebabCase('Special#Characters@Here')).toBe('special-characters-here')
		})

		it('should handle edge cases like empty strings and single characters', () => {
			expect(Strings.kebabCase('')).toBe('')
			expect(Strings.kebabCase('A')).toBe('a')
			expect(Strings.kebabCase('1')).toBe('1')
			expect(Strings.kebabCase('---')).toBe('')
		})

		it('should handle numeric inputs in the string', () => {
			expect(Strings.kebabCase('123')).toBe('123')
			expect(Strings.kebabCase('A1B2C3', true)).toBe('a-1-b-2-c-3')
			expect(Strings.kebabCase('123abc')).toBe('123abc')
			expect(Strings.kebabCase('abc123xyz')).toBe('abc123xyz')
		})

		it('should remove consecutive dashes', () => {
			expect(Strings.kebabCase('Hello---World')).toBe('hello-world')
			expect(Strings.kebabCase('Multiple---Dashes---In---String')).toBe('multiple-dashes-in-string')
		})

		it('should preserve existing dashes when valid', () => {
			expect(Strings.kebabCase('Already-in-kebab-case')).toBe('already-in-kebab-case')
			expect(Strings.kebabCase('preserve--dashes--correctly')).toBe('preserve-dashes-correctly')
		})

		it('should handle mixed cases with spaces, special characters, and case-splitting', () => {
			expect(Strings.kebabCase('PascalCase Mixed-with spaces-and Special#Chars', true)).toBe(
				'pascal-case-mixed-with-spaces-and-special-chars',
			)
			expect(Strings.kebabCase('CamelCaseWith@Numbers123', true)).toBe('camel-case-with-numbers-123')
		})
	})

	it('should count occurrences of substring', () => {
		expect(Strings.occurrences('hello world hello', 'hello')).toBe(2)
	})

	it('should convert string to PascalCase', () => {
		expect(Strings.pascalCase('hello world')).toBe('HelloWorld')
	})

	it('should pluralize a word', () => {
		expect(Strings.plural('cat', 2)).toBe('cats')
		expect(Strings.plural('cat', 1)).toBe('cat')
	})

	it('should remove whitespace from string', () => {
		expect(Strings.removeWhitespace('  hello  world  ')).toBe('helloworld')
	})

	it('should convert string to snake_case', () => {
		expect(Strings.snakeCase('Hello World')).toBe('hello_world')
	})

	it('should convert string to an array', () => {
		expect(Strings.stringToArray('hello,world')).toEqual(['hello', 'world'])
	})

	it('should convert string to Title Case', () => {
		expect(Strings.titleCase('hello world')).toBe('Hello World')
	})

	it('should truncate string to specified length', () => {
		expect(Strings.truncateString('hello world', 5)).toBe('hello...')
	})

	it('should reverse the string', () => {
		expect(Strings.reverseString('hello')).toBe('olleh')
	})

	it('should pad the string to a specified length', () => {
		expect(Strings.padString('hello', 10, '_')).toBe('hello_____')
	})
})
