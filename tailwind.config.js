/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0B1120',
        card: '#111827',
        cardBorder: '#1F2937',
        primary: '#0ea5e9',
        secondary: '#3b82f6',
        accent: '#22d3ee',
        critical: '#ef4444',
        warning: '#f59e0b',
        safe: '#10b981',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
