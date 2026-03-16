/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Space Grotesk', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        bg: {
          primary: '#0A0F1E',
          secondary: '#111827',
        },
        accent: {
          blue: '#00C2FF',
          cyan: '#00FFD1',
        },
        text: {
          primary: '#F0F4F8',
        }
      },
    },
  },
  plugins: [],
}
