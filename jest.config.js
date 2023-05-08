module.exports = {
  setupFilesAfterEnv: ['@shopify/react-testing/matchers'],
  testMatch: ['<rootDir>/src/**/*.test.{js,jsx,ts,tsx}'],
  moduleNameMapper: {
    '^.+\\.scss$': 'babel-jest',
  },
};
