/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        outfit: ['Outfit', 'sans-serif'],
      },
      colors: {
        brand: {
          purple: '#6225E3',
          pink: '#FF3FE0',
          yellow: '#FFD600',
          lime: '#00FF85',
        },
      },
    },
  },
  plugins: [],
};