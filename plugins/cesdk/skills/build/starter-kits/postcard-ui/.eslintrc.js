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
    ],
    'no-restricted-imports': [
      'error',
      {
        patterns: [
          {
            group: ['./imgly', './imgly/**', '../**/imgly', '../**/imgly/**'],
            message:
              'Import the imgly glue layer via the @/imgly/* alias, not a relative path.'
          },
          {
            // Matched gitignore-style, so exempting the shared demo-preview
            // helper means un-ignoring every directory on the way down to it.
            group: [
              '../../*',
              '!../../..',
              '../../../*',
              '!../../../..',
              '../../../../*',
              '!../../../../shared',
              '../../../../shared/*',
              '!../../../../shared/demo-preview'
            ],
            message:
              'Imports that leave the current feature/folder must use the @/app/* or @/imgly/* alias.'
          }
        ]
      }
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
