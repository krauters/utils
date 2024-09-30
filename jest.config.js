module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testMatch: ['**/test/**/*.test.{ts,tsx}'],
    collectCoverage: true,
    coverageDirectory: 'coverage',
    coverageThreshold: {
      global: {
        lines: 60,
        statements: 60,
        functions: 60,
        branches: 60,
      },
    },
  }
  