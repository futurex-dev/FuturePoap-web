/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "black-opaque": "rgba(0, 0, 0, 0.67)",
        "futureX-color": "rgba(13, 2, 39, 1)"
      },
    },
  },
  plugins: [],
};
