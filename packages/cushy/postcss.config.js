const path = require('path');

/** @type {import('postcss').Postcss} */
module.exports = {
  plugins: {
    // 顺序会对样式有影响
    autoprefixer: {},
    'postcss-import': {},
    'postcss-lightningcss': {
      browsers: '>= .25%',
    },
    tailwindcss: { config: path.join(__dirname, 'tailwind.config.js') },
    'tailwindcss/nesting': {},
  },
};

// 修复后的最初的顺序
// 'postcss-import': {},
// 'tailwindcss/nesting': {},
// tailwindcss: { config: path.join(__dirname, 'tailwind.config.js') },
// autoprefixer: {},
// 'postcss-lightningcss': {
//   browsers: '>= .25%',
// },
