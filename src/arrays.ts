import { debuggable } from '@krauters/debuggable'

import type { Batch } from './index.ts'

/*
 * Note: If you make changes to this file, please also update the
 * corresponding file in ./monkeys to keep monkey patching consistent.
 */

@debuggable()
export class Arrays {
	/**
	 * Calculates the average of an array of numbers.
	 *
	 * @param numbers The array of numbers to average.
	 * @returns The average of the numbers, or undefined if the array is empty.
	 */
	static average(numbers: number[]): number | undefined {
		if (!numbers.length) {
			return undefined
		}

		const total = numbers.reduce((sum, num) => sum + num, 0)

		return Math.floor(total / numbers.length)
	}

	/**
	 * Creates a new array with all falsy values removed.
	 *
	 * @param array The array to process.
	 * @returns A new array without falsy values.
	 */
	static compact<T>(array: T[]): T[] {
		return array.filter(Boolean)
	}

	/**
	 * Cycles indefinitely through the elements of an iterable.
	 *
	 * @param iterable The iterable to cycle through.
	 * @yields The next element in the cycle.
	 */
	static *cycle<T>(iterable: Iterable<T>): Generator<T> {
		const items = Array.from(iterable)
		if (items.length === 0) return

		let index = 0
		while (true) {
			yield items[index]
			index = (index + 1) % items.length
		}
	}

	/**
	 * Creates a deep clone of an array.
	 *
	 * @param array The array to clone.
	 * @returns A deep copy of the array.
	 */
	static deepClone<T>(array: T[]): T[] {
		return JSON.parse(JSON.stringify(array)) as T[]
	}

	/**
	 * Returns the elements from the first array that are not present in the second array.
	 *
	 * @param sourceArray The array to inspect.
	 * @param excludeArray The array of values to exclude.
	 * @returns An array of unique elements from sourceArray not found in excludeArray.
	 */
	static difference<T>(sourceArray: T[], excludeArray: T[]): T[] {
		const excludeSet = new Set(excludeArray)

		return sourceArray.filter((item) => !excludeSet.has(item))
	}

	/**
	 * Filters elements from an iterable based on a predicate function.
	 *
	 * @param iterable The iterable to filter.
	 * @param predicate A function that returns true for elements to be included.
	 * @yields The elements that satisfy the predicate.
	 */
	static *filter<T>(iterable: Iterable<T>, predicate: (item: T) => boolean): Generator<T> {
		for (const item of iterable) {
			if (predicate(item)) {
				yield item
			}
		}
	}

	/**
	 * Recursively flattens a nested array into a single-level array.
	 *
	 * @param array The array to flatten.
	 * @returns A new array with all sub-array elements concatenated into it recursively.
	 */
	static flatten<T>(array: T[]): T[] {
		return array.reduce(
			(flattenedArray: T[], item) =>
				Array.isArray(item)
					? flattenedArray.concat(Arrays.flatten(item as unknown as T[]))
					: flattenedArray.concat(item),
			[],
		)
	}

	/**
	 * Joins an array of strings into a human-readable list.
	 *
	 * Each item is separated by a comma, and 'and' is inserted before the last item.
	 *
	 * @param items The array of strings to join.
	 * @returns A formatted string representing the list.
	 */
	static formatStringList(items: string[]): string {
		if (items.length === 0) {
			return ''
		} else if (items.length === 1) {
			return items[0]
		} else if (items.length === 2) {
			return `${items[0]} and ${items[1]}`
		}

		const allExceptLast = items.slice(0, -1).join(', ')

		return `${allExceptLast}, and ${items[items.length - 1]}`
	}

	/**
	 * Generates batches from an array of items.
	 *
	 * @param items The array of items to batch.
	 * @param size The maximum number of items per batch.
	 * @yields Objects containing the batch index and the items in that batch.
	 */
	static *getBatches<T>(items: T[], size = 50): Generator<Batch<T>> {
		for (let startIndex = 0; startIndex < items.length; startIndex += size) {
			yield {
				index: startIndex,
				items: items.slice(startIndex, startIndex + size),
			}
		}
	}

	/**
	 * Returns an array of elements that are present in both arrays.
	 *
	 * @param firstArray The first array to compare.
	 * @param secondArray The second array to compare.
	 * @returns An array of elements common to both arrays.
	 */
	static intersection<T>(firstArray: T[], secondArray: T[]): T[] {
		const secondSet = new Set(secondArray)

		return firstArray.filter((item) => secondSet.has(item))
	}

	/**
	 * Generates a sequence of numbers from start to end with a given step.
	 *
	 * @param start The starting number of the sequence.
	 * @param end The end number of the sequence (exclusive).
	 * @param step The increment between each number in the sequence. Defaults to 1.
	 * @yields The next number in the sequence.
	 */
	static *range(start: number, end: number, step = 1): Generator<number> {
		if (step === 0) throw new Error('Step cannot be zero.')

		if (step > 0) {
			for (let i = start; i < end; i += step) {
				yield i
			}
		} else {
			for (let i = start; i > end; i += step) {
				yield i
			}
		}
	}

	/**
	 * Creates a new array with specified values removed.
	 *
	 * @param array The array to process.
	 * @param values The values to remove from the array.
	 * @returns A new array excluding the specified values.
	 */
	static remove<T>(array: T[], ...values: T[]): T[] {
		const valuesToRemoveSet = new Set(values)

		return array.filter((item) => !valuesToRemoveSet.has(item))
	}

	/**
	 * Creates a new array with duplicate values removed.
	 *
	 * @param array The array to process.
	 * @returns A new array containing only unique values.
	 */
	static removeDuplicates<T>(array: T[]): T[] {
		return Array.from(new Set(array))
	}
}

export const {
	average,
	compact,
	cycle,
	deepClone,
	difference,
	filter,
	flatten,
	formatStringList,
	getBatches,
	intersection,
	range,
	remove,
	removeDuplicates,
} = Arrays
