module.exports = {
  testEnvironment: 'node',
  testTimeout: 10000,
  collectCoverage: true,
  coverageReporters: ['json', 'html'],
  coveragePathIgnorePatterns: ['./src/config/*'],
  setupFilesAfterEnv: [
    './test/testdb.js',
    './test/jestSetUp.js'
  ],
};
