/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
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

