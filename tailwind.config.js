/** @type {import('tailwindcss').Config} */
export default {
  important: '#odds-calculator-app',
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'fort': ['Fort', 'sans-serif'],
      },
    },
  },
  corePlugins: {
    preflight: false,
  }
}
