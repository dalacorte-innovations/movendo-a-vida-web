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
        forthyGray: '#9F9F9F',
        primaryBlack: '#0D0D0D',
        primaryWhite: '#FFFFFF',
        primaryPink: '#BB02BB',
        primaryPurple: '#260926'
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
        '.scrollbar-thin': {
          'scrollbar-width': 'thin',
        },
        '.scrollbar-thumb-rounded': {
          'scrollbar-color': '#888 #f1f1f1',
        },
        '.scrollbar-thumb-rounded::-webkit-scrollbar': {
          width: '8px',
        },
        '.scrollbar-thumb-rounded::-webkit-scrollbar-track': {
          background: '#f1f1f1',
          'border-radius': '10px',
        },
        '.scrollbar-thumb-rounded::-webkit-scrollbar-thumb': {
          background: '#888',
          'border-radius': '10px',
        },
        '.scrollbar-thumb-rounded::-webkit-scrollbar-thumb:hover': {
          background: '#555',
        },
      });
    },
  ],

}
