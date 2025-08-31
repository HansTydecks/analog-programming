/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
        game: {
          green: '#22c55e',
          red: '#ef4444',
          blue: '#3b82f6',
          yellow: '#eab308',
        }
      },
      animation: {
        'spin-wheel': 'spin 3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        'pulse-timer': 'pulse 1s infinite',
      }
    },
  },
  plugins: [],
}
