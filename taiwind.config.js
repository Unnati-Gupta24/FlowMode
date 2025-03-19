module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./index.html"],
  theme: {
    extend: {
      colors: {
        "cyber-darkest": "#0a0a0a",
        "cyber-dark": "#1a1a1a",
        "cyber-darker": "#2a2a2a",
        "cyber-blue": "#00ff9f",
        "cyber-pink": "#ff00ff",
        "cyber-purple": "#9f00ff",
      },
      boxShadow: {
        "neon-blue":
          "0 0 5px theme(colors.cyber-blue), 0 0 20px theme(colors.cyber-blue)",
        "neon-pink":
          "0 0 5px theme(colors.cyber-pink), 0 0 20px theme(colors.cyber-pink)",
      },
      animation: {
        glow: "glow 2s ease-in-out infinite alternate",
        scanline: "scanline 6s linear infinite",
      },
      keyframes: {
        glow: {
          "0%": { opacity: 0.8 },
          "100%": { opacity: 1 },
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
