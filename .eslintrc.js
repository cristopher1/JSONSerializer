module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: ['eslint:recommended', 'standard', 'prettier'],
  overrides: [
    {
      files: ['.eslintrc.{js,cjs}'],
      parserOptions: {
        sourceType: 'script',
      },
    },
    {
      files: ['src/**/*.js'],
      extends: ['plugin:jsdoc/recommended'],
      plugins: ['jsdoc'],
      rules: {
        'jsdoc/tag-lines': 0,
      },
    },
    {
      files: ['__tests__/**/*.js'],
      extends: ['plugin:jest/recommended'],
      plugins: ['jest'],
    },
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
}
