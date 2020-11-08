module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    sourceType: 'module',
    createDefaultProgram: true,
  },
  plugins: ['@typescript-eslint/eslint-plugin', 'import'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'prettier/@typescript-eslint',
    'plugin:prettier/recommended',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.json'],
    },
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
      },
      alias: {
        map: [
          ['@pbrx', './src/pbrx'],
          ['@pb-core', './src/core'],
          ['@pb-shared', './src/app/shared'],
          ['src', './src'],
        ],
        extensions: ['.ts', '.json'],
      },
    },
  },
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/typedef': [
      'error',
      {
        propertyDeclaration: true,
        variableDeclaration: true,
        parameter: true,
        memberVariableDeclaration: true,
        arrowParameter: false,
      },
    ],
    'import/order': [
      'error',
      {
        'newlines-between': 'always',
        pathGroups: [
          {
            pattern: '@nestjs/**',
            group: 'external',
            position: 'after',
          },
        ],
        groups: [['external'], ['parent', 'sibling', 'index']],
      },
    ],
  },
};
