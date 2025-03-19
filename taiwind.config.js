// tailwind.config.js or tailwind.config.cjs (depending on your project setup)

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "cyber-darkest": "#0a0a15",
        "cyber-darker": "#121225",
        "cyber-dark": "#1a1a35",
        "cyber-blue": "#4f9ecf",
        "cyber-pink": "#ff2a6d",
        "cyber-purple": "#7c4dff",
      },
      boxShadow: {
        "neon-blue":
          "0 0 5px theme(colors.cyber-blue), 0 0 20px theme(colors.cyber-blue)",
        "neon-pink":
          "0 0 5px theme(colors.cyber-pink), 0 0 20px theme(colors.cyber-pink)",
      },
      animation: {
        glow: "glow 1.5s ease-in-out infinite alternate",
        scanline: "scanline 6s linear infinite",
      },
      keyframes: {
        glow: {
          "0%": { textShadow: "0 0 5px #fff" },
          "100%": {
            textShadow:
              "0 0 10px #fff, 0 0 15px theme(colors.cyber-blue), 0 0 20px theme(colors.cyber-pink)",
          },
        },
        scanline: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100%)" },
        },
      },
    },
  },
  plugins: [],
};
