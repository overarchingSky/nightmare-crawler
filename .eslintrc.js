module.exports = {
  root: false,
  env: {
    node: false
  },
  // extends: [
  //   'plugin:vue/essential',
  //   '@vue/standard'
  // ],
  parserOptions: {
    parser: 'babel-eslint'
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off'
  }
}
