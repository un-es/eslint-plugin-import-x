/**
 * @type {import('eslint').Linter.Config}
 */
module.exports = {
  root: true,
  reportUnusedDisableDirectives: true,
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:eslint-plugin/recommended',
    'plugin:import-x/recommended',
    'plugin:n/recommended',
    'plugin:unicorn/recommended',
    'plugin:prettier/recommended',
  ],
  env: {
    node: true,
    es6: true,
    es2017: true,
  },
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2020,
  },
  rules: {
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/no-require-imports': 'off',

    'eslint-plugin/consistent-output': ['error', 'always'],
    'eslint-plugin/meta-property-ordering': 'error',
    'eslint-plugin/no-deprecated-context-methods': 'error',
    'eslint-plugin/no-deprecated-report-api': 'off',
    'eslint-plugin/prefer-replace-text': 'error',
    'eslint-plugin/report-message-format': 'error',
    'eslint-plugin/require-meta-docs-description': [
      'error',
      { pattern: String.raw`^(Enforce|Ensure|Prefer|Forbid).+\.$` },
    ],
    'eslint-plugin/require-meta-schema': 'error',
    'eslint-plugin/require-meta-type': 'error',
    'n/no-extraneous-require': 'off',
    'n/no-missing-import': 'off',
    'n/no-missing-require': 'off',
    'n/no-unsupported-features/es-syntax': 'off',
    'unicorn/expiring-todo-comments': 'off',
    'unicorn/no-array-callback-reference': 'off',
    'unicorn/no-array-reduce': 'off',
    'unicorn/no-null': 'off',
    'unicorn/prefer-module': 'off',
    'unicorn/prevent-abbreviations': 'off',
    'unicorn/prefer-at': 'off',

    // dog fooding
    'import-x/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: ['test/**'],
        optionalDependencies: false,
        peerDependencies: true,
        bundledDependencies: false,
      },
    ],
    'import-x/unambiguous': 'off',
  },

  overrides: [
    {
      files: ['*.ts'],
      excludedFiles: ['test/fixtures'],
      rules: {
        '@typescript-eslint/array-type': [
          2,
          {
            default: 'array-simple',
          },
        ],
        '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
        '@typescript-eslint/consistent-type-imports': [
          'error',
          {
            fixStyle: 'inline-type-imports',
          },
        ],
        '@typescript-eslint/no-unused-vars': [
          'error',
          {
            argsIgnorePattern: '^_',
            varsIgnorePattern: '^_',
          },
        ],
        'import-x/consistent-type-specifier-style': 'error',
        'import-x/order': [
          'error',
          {
            alphabetize: {
              order: 'asc',
            },
            'newlines-between': 'always',
          },
        ],
      },
      settings: {
        'import-x/resolver': {
          typescript: {
            project: 'tsconfig.base.json',
          },
        },
      },
    },
    {
      files: 'test/**',
      env: {
        jest: true,
      },
    },
    {
      files: 'global.d.ts',
      rules: {
        'import-x/no-extraneous-dependencies': 0,
      },
    },
  ],
}
