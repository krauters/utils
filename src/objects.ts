import { debuggable } from '@krauters/debuggable'

import { FromQueryParamsOptions, ToQueryParamsOptions } from './structures'

@debuggable()
export class Objects {
	/**
	 * Converts a query parameter string back into an object.
	 *
	 * @param options An object containing the query parameter string to convert.
	 * @returns An object representation of the query parameters.
	 */
	static fromQueryParams(options: FromQueryParamsOptions): Record<string, string> {
		const searchParams = new URLSearchParams(options.query)

		return Object.fromEntries(searchParams.entries())
	}

	/**
	 * Converts an object to a query parameter string with additional options.
	 *
	 * @param options An object containing parameters and options for conversion.
	 * @returns The query parameter string.
	 */
	static toQueryParams(options: ToQueryParamsOptions): string {
		const { excludeKeys = [], includeKeys = [], params, sortKeys = false, urlEncode = false } = options

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const filteredParams = Object.keys(params).reduce<Record<string, any>>((acc, key) => {
			if (includeKeys.length && !includeKeys.includes(key)) return acc
			if (excludeKeys.includes(key)) return acc
			acc[key] = params[key]

			return acc
		}, {})

		const searchParams = new URLSearchParams(
			sortKeys ? Object.entries(filteredParams).sort(([a], [b]) => a.localeCompare(b)) : filteredParams,
		)

		const queryString = searchParams.toString()

		return urlEncode ? encodeURIComponent(queryString) : queryString
	}
}

export const { fromQueryParams, toQueryParams } = Objects
