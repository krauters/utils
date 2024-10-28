import { describe, expect, it } from '@jest/globals'

import { Objects } from '../src/objects'

describe('Objects Utility', () => {
	describe('toQueryParams', () => {
		it('converts a simple object to query parameters', () => {
			const options = {
				params: { name: 'krauters', page: 1 },
				urlEncode: false,
			}
			const result = Objects.toQueryParams(options)
			expect(result).toBe('name=krauters&page=1')
		})

		it('URL-encodes the query string when urlEncode is true', () => {
			const options = {
				params: { name: 'krauters', space: 'with space' },
				urlEncode: true,
			}
			const result = Objects.toQueryParams(options)
			expect(result).toBe(encodeURIComponent('name=krauters&space=with space'))
		})

		it('excludes specified keys from the query string', () => {
			const options = {
				excludeKeys: ['excludeMe'],
				params: { excludeMe: 'skip', name: 'krauters', page: 1 },
			}
			const result = Objects.toQueryParams(options)
			expect(result).toBe('name=krauters&page=1')
		})

		it('includes only specified keys in the query string', () => {
			const options = {
				includeKeys: ['name', 'extra'],
				params: { extra: 'extra', name: 'krauters', page: 1 },
			}
			const result = Objects.toQueryParams(options)
			expect(result).toBe('name=krauters&extra=extra')
		})

		it('sorts keys alphabetically when sortKeys is true', () => {
			const options = {
				params: { a: 'A', b: 'B', c: 'C' },
				sortKeys: true,
			}
			const result = Objects.toQueryParams(options)
			expect(result).toBe('a=A&b=B&c=C')
		})
	})

	describe('fromQueryParams', () => {
		it('converts a query string back into an object', () => {
			const query = 'name=krauters&page=1'
			const result = Objects.fromQueryParams({ query })
			expect(result).toEqual({ name: 'krauters', page: '1' })
		})

		it('handles URL-encoded query strings', () => {
			const query = encodeURIComponent('name=krauters&space=with space')
			const result = Objects.fromQueryParams({ query })
			expect(result).toEqual({ name: 'krauters', space: 'with space' })
		})
	})
})
