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

	it('should convert string to kebab-case', () => {
		expect(Strings.kebabCase('Hello World')).toBe('hello-world')
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
