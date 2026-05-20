/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      colors: {
        forest: {
          50: "#f5f7ef",
          100: "#e8edd8",
          300: "#aab978",
          500: "#667238",
          700: "#34421f",
          900: "#17230f",
        },
        cream: "#f8f4e9",
      },
      boxShadow: {
        soft: "0 24px 80px rgba(30, 41, 24, 0.12)",
      },
    },
  },
  plugins: [],
}
