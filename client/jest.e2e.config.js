export default {
  testEnvironment: 'node',
  testMatch: ['**/tests/e2e/**/*.test.js'],
  testTimeout: 30000,
  verbose: true,
  transform: {
    '^.+\\.[t|j]sx?$': 'babel-jest'
  }
};
