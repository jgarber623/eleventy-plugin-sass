const ava = require('@jgarber/eslint-config/ava');
const config = require('@jgarber/eslint-config');

module.exports = [
  {
    ignores: ['coverage']
  },
  ...config,
  ...ava
];
