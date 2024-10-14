/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        metropolis: ['Metropolis', 'sans-serif'],
      },
      colors: {
        primaryGray: '#141414',
        secontGray: '#3F3D3C',
        thirdGray: '#555555',
        primaryBlack: '#0D0D0D',
      },
      spacing: {
        '69p': '69%',
      },
    },
  },
  plugins: [],
  corePlugins: {
    appearance: false,
  },
  safelist: [
    {
      pattern: /no-arrows/,
    },
  ],
  variants: {
    extend: {
      appearance: ['hover', 'focus'],
    },
  },
  plugins: [
    function({ addUtilities }) {
      addUtilities({
        '.no-arrows': {
          '-moz-appearance': 'textfield',
          '-webkit-appearance': 'none',
        },
        '.no-arrows::-webkit-outer-spin-button': {
          '-webkit-appearance': 'none',
          margin: '0',
        },
        '.no-arrows::-webkit-inner-spin-button': {
          '-webkit-appearance': 'none',
          margin: '0',
        },
      });
    },
  ],
}
