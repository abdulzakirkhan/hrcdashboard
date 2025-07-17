// .eslintrc.js
module.exports = {
  root: true,
  parser: '@typescript-eslint/parser', // Parses TS properly
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: ['@typescript-eslint', 'react', 'react-hooks'],
  extends: [
    'next/core-web-vitals',              // Next.js + web vitals
    'plugin:@typescript-eslint/recommended', // TypeScript rules
    'plugin:react-hooks/recommended',    // React hooks best practices
    // 'plugin:prettier/recommended',       // Prettier integration
  ],
  rules: {
    // Add or override rules here
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    'react-hooks/exhaustive-deps': 'warn',
    // 'prettier/prettier': ['error'],
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
};
