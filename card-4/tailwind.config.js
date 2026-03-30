/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    // Removida a linha "./**/*.{js,ts,jsx,tsx}" que causava o loop no node_modules
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};