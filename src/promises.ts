import { debuggable } from '@krauters/debuggable'
import { log } from '@krauters/logger'

import { TimeoutError } from './index'

@debuggable(log)
export class Promises {
	/**
	 * Sleep function that returns a promise that resolves after the given seconds have passed.
	 *
	 * @param seconds Number of seconds before promise is resolved.
	 * @returns A promise that resolves after the specified time.
	 */
	static async sleep(seconds: number): Promise<void> {
		return new Promise((resolve) => setTimeout(resolve, seconds * 1000))
	}

	/**
	 * Executes a promise and rejects with a timeout error if it does not resolve within the specified time.
	 *
	 * @param promise The promise to execute with a timeout.
	 * @param ms The timeout in milliseconds.
	 * @returns A promise that resolves with the original promise's value or rejects with a timeout error.
	 */
	static withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
		let timeoutId: NodeJS.Timeout
		// eslint-disable-next-line @typescript-eslint/naming-convention
		const timeoutPromise = new Promise<T>((_, reject) => {
			timeoutId = setTimeout(() => {
				reject(new TimeoutError(`Promise timed out after [${ms}] ms`))
			}, ms)
		})

		return Promise.race([promise, timeoutPromise]).finally(() => {
			clearTimeout(timeoutId)
		})
	}
}

export const { sleep, withTimeout } = Promises
