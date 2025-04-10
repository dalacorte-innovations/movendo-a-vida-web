/** @type {import('tailwindcss').Config} */
const { fontFamily } = require("tailwindcss/defaultTheme")

module.exports = {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
    "app/**/*.{ts,tsx}",
    "components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        metropolis: ["Metropolis", "sans-serif"],
        sans: ["var(--font-sans)", ...fontFamily.sans],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        primaryGray: "#141414",
        secontGray: "#3F3D3C",
        thirdGray: "#555555",
        forthyGray: "#9F9F9F",
        primaryBlack: "#0D0D0D",
        primaryWhite: "#FFFFFF",
        primaryPink: "#BB02BB",
        primaryPurple: "#260926",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      spacing: {
        "69p": "69%",
      },
    },
  },
  plugins: [
    ({ addBase }) => {
      // Add global styles to affect all scrollbars in the application
      addBase({
        "*::-webkit-scrollbar": {
          width: "12px",
          height: "8px",
        },
        "*::-webkit-scrollbar-track": {
          background: "rgba(38, 9, 38, 0.1)",
          borderRadius: "10px",
        },
        "*::-webkit-scrollbar-thumb": {
          background: "rgba(187, 2, 187, 0.4)",
          borderRadius: "10px",
          border: "3px solid transparent",
          backgroundClip: "padding-box",
        },
        "*::-webkit-scrollbar-thumb:hover": {
          background: "rgba(187, 2, 187, 0.6)",
          border: "3px solid transparent",
          backgroundClip: "padding-box",
        },
        "*::-webkit-scrollbar-thumb:horizontal": {
          borderRadius: "20px",
          border: "2px solid transparent",
          backgroundClip: "padding-box",
        },
        "*": {
          scrollbarWidth: "thin",
          scrollbarColor: "rgba(187, 2, 187, 0.4) rgba(38, 9, 38, 0.1)",
        },
      })
    },
    require("tailwindcss-animate"),
    require("tailwind-scrollbar")({ nocompatible: true }),
  ],
  corePlugins: {
    appearance: false,
  },
  safelist: [
    {
      pattern: /no-arrows/,
    },
  ],
  variants: {
    extend: {
      scrollbar: ["rounded"],
      appearance: ["hover", "focus"],
    },
  },
}
