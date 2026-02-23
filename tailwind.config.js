/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./apps/*/src/**/*.{js,ts,jsx,tsx}",
    "./libs/*/src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        amber: {
          50: "#fffbeb",
          100: "#fef3c7",
          200: "#fde68a",
          300: "#fcd34d",
          400: "#fbbf24",
          500: "#f59e0b",
          600: "#d97706",
          700: "#b45309",
          800: "#92400e",
          900: "#78350f",
        },
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Oxygen",
          "Ubuntu",
          "Cantarell",
          "sans-serif",
        ],
      },
      fontSize: {
        xs: ["12px", "16px"],
        sm: ["14px", "20px"],
        base: ["16px", "24px"],
        lg: ["18px", "28px"],
        xl: ["20px", "28px"],
        "2xl": ["24px", "32px"],
        "3xl": ["30px", "36px"],
        "4xl": ["36px", "40px"],
      },
      spacing: {
        "safe-bottom": "max(1rem, env(safe-area-inset-bottom))",
        "safe-top": "max(1rem, env(safe-area-inset-top))",
      },
      minHeight: {
        "touch-target": "44px",
      },
      minWidth: {
        "touch-target": "44px",
      },
    },
  },
  plugins: [],
};
