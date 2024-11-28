import { describe, expect, it } from '@jest/globals'

import { Arrays } from '../src/arrays'

// eslint-disable-next-line max-lines-per-function
describe('Arrays', () => {
	describe('average', () => {
		it('should return the average of an array of numbers', () => {
			expect(Arrays.average([1, 2, 3, 4, 5])).toBe(3)
			expect(Arrays.average([10, 20, 30])).toBe(20)
			expect(Arrays.average([-5, 0, 5])).toBe(0)
		})

		it('should return undefined for an empty array', () => {
			expect(Arrays.average([])).toBeUndefined()
		})

		it('should return the floored average', () => {
			// (1+2+3)/3 = 2
			expect(Arrays.average([1, 2, 3])).toBe(2)

			// (1+2+4)/3 = 2.333... floored to 2
			expect(Arrays.average([1, 2, 4])).toBe(2)
		})
	})

	describe('compact', () => {
		it('should remove all falsy values from the array', () => {
			expect(Arrays.compact([0, 1, false, 2, '', 3])).toEqual([1, 2, 3])
			expect(Arrays.compact([null, undefined, 'hello', NaN, 'world'])).toEqual(['hello', 'world'])
		})

		it('should return an empty array if all values are falsy', () => {
			expect(Arrays.compact([false, 0, '', null, undefined, NaN])).toEqual([])
		})

		it('should not remove truthy values', () => {
			expect(Arrays.compact([true, 'a', 1, {}, []])).toEqual([true, 'a', 1, {}, []])
		})
	})

	describe('deepClone', () => {
		it('should create a deep clone of the array', () => {
			const original = [1, 2, { a: 3 }, [4, 5]]
			const clone = Arrays.deepClone(original)

			expect(clone).toEqual(original)
			expect(clone).not.toBe(original)
			expect(clone[2]).not.toBe(original[2])
			expect(clone[3]).not.toBe(original[3])
		})

		it('should handle empty arrays', () => {
			const original: unknown[] = []
			const clone = Arrays.deepClone(original)

			expect(clone).toEqual(original)
			expect(clone).not.toBe(original)
		})

		it('should handle arrays with primitive types', () => {
			const original = [1, 2, 3, 4, 5]
			const clone = Arrays.deepClone(original)

			expect(clone).toEqual(original)
			expect(clone).not.toBe(original)
		})

		it('should handle nested arrays', () => {
			const original = [
				[1, 2],
				[3, 4],
				[5, [6, 7]],
			]
			const clone = Arrays.deepClone(original)

			expect(clone).toEqual(original)
			expect(clone).not.toBe(original)
			expect(clone[2][1]).not.toBe(original[2][1])
		})
	})

	describe('difference', () => {
		it('should return elements in sourceArray not present in excludeArray', () => {
			expect(Arrays.difference([1, 2, 3, 4], [2, 4])).toEqual([1, 3])
			expect(Arrays.difference(['a', 'b', 'c'], ['b'])).toEqual(['a', 'c'])
		})

		it('should return the original array if excludeArray is empty', () => {
			expect(Arrays.difference([1, 2, 3], [])).toEqual([1, 2, 3])
		})

		it('should return an empty array if all elements are excluded', () => {
			expect(Arrays.difference([1, 2], [1, 2])).toEqual([])
		})

		it('should handle arrays with different data types', () => {
			expect(Arrays.difference([1, '2', true, null], ['2', null])).toEqual([1, true])
		})
	})

	describe('flatten', () => {
		it('should recursively flatten a nested array', () => {
			expect(Arrays.flatten([1, [2, [3, 4], 5], 6])).toEqual([1, 2, 3, 4, 5, 6])
			expect(Arrays.flatten([[['a']], ['b'], 'c'])).toEqual(['a', 'b', 'c'])
		})

		it('should return the same array if it is already flat', () => {
			expect(Arrays.flatten([1, 2, 3])).toEqual([1, 2, 3])
		})

		it('should handle empty arrays and nested empty arrays', () => {
			expect(Arrays.flatten([])).toEqual([])
			expect(Arrays.flatten([[], [[], []]])).toEqual([])
		})

		it('should handle arrays with different data types', () => {
			expect(Arrays.flatten([1, ['a', [true, null]], 'b'])).toEqual([1, 'a', true, null, 'b'])
		})
	})

	describe('formatStringList', () => {
		it('should format an empty list as an empty string', () => {
			expect(Arrays.formatStringList([])).toBe('')
		})

		it('should format a single-item list correctly', () => {
			expect(Arrays.formatStringList(['Apple'])).toBe('Apple')
		})

		it('should format a two-item list correctly', () => {
			expect(Arrays.formatStringList(['Apple', 'Banana'])).toBe('Apple and Banana')
		})

		it('should format a multi-item list correctly', () => {
			expect(Arrays.formatStringList(['Apple', 'Banana', 'Cherry'])).toBe('Apple, Banana, and Cherry')
			expect(Arrays.formatStringList(['Red', 'Green', 'Blue', 'Yellow'])).toBe('Red, Green, Blue, and Yellow')
		})

		it('should handle lists with one empty string', () => {
			expect(Arrays.formatStringList([''])).toBe('')
		})
	})

	describe('getBatches', () => {
		it('should yield correct batches based on the specified size', () => {
			const items = [1, 2, 3, 4, 5, 6, 7]
			const batchSize = 3
			const batches = Array.from(Arrays.getBatches(items, batchSize))

			expect(batches).toEqual([
				{ index: 0, items: [1, 2, 3] },
				{ index: 3, items: [4, 5, 6] },
				{ index: 6, items: [7] },
			])
		})

		it('should yield a single batch if size exceeds the array length', () => {
			const items = [1, 2, 3]
			const batchSize = 5
			const batches = Array.from(Arrays.getBatches(items, batchSize))

			expect(batches).toEqual([{ index: 0, items: [1, 2, 3] }])
		})

		it('should yield multiple full batches without a remainder', () => {
			const items = [1, 2, 3, 4, 5, 6]
			const batchSize = 2
			const batches = Array.from(Arrays.getBatches(items, batchSize))

			expect(batches).toEqual([
				{ index: 0, items: [1, 2] },
				{ index: 2, items: [3, 4] },
				{ index: 4, items: [5, 6] },
			])
		})

		it('should handle an empty array', () => {
			const items: number[] = []
			const batches = Array.from(Arrays.getBatches(items))

			expect(batches).toEqual([])
		})

		it('should use the default batch size if not specified', () => {
			// eslint-disable-next-line @typescript-eslint/naming-convention
			const items = Array.from({ length: 100 }, (_, i) => i + 1)
			const batches = Array.from(Arrays.getBatches(items))

			expect(batches.length).toBe(2)
			expect(batches[0].items.length).toBe(50)
			expect(batches[1].items.length).toBe(50)
		})
	})

	describe('intersection', () => {
		it('should return common elements between two arrays', () => {
			expect(Arrays.intersection([1, 2, 3], [2, 3, 4])).toEqual([2, 3])
			expect(Arrays.intersection(['a', 'b', 'c'], ['b', 'c', 'd'])).toEqual(['b', 'c'])
		})

		it('should return an empty array if there are no common elements', () => {
			expect(Arrays.intersection([1, 2, 3], [4, 5, 6])).toEqual([])
			expect(Arrays.intersection(['a', 'b'], ['c', 'd'])).toEqual([])
		})

		it('should handle arrays with different data types', () => {
			expect(Arrays.intersection([1, '2', true], ['2', true, false])).toEqual(['2', true])
		})

		it('should return unique common elements', () => {
			expect(Arrays.intersection([1, 2, 2, 3], [2, 2, 4])).toEqual([2, 2])
		})
	})

	describe('remove', () => {
		it('should remove specified values from the array', () => {
			expect(Arrays.remove([1, 2, 3, 4], 2, 4)).toEqual([1, 3])
			expect(Arrays.remove(['a', 'b', 'c'], 'b')).toEqual(['a', 'c'])
		})

		it('should return the original array if no values are specified', () => {
			expect(Arrays.remove([1, 2, 3])).toEqual([1, 2, 3])
		})

		it('should handle removing multiple occurrences of a value', () => {
			expect(Arrays.remove([1, 2, 2, 3, 4, 2], 2)).toEqual([1, 3, 4])
		})

		it('should handle arrays with different data types', () => {
			expect(Arrays.remove([1, '2', true, '2'], '2')).toEqual([1, true])
		})

		it('should return an empty array if all elements are removed', () => {
			expect(Arrays.remove([1, 1, 1], 1)).toEqual([])
		})
	})

	describe('removeDuplicates', () => {
		it('should remove duplicate values from the array', () => {
			expect(Arrays.removeDuplicates([1, 2, 2, 3, 4, 4, 5])).toEqual([1, 2, 3, 4, 5])
			expect(Arrays.removeDuplicates(['a', 'b', 'a', 'c'])).toEqual(['a', 'b', 'c'])
		})

		it('should return the same array if there are no duplicates', () => {
			expect(Arrays.removeDuplicates([1, 2, 3])).toEqual([1, 2, 3])
			expect(Arrays.removeDuplicates(['a', 'b', 'c'])).toEqual(['a', 'b', 'c'])
		})

		it('should handle an empty array', () => {
			expect(Arrays.removeDuplicates([])).toEqual([])
		})

		it('should handle arrays with different data types', () => {
			expect(Arrays.removeDuplicates([1, '1', 1, '1'])).toEqual([1, '1'])
		})
	})

	describe('range', () => {
		it('should generate a range of numbers with default step', () => {
			const generator = Arrays.range(1, 5)
			const result = Array.from(generator).slice(0, 4)

			expect(result).toEqual([1, 2, 3, 4])
		})

		it('should generate a range of numbers with positive step', () => {
			const generator = Arrays.range(0, 10, 2)
			const result = Array.from(generator).slice(0, 5)

			expect(result).toEqual([0, 2, 4, 6, 8])
		})

		it('should generate a range of numbers with negative step', () => {
			const generator = Arrays.range(5, 0, -1)
			const result = Array.from(generator).slice(0, 5)

			expect(result).toEqual([5, 4, 3, 2, 1])
		})

		it('should not yield any values if start is greater than end with positive step', () => {
			const generator = Arrays.range(10, 5, 1)
			const result = Array.from(generator).slice(0, 5)

			expect(result).toEqual([])
		})

		it('should not yield any values if start is less than end with negative step', () => {
			const generator = Arrays.range(1, 5, -1)
			const result = Array.from(generator).slice(0, 5)

			expect(result).toEqual([])
		})

		it('should throw an error if step is zero', () => {
			expect(() => {
				Array.from(Arrays.range(1, 5, 0)).slice(0, 4)
			}).toThrow('Step cannot be zero.')
		})
	})

	describe('cycle', () => {
		it('should cycle indefinitely through the iterable', () => {
			const iterable = ['a', 'b', 'c']
			const generator = Arrays.cycle(iterable)

			expect(generator.next().value).toBe('a')
			expect(generator.next().value).toBe('b')
			expect(generator.next().value).toBe('c')
			expect(generator.next().value).toBe('a')
			expect(generator.next().value).toBe('b')
		})

		it('should not yield any values for an empty iterable', () => {
			const iterable: unknown[] = []
			const generator = Arrays.cycle(iterable)

			expect(generator.next().done).toBe(true)
		})

		it('should handle single-element iterables', () => {
			const iterable = [42]
			const generator = Arrays.cycle(iterable)

			expect(generator.next().value).toBe(42)
			expect(generator.next().value).toBe(42)
			expect(generator.next().value).toBe(42)
		})
	})

	describe('filter', () => {
		it('should yield elements that satisfy the predicate', () => {
			const iterable = [1, 2, 3, 4, 5, 6]
			const predicate = (num: number) => num % 2 === 0
			const generator = Arrays.filter(iterable, predicate)
			const result = Array.from(generator)

			expect(result).toEqual([2, 4, 6])
		})

		it('should yield no elements if none satisfy the predicate', () => {
			const iterable = [1, 3, 5]
			const predicate = (num: number) => num % 2 === 0
			const generator = Arrays.filter(iterable, predicate)
			const result = Array.from(generator)

			expect(result).toEqual([])
		})

		it('should yield all elements if all satisfy the predicate', () => {
			const iterable = [2, 4, 6]
			const predicate = (num: number) => num % 2 === 0
			const generator = Arrays.filter(iterable, predicate)
			const result = Array.from(generator)

			expect(result).toEqual([2, 4, 6])
		})

		it('should handle different data types', () => {
			const iterable = ['apple', 'banana', 'cherry', 'date']
			const predicate = (fruit: string) => fruit.startsWith('b')
			const generator = Arrays.filter(iterable, predicate)
			const result = Array.from(generator)

			expect(result).toEqual(['banana'])
		})
	})
})
