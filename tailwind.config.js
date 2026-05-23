/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          teal: '#0BBCB7',
          'teal-dark': '#099E9A',
          'teal-light': '#E8F8F7',
          dark: '#1A1A2E',
          'dark-soft': '#252544',
          gold: '#C9A94E',
          'gold-light': '#E0C77C',
          'gold-dark': '#9C8235',
          white: '#FAFAFA',
          gray: '#F5F5F5',
        },
        br: {
          green: '#009C3B',
          'green-dark': '#00702A',
          'green-deep': '#003D17',
          yellow: '#FFDF00',
          'yellow-soft': '#FFE94D',
          blue: '#002776',
          'blue-light': '#1B3D8C',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
        display: ['var(--font-playfair)', 'serif'],
      },
    },
  },
  plugins: [],
}
