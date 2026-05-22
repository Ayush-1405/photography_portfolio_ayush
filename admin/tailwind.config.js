/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        void: "#030303",
        ink: "#080808",
        graphite: "#121212",
        mist: "#888888",
        bone: "#F5F5F3",
        accent: "#D4B26F",
      },
      fontFamily: {
        sans: ["\"Inter\"", "system-ui", "sans-serif"],
        display: ["\"Cormorant Garamond\"", "serif"],
        mono: ["\"JetBrains Mono\"", "monospace"],
      },
      fontSize: {
        'xs-mono': ['14px', { letterSpacing: '0.4em' }],
        'sm-mono': ['16px', { letterSpacing: '0.4em' }],
        'base-mono': ['18px', { letterSpacing: '0.4em' }],
      },
    },
  },
  plugins: [],
};
