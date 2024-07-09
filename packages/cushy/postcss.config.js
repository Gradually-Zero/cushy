const path = require('path');

/** @type {import('postcss').Postcss} */
module.exports = {
  plugins: {
    autoprefixer: {},
    tailwindcss: { config: path.join(__dirname, 'tailwind.config.js') },
    'tailwindcss/nesting': {},
    'postcss-import': {},
    'postcss-lightningcss': {
      browsers: '>= .25%',
    },
  },
};
