import { debuggable } from '@krauters/debuggable'
import { log } from '@krauters/logger'

import type { SnapDateOptions } from './structures.ts'

import { plural } from './strings'
import { SnapType } from './structures'

@debuggable(log)
export class Dates {
	static snapActions = {
		[SnapType.Day]: (date: Date) => {
			date.setUTCHours(0, 0, 0, 0)
		},
		[SnapType.Hour]: (date: Date) => {
			date.setUTCMinutes(0, 0, 0)
		},
		[SnapType.Minute]: (date: Date) => {
			date.setUTCSeconds(0, 0)
		},
		[SnapType.Month]: (date: Date) => {
			date.setUTCDate(1)
			date.setUTCHours(0, 0, 0, 0)
		},
		[SnapType.Second]: (date: Date) => {
			date.setUTCSeconds(0, 0)
		},
		[SnapType.Week]: (date: Date) => {
			date.setUTCDate(date.getUTCDate() - date.getUTCDay())
			date.setUTCHours(0, 0, 0, 0)
		},
		[SnapType.Year]: (date: Date) => {
			date.setUTCMonth(0, 1)
			date.setUTCHours(0, 0, 0, 0)
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

		return Math.floor(millisecondsDifference / (1000 * 60 * 60))
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
		return Dates.snapDate(date, { snap: SnapType.Week })
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
		result.setUTCMonth(result.getUTCMonth() + (months ?? 0))
		result.setUTCDate(result.getUTCDate() + (days ?? 0))

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
			date: date.getUTCDate(),
			day: date.getUTCDay(),
			hours: date.getUTCHours(),
			isoString: date.toISOString(),
			milliseconds: date.getUTCMilliseconds(),
			minutes: date.getUTCMinutes(),
			month: date.getUTCMonth() + 1,
			seconds: date.getUTCSeconds(),
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
			year: date.getUTCFullYear(),
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
