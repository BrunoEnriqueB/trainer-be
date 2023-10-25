/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  clearMocks: true,
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/singleton.ts'],
  collectCoverageFrom: ['src/**/*.ts', 'src/**/*.d.ts'],
  watchPlugins: ['jest-watch-typeahead/filename'],
  watchPathIgnorePatterns: ['/node_modules/', '/dist/'],
  testMatch: ['**/__tests__/**/*.test.ts'],
  roots: ['<rootDir>', '<rootDir>/__tests__'],
  detectOpenHandles: true,
  moduleNameMapper: {
    '@/(.*)$': '<rootDir>/src/$1'
  }
};
