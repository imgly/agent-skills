module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    project: './tsconfig.json'
  },
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  plugins: ['@typescript-eslint'],
  rules: {
    '@typescript-eslint/no-deprecated': 'error',
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
