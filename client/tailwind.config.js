/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: "#E6CCFF",
      },
      backgroundImage: {
        "light-gradient": "linear-gradient(to bottom, #ffffff, #f2f2f2)",
        "dark-gradient": "linear-gradient(to bottom, rgba(36,33,36,0.18), rgba(0,0,0,0.18))",
      },
    },
  },
  plugins: [],
};