/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#f0f4f8',
          100: '#d9e2ec',
          600: '#243f5e',
          700: '#1a3a5c',
          800: '#122a45',
          900: '#0a1c30',
        },
        brand: {
          green: '#0ea96b',
          'green-dark': '#0a8a57',
          'green-light': '#e6f7f0',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'hero-pattern': "linear-gradient(135deg, rgba(26,58,92,0.92) 0%, rgba(10,138,87,0.85) 100%)",
      },
    },
  },
  plugins: [],
}
