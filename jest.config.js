module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFiles: [
    "<rootDir>setup-tests.ts"
  ],
  globals: {
    'ts-jest': {
      compiler: 'ttypescript'
    }
  }
};
