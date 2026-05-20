/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        void: "#050505",
        ink: "#0c0c0c",
        graphite: "#141414",
        mist: "#a3a3a3",
        bone: "#e8e6e3",
        accent: "#c9a962",
      },
      fontFamily: {
        display: ["\"Cormorant Garamond\"", "serif"],
        sans: ["\"DM Sans\"", "system-ui", "sans-serif"],
      },
      animation: {
        grain: "grain 8s steps(10) infinite",
        marquee: "marquee 28s linear infinite",
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
      },
    },
  },
  plugins: [],
};
