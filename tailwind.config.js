/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#009900',
          dark: '#006600',
          darker: '#004d00',
          light: '#00b300',
        },
      },
    },
  },
  plugins: [],
};
