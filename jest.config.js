/* eslint-disable @typescript-eslint/naming-convention */

module.exports = {
	collectCoverage: true,
	coverageDirectory: 'coverage',
	coverageThreshold: {
		global: {
			branches: 60,
			functions: 60,
			lines: 60,
			statements: 60,
		},
	},
	preset: 'ts-jest',
	testEnvironment: 'node',
	testMatch: ['**/test/**/*.test.{ts,tsx}'],
	transform: {
		'^.+\\.tsx?$': ['ts-jest', { tsconfig: 'tsconfig.jest.json' }],
	},
}
