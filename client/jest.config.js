export default {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
  testPathIgnorePatterns: ['/node_modules/'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': '<rootDir>/src/test/styleMock.cjs',
    '\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/src/test/fileMock.cjs',
  },
};