module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    project: './tsconfig.json',
    ecmaFeatures: {
      jsx: true
    }
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended'
  ],
  plugins: ['@typescript-eslint', 'deprecation', 'react', 'react-hooks'],
  settings: {
    react: {
      version: 'detect'
    }
  },
  rules: {
    // Warn on deprecated APIs (not error)
    'deprecation/deprecation': 'warn',
    // Allow console statements in examples
    'no-console': 'off',
    // Allow any type in examples
    '@typescript-eslint/no-explicit-any': 'off',
    // React 17+ JSX transform
    'react/react-in-jsx-scope': 'off'
  },
  env: {
    browser: true,
    es2020: true,
    node: true
  },
  ignorePatterns: [
    'dist/**',
    'coverage/**',
    'node_modules/**',
    'release/**',
    '*.config.js',
    '*.config.ts',
    'scripts/**',
    '.eslintrc.js'
  ]
};
