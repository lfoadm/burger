/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./**/*.{html,js}"],
  theme: {
    fontFamily: {
      'sans': ['Quicksand', 'sans-serif'],
      },
    extend: {
      backgroundImage: {
        "home": "url('/assets/img/bg.jpg')"
      }
    },
  },
  plugins: [],
}

