import { debuggable } from '@krauters/debuggable'
import queryString from 'query-string'

import { ToQueryParamsOptions } from './structures'

@debuggable()
export class Objects {
	/**
	 * Converts an object to a query parameter string.
	 *
	 * @param options An object containing the parameters and options for conversion.
	 * @returns The query parameter string.
	 */
	static toQueryParams(options: ToQueryParamsOptions): string {
		const { params, stringifyOptions, urlEncode = false } = options

		return queryString.stringify(params, {
			encode: urlEncode,
			...stringifyOptions,
		})
	}
}

export const { toQueryParams } = Objects
