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
          gold: '#C9A94E',
          white: '#FAFAFA',
          gray: '#F5F5F5',
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
