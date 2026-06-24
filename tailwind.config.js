/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#f4f6f8',
        surface: '#ffffff',
        primary: {
          blue: '#1687ff',
        },
        barber: {
          red: '#ef4444',
          navy: '#111827',
        },
        accent: {
          gold: '#d4a84f',
        },
        success: '#10b981',
        warning: '#f59e0b',
        danger: '#ef4444',
        border: '#e5e7eb',
      },
      borderRadius: {
        'lg': '18px',
        'xl': '24px',
        '2xl': '32px',
      },
    },
  },
  plugins: [],
}
