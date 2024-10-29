/* eslint-disable max-classes-per-file */

import { debuggable } from '@krauters/debuggable'
import { log } from '@krauters/logger'
import { arch, userInfo, UserInfo } from 'os'

@debuggable(log)
export class CustomError extends Error {
	public architecture: string
	public currentWorkingDirectory: string
	public nodeProcessUptime: string
	public nodeVersion: string
	public platform: string
	public processId: number
	public userInfo: UserInfo<string>

	/**
	 * A custom error class that extends the native JavaScript `Error` object.
	 *
	 * This class is designed to be the base class for many other custom error types.
	 * It captures additional system information such as architecture, platform, and user info,
	 * which can be helpful for debugging purposes.
	 *
	 * @param message The error message.
	 * @param details Optional details to include in the error log.
	 */
	constructor(message: string, details?: Record<string, unknown>) {
		super(message)
		this.architecture = arch()
		this.currentWorkingDirectory = process.cwd()
		this.name = this.constructor.name
		this.nodeProcessUptime = `${process.uptime()} seconds`
		this.nodeVersion = process.version
		this.platform = process.platform
		this.processId = process.pid
		this.userInfo = userInfo()

		log.error(message, { ...details, errorType: this.name })
	}

	/**
	 * Returns the error details in JSON format.
	 *
	 * @returns The error details as a JSON string.
	 */
	toJson(): string {
		return JSON.stringify(this.toObject())
	}

	/**
	 * Returns the error details as an object.
	 *
	 * @returns An object containing error properties.
	 */
	toObject(): Record<string, unknown> {
		return {
			architecture: this.architecture,
			currentWorkingDirectory: this.currentWorkingDirectory,
			message: this.message,
			name: this.name,
			nodeProcessUptime: this.nodeProcessUptime,
			nodeVersion: this.nodeVersion,
			platform: this.platform,
			processId: this.processId,
			userInfo: this.userInfo,
		}
	}
}

export class AuthenticationError extends CustomError {}
export class AuthorizationError extends CustomError {}
export class BadRequestError extends CustomError {}
export class ConfigurationError extends CustomError {}
export class ConflictError extends CustomError {}
export class DatabaseError extends CustomError {}
export class DataIntegrityError extends CustomError {}
export class DependencyError extends CustomError {}
export class ForbiddenError extends CustomError {}
export class GatewayTimeoutError extends CustomError {}
export class HttpError extends CustomError {}
export class InternalServerError extends CustomError {}
export class InvalidInputError extends CustomError {}
export class MethodNotAllowedError extends CustomError {}
export class NetworkError extends CustomError {}
export class NotFoundError extends CustomError {}
export class NotImplementedError extends CustomError {}
export class PaymentRequiredError extends CustomError {}
export class RateLimitExceededError extends CustomError {}
export class ResourceUnavailableError extends CustomError {}
export class ServiceUnavailableError extends CustomError {}
export class SplunkApiError extends CustomError {}
export class TimeoutError extends CustomError {}
export class TooManyRequestsError extends CustomError {}
export class UnprocessableEntityError extends CustomError {}
export class UnsupportedMediaTypeError extends CustomError {}
export class ValidationError extends CustomError {}
