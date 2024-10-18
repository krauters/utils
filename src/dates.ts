import { debuggable } from '@krauters/debuggable'

import type { SnapDateOptions } from './structures.ts'

import { plural } from './index'
import { SnapType } from './structures'

@debuggable()
export class Dates {
	static snapActions = {
		[SnapType.Day]: (date: Date) => {
			date.setHours(0, 0, 0, 0)
		},
		[SnapType.Hour]: (date: Date) => {
			date.setHours(date.getHours(), 0, 0, 0)
		},
		[SnapType.Minute]: (date: Date) => {
			date.setMinutes(0, 0, 0)
		},
		[SnapType.Month]: (date: Date) => {
			date.setDate(1)
			date.setHours(0, 0, 0, 0)
		},
		[SnapType.Second]: (date: Date) => {
			date.setSeconds(0, 0)
		},
		[SnapType.Week]: (date: Date) => {
			date.setDate(date.getDate() - date.getDay())
			date.setHours(0, 0, 0, 0)
		},
		[SnapType.Year]: (date: Date) => {
			date.setMonth(0, 1)
			date.setHours(0, 0, 0, 0)
		},
	}

	/**
	 * Calculates the number of hours that have passed since a given date.
	 *
	 * @param date The date to calculate from.
	 * @returns The number of hours since the given date.
	 */
	static getHoursAgo(date: Date): number {
		const millisecondsDifference = Date.now() - date.valueOf()
		const hoursAgo = Math.floor(millisecondsDifference / (1000 * 60 * 60))

		return hoursAgo
	}

	/**
	 * Generates a human-readable string representing the relative age based on hours ago.
	 *
	 * @param hoursAgo The number of hours since the event occurred.
	 * @param withAgo Whether to include the ' ago' suffix in the returned string.
	 * @returns A human-readable string indicating the relative age.
	 */
	static getRelativeAge(hoursAgo: number, withAgo = true): string {
		const agoSuffix = withAgo ? ' ago' : ''
		if (hoursAgo < 1) {
			return 'in the last hour'
		} else if (hoursAgo < 24) {
			return `${hoursAgo} ${plural('hour', hoursAgo)}${agoSuffix}`
		}
		const daysAgo = Math.floor(hoursAgo / 24)

		return `${daysAgo} ${plural('day', daysAgo)}${agoSuffix}`
	}

	/**
	 * Calculates the start date of the week for a given date.
	 *
	 * @param date The date from which to calculate the week's start.
	 * @returns A new Date object representing the start of the week.
	 */
	static getWeekStart(date: Date = new Date()): Date {
		const startOfWeek = new Date(date.getTime())
		const dayOfWeek = startOfWeek.getDay()
		const diff = startOfWeek.getDate() - dayOfWeek
		startOfWeek.setDate(diff)
		startOfWeek.setHours(0, 0, 0, 0)

		return startOfWeek
	}

	/**
	 * Calculates the absolute number of minutes between two dates.
	 *
	 * @param date1 The first date.
	 * @param date2 The second date.
	 * @returns The number of minutes between the two dates.
	 */
	static minutesBetweenDates(date1: Date, date2: Date): number {
		const millisecondsPerMinute = 1000 * 60
		const differenceInMilliseconds = date2.getTime() - date1.getTime()

		return Math.floor(Math.abs(differenceInMilliseconds / millisecondsPerMinute))
	}

	/**
	 * Adjusts a date by adding specified days or months and optionally snapping to a time unit.
	 *
	 * @param date The date to adjust.
	 * @param options Options for adjusting and snapping the date.
	 * @returns The adjusted date.
	 */
	static snapDate(date?: Date, { days, months, snap = SnapType.Day }: SnapDateOptions = {}): Date {
		const result = new Date((date ?? new Date()).getTime())
		result.setMonth(result.getMonth() + (months ?? 0))
		result.setDate(result.getDate() + (days ?? 0))

		if (snap && Dates.snapActions[snap]) {
			Dates.snapActions[snap](result)
		}

		return result
	}

	/**
	 * Converts the given date into an object with various date components.
	 *
	 * @param date The date to convert.
	 * @returns An object containing date components like day, month, year, etc.
	 */
	static toMap(date: Date): Record<string, number | string> {
		return {
			date: date.getDate(),
			day: date.getDay(),
			hours: date.getHours(),
			isoString: date.toISOString(),
			milliseconds: date.getMilliseconds(),
			minutes: date.getMinutes(),
			month: date.getMonth() + 1,
			seconds: date.getSeconds(),
			time: date.getTime(),
			timezoneOffset: date.getTimezoneOffset(),
			utcDate: date.getUTCDate(),
			utcDay: date.getUTCDay(),
			utcFullYear: date.getUTCFullYear(),
			utcHours: date.getUTCHours(),
			utcMilliseconds: date.getUTCMilliseconds(),
			utcMinutes: date.getUTCMinutes(),
			utcMonth: date.getUTCMonth(),
			utcSeconds: date.getUTCSeconds(),
			year: date.getFullYear(),
		}
	}
}

export const {
	getHoursAgo,
	getRelativeAge: getRelativeHumanReadableAge,
	getWeekStart,
	minutesBetweenDates,
	snapActions,
	snapDate,
	toMap,
} = Dates
