export default {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  plugins: [require('@tailwindcss/typography')],
  theme: {
    extend: {
      colors: {
        primary: '#6366f1',
        accent: '#22c55e',
      },
    },
  },
};
