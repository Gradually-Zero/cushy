/** @type {import('postcss').Postcss} */
module.exports = {
  plugins: {
    autoprefixer: {},
    tailwindcss: {},
    'tailwindcss/nesting': {},
    'postcss-import': {},
    'postcss-lightningcss': {
      browsers: '>= .25%',
    },
  },
};
