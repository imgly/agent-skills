module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    project: './tsconfig.json'
  },
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  plugins: ['@typescript-eslint', 'react-hooks'],
  rules: {
    '@typescript-eslint/no-deprecated': 'error',
    'react-hooks/rules-of-hooks': 'error',
    'no-console': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-unused-vars': [
      'error',
      { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }
    ]
  },
  env: {
    browser: true,
    es2020: true,
    node: true
  },
  overrides: [
    {
      // Playwright names its fixture callback `use`, which the rule reads as
      // React's `use` hook.
      files: ['tests/e2e/**'],
      rules: { 'react-hooks/rules-of-hooks': 'off' }
    }
  ],
  ignorePatterns: [
    'build/**',
    'dist/**',
    'coverage/**',
    'node_modules/**',
    'release/**',
    'playwright-report/**',
    'test-results/**',
    '*.min.js',
    '*.config.js',
    '*.config.ts',
    'scripts/**',
    '.eslintrc.js'
  ]
};
