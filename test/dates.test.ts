import { describe, expect, it } from '@jest/globals'

import { Dates } from '../src/dates'
import { SnapType } from '../src/structures'

// eslint-disable-next-line max-lines-per-function
describe('Dates', () => {
	describe('getWeekStart', () => {
		it('should return the same day if it is Sunday', () => {
			const date = new Date(Date.UTC(2023, 9, 15))
			const expectedStart = new Date(Date.UTC(2023, 9, 15))

			const startOfWeek = Dates.getWeekStart(date)
			expect(startOfWeek.toISOString()).toBe(expectedStart.toISOString())
			expect(startOfWeek.getUTCHours()).toBe(0)
			expect(startOfWeek.getUTCMinutes()).toBe(0)
			expect(startOfWeek.getUTCSeconds()).toBe(0)
			expect(startOfWeek.getUTCMilliseconds()).toBe(0)
		})

		it('should return the start of the week for a given date', () => {
			const date = new Date(Date.UTC(2023, 9, 18))
			const expectedStart = new Date(Date.UTC(2023, 9, 15))

			const startOfWeek = Dates.getWeekStart(date)
			expect(startOfWeek.toISOString()).toBe(expectedStart.toISOString())
			expect(startOfWeek.getUTCHours()).toBe(0)
			expect(startOfWeek.getUTCMinutes()).toBe(0)
			expect(startOfWeek.getUTCSeconds()).toBe(0)
			expect(startOfWeek.getUTCMilliseconds()).toBe(0)
		})

		it('should default to the current date if no date is provided', () => {
			const now = new Date()
			const startOfWeek = Dates.getWeekStart()

			const expectedStart = new Date(now.getTime())
			const dayOfWeek = expectedStart.getUTCDay()
			expectedStart.setUTCDate(expectedStart.getUTCDate() - dayOfWeek)
			expectedStart.setUTCHours(0, 0, 0, 0)

			expect(startOfWeek.toUTCString()).toBe(expectedStart.toUTCString())
		})
	})

	describe('getHoursAgo', () => {
		it('should return the correct number of hours ago for past dates', () => {
			const now = new Date()
			const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000)
			const fiveHoursAgo = new Date(now.getTime() - 5 * 60 * 60 * 1000)

			expect(Dates.getHoursAgo(twoHoursAgo)).toBe(2)
			expect(Dates.getHoursAgo(fiveHoursAgo)).toBe(5)
		})

		it('should return negative hours for future dates', () => {
			const now = new Date()
			const twoHoursLater = new Date(now.getTime() + 2 * 60 * 60 * 1000)

			expect(Dates.getHoursAgo(twoHoursLater)).toBe(-2)
		})

		it('should return 0 for the current time', () => {
			const now = new Date()
			expect(Dates.getHoursAgo(now)).toBe(0)
		})
	})

	describe('getRelativeAge', () => {
		it("should return 'in the last hour' for hoursAgo less than 1", () => {
			expect(Dates.getRelativeAge(0)).toBe('in the last hour')
			expect(Dates.getRelativeAge(0.5)).toBe('in the last hour')
		})

		it('should return correct hours ago with "ago" suffix', () => {
			expect(Dates.getRelativeAge(2)).toBe('2 hours ago')
			expect(Dates.getRelativeAge(1)).toBe('1 hour ago')
		})

		it('should return correct hours ago without "ago" suffix', () => {
			expect(Dates.getRelativeAge(2, false)).toBe('2 hours')
			expect(Dates.getRelativeAge(1, false)).toBe('1 hour')
		})

		it('should return correct days ago with "ago" suffix', () => {
			expect(Dates.getRelativeAge(24)).toBe('1 day ago')
			expect(Dates.getRelativeAge(48)).toBe('2 days ago')
			expect(Dates.getRelativeAge(72)).toBe('3 days ago')
		})

		it('should return correct days ago without "ago" suffix', () => {
			expect(Dates.getRelativeAge(24, false)).toBe('1 day')
			expect(Dates.getRelativeAge(48, false)).toBe('2 days')
		})
	})

	describe('minutesBetweenDates', () => {
		it('should return the correct number of minutes between two dates', () => {
			const date1 = new Date('2023-10-18T10:00:00Z')
			const date2 = new Date('2023-10-18T10:30:00Z')

			expect(Dates.minutesBetweenDates(date1, date2)).toBe(30)
			expect(Dates.minutesBetweenDates(date2, date1)).toBe(30)
		})

		it('should return 0 if both dates are the same', () => {
			const date = new Date('2023-10-18T10:00:00Z')
			expect(Dates.minutesBetweenDates(date, date)).toBe(0)
		})

		it('should return the absolute number of minutes regardless of date order', () => {
			const date1 = new Date('2023-10-18T09:45:00Z')
			const date2 = new Date('2023-10-18T10:15:00Z')

			expect(Dates.minutesBetweenDates(date1, date2)).toBe(30)
			expect(Dates.minutesBetweenDates(date2, date1)).toBe(30)
		})
	})

	describe('snapDate', () => {
		it('should snap the date to the start of the day by default', () => {
			const date = new Date('2023-10-18T15:30:45Z')
			const snapped = Dates.snapDate(date)

			const expectedStart = new Date(Date.UTC(2023, 9, 18))

			expect(snapped.toISOString()).toBe(expectedStart.toISOString())
			expect(snapped.getUTCHours()).toBe(0)
			expect(snapped.getUTCMinutes()).toBe(0)
			expect(snapped.getUTCSeconds()).toBe(0)
			expect(snapped.getUTCMilliseconds()).toBe(0)
		})

		it('should snap the date to the start of the hour', () => {
			const date = new Date('2023-10-18T15:30:45Z')
			const snapped = Dates.snapDate(date, { snap: SnapType.Hour })

			const expectedStart = new Date(Date.UTC(2023, 9, 18, 15))

			expect(snapped.toISOString()).toBe(expectedStart.toISOString())
			expect(snapped.getUTCHours()).toBe(15)
			expect(snapped.getUTCMinutes()).toBe(0)
			expect(snapped.getUTCSeconds()).toBe(0)
			expect(snapped.getUTCMilliseconds()).toBe(0)
		})

		it('should snap the date to the start of the minute', () => {
			const date = new Date('2023-10-18T15:30:45Z')
			const snapped = Dates.snapDate(date, { snap: SnapType.Minute })

			const expectedStart = new Date(Date.UTC(2023, 9, 18, 15, 30))

			expect(snapped.toISOString()).toBe(expectedStart.toISOString())
			expect(snapped.getUTCMinutes()).toBe(30)
			expect(snapped.getUTCSeconds()).toBe(0)
			expect(snapped.getUTCMilliseconds()).toBe(0)
		})

		it('should snap the date to the start of the week', () => {
			const date = new Date('2023-10-18T15:30:45Z')
			const snapped = Dates.snapDate(date, { snap: SnapType.Week })

			const expectedStart = new Date(Date.UTC(2023, 9, 15))

			expect(snapped.toISOString()).toBe(expectedStart.toISOString())
			expect(snapped.getUTCHours()).toBe(0)
			expect(snapped.getUTCMinutes()).toBe(0)
			expect(snapped.getUTCSeconds()).toBe(0)
			expect(snapped.getUTCMilliseconds()).toBe(0)
		})
	})
})
