/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50:  '#f6f7ff',
          100: '#edefff',
          200: '#d7dbff',
          300: '#b9c1ff',
          400: '#8f98ff',
          500: '#6b6fff', // primary main
          600: '#585cf0',
          700: '#4342d1',
          800: '#3330a6',
          900: '#221d7a',
        },
        accent: {
          50:  '#eef9ff',
          100: '#dff5ff',
          200: '#bbecff',
          300: '#8fddff',
          400: '#57ccff',
          500: '#20b8ff',
          600: '#0796e6',
        }
      }
    }  
  }  
}  