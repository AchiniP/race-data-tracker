module.exports = {
  testEnvironment: 'node',
  testTimeout: 10000,
  collectCoverage: true,
  coverageReporters: ['json', 'html'],
  coveragePathIgnorePatterns: ['./src/config/*', './src/service/InitService.js'],
  setupFilesAfterEnv: [
    './test/testdb.js',
    './test/jestSetUp.js'
  ],
};
