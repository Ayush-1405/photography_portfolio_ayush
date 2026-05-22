/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        void: "var(--void)",
        ink: "var(--ink)",
        graphite: "var(--graphite)",
        mist: "var(--mist)",
        bone: "var(--bone)",
        accent: "var(--accent)", // Use variable for accent as well
        gold: {
          light: "#E5D1A4",
          DEFAULT: "#D4B26F",
          dark: "#B89655",
        }
      },
      fontFamily: {
        display: ["\"Cormorant Garamond\"", "serif"],
        sans: ["\"Inter\"", "system-ui", "sans-serif"],
        mono: ["\"JetBrains Mono\"", "monospace"],
      },
      fontSize: {
        'xs-mono': ['14px', { letterSpacing: '0.4em' }],
        'sm-mono': ['16px', { letterSpacing: '0.4em' }],
        'base-mono': ['18px', { letterSpacing: '0.4em' }],
      },
      spacing: {
        'section-gap': '8rem', 
        'content-gap': '4rem',
      },
      animation: {
        grain: "grain 8s steps(10) infinite",
        marquee: "marquee 28s linear infinite",
        "liquid-drift": "liquid-drift 25s ease-in-out infinite alternate",
        "shutter-open": "shutter-open 1.2s cubic-bezier(0.85, 0, 0.15, 1) forwards",
        "text-reveal": "text-reveal 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards",
      },
      keyframes: {
        grain: {
          "0%, 100%": { transform: "translate(0, 0)" },
          "10%": { transform: "translate(-5%, -10%)" },
          "30%": { transform: "translate(3%, -15%)" },
          "50%": { transform: "translate(12%, 9%)" },
          "70%": { transform: "translate(9%, 4%)" },
          "90%": { transform: "translate(-1%, 7%)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-33.333%)" },
        },
        "liquid-drift": {
          "0%": { transform: "translate(0, 0) scale(1) rotate(0deg)" },
          "33%": { transform: "translate(5%, -10%) scale(1.15) rotate(120deg)" },
          "66%": { transform: "translate(-8%, 8%) scale(0.9) rotate(240deg)" },
          "100%": { transform: "translate(0, 0) scale(1) rotate(360deg)" },
        },
        "shutter-open": {
          "0%": { transform: "scaleY(1)" },
          "100%": { transform: "scaleY(0)" },
        },
        "text-reveal": {
          "0%": { transform: "translateY(100%)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};
