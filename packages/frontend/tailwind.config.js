module.exports = {
  content: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      keyframes: {
        custom_bounce: {
          '0%': { transform: "translateY(-4%)"},
          '50%': { transform: "translateY(0%)"},
          '100%': { transform: "translateY(-4%)"},
        }
      },
      animation: {
        "custom-bounce" : "custom_bounce 2s linear infinite alternate"
      }
    },
  },
  plugins: [],
};
