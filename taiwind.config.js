module.exports = {
  theme: {
    extend: {
      textShadow: {
        cyber: "0 0 8px rgba(255, 42, 109, 0.6)",
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        ".text-shadow-cyber": {
          textShadow: "0 0 8px rgba(255, 42, 109, 0.6)",
        },
      });
    },
  ],
};
