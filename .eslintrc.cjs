module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh'],
  rules: {
    /* eslint */
    'no-console': 'warn',
    'no-unused-vars': 'warn',
    'semi': ['warn', 'always'],
    /* react */
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    /* typescript */
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/ban-ts-comment": "warn",
  },
}
