import { debuggable } from '@krauters/debuggable'
import queryString, { type StringifyOptions } from 'query-string'

@debuggable()
export class Objects {
	/**
	 * Converts an object to a query parameter string.
	 *
	 * @param params The object to convert to query parameters.
	 * @param urlEncode Whether to URL-encode the query string. Defaults to false.
	 * @param options Options for the query-string stringify method.
	 * @returns The query parameter string.
	 */
	static toQueryParams(params: Record<string, unknown>, urlEncode = false, options?: StringifyOptions): string {
		return queryString.stringify(params, {
			encode: urlEncode,
			...options,
		})
	}
}

export const { toQueryParams } = Objects
