/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // custom barva za gumbe
        customYellow: '#F4FF47'
      },
      boxShadow: {
        // custom shadow gradient za grid Card-ov
        gradient: '0 8px 12px -4px rgba(0, 0, 0, 0.1), 0 4px 8px 2px rgba(0, 0, 0, 0.2)',
      },
    },
  },
  plugins: [],
}

