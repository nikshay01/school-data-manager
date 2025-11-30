/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'irish-grover': ['Irish Grover', 'system-ui'],
        'caveat-brush': ['Caveat Brush', 'cursive'],
      },
    },
  },
  plugins: [],
}

