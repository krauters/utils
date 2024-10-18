/* eslint-disable @typescript-eslint/no-unnecessary-type-parameters */

import { debuggable } from '@krauters/debuggable'
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'fs'

import {
	FileEncoding,
	MakeDirectoryOptionsExtended,
	ReadDirectoryOptions,
	ReadJsonFileOptions,
	WriteJsonFileOptions,
} from './structures'

@debuggable()
export class Files {
	/**
	 * Creates a directory if it does not already exist, with optional parameters to override default settings.
	 *
	 * @param directoryPath The path of the directory.
	 * @param options Optional options to pass to `mkdirSync`.
	 * @returns A message indicating whether the directory was created or already existed.
	 */
	static makeDirectory(directoryPath: string, options: MakeDirectoryOptionsExtended = {}): string {
		const { suppressLogs = false, ...fsOptions } = options
		if (!existsSync(directoryPath)) {
			mkdirSync(directoryPath, { recursive: true, ...fsOptions })
			if (!suppressLogs) {
				console.debug(`Directory created at [${directoryPath}]`)
			}

			return `created [${directoryPath}]`
		} else {
			if (!suppressLogs) {
				console.debug(`Directory found at [${directoryPath}]`)
			}

			return `found [${directoryPath}]`
		}
	}

	/**
	 * Reads the contents of a directory.
	 *
	 * @param directoryPath The path of the directory.
	 * @param options Optional options to pass to `readdirSync`.
	 * @returns An array of names of the files in the directory.
	 */
	static readDirectory(
		directoryPath: string,
		options: ReadDirectoryOptions = { encoding: FileEncoding.UTF8 },
	): string[] {
		return readdirSync(directoryPath, options)
	}

	/**
	 * Reads a JSON file and parses its content.
	 *
	 * @param filePath The path to the JSON file.
	 * @param options Optional options to pass to `readFileSync`.
	 * @returns The parsed content of the JSON file.
	 */
	static readJsonFile<T>(filePath: string, options: ReadJsonFileOptions = { encoding: FileEncoding.UTF8 }): T {
		const content = readFileSync(filePath, options)

		return JSON.parse(content) as T
	}

	/**
	 * Writes data to a JSON file.
	 *
	 * @param filePath The path to the JSON file.
	 * @param data The data to write to the file.
	 * @param options Optional options to pass to `writeFileSync`.
	 * @returns A message indicating that the file was written.
	 */
	static writeJsonFile<T>(
		filePath: string,
		data: T,
		options: WriteJsonFileOptions = { encoding: FileEncoding.UTF8 },
	): string {
		const content = JSON.stringify(data, null, 2)
		writeFileSync(filePath, content, options)
		console.debug(`Data written to [${filePath}]`)

		return `written [${filePath}]`
	}
}

export const { makeDirectory, readDirectory, readJsonFile, writeJsonFile } = Files
