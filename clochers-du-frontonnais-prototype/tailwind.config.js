/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#19565E",
        primarySoft: "#1F6E76",
        ink: "#2C3E3F",
        paper: "#F8F7F3",
        sun: "#F9B233",
        halo: "#FFE7B8",
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem"
      }
    },
  },
  plugins: [],
}
