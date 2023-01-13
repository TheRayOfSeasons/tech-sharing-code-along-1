/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './*.{html,njk,js}',
    './**.{html,njk,js}',
    './src/**/*.{html,njk,js}',
    './src/**/**/*.{html,njk,js}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
