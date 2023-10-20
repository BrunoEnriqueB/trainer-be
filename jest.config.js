/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  clearMocks: true,
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/singleton.ts'],
  collectCoverageFrom: ['src/**/*.ts'],
  watchPlugins: ['jest-watch-typeahead/filename'],
  watchPathIgnorePatterns: ['/node_modules/', '/dist/'],
  testMatch: ['**/__tests__/**/*.test.ts'],
  roots: ['<rootDir>/__tests__'],
  forceExit: true
};
