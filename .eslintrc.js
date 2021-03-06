module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: ['@vue/standard', 'plugin:vue/essential'],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'space-before-function-paren': 'off',
    'comma-dangle': 'off'
  },
  parserOptions: {
    parser: 'babel-eslint'
  },
  globals: {
    workbox: 'readonly'
  }
}
