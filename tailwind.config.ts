import type { Config } from "tailwindcss"
import aspectRatio from '@tailwindcss/aspect-ratio'

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: "#ffffff",
          dark: "#1a1a1a",
        },
        foreground: {
          DEFAULT: "#000000",
          dark: "#ffffff",
        },
        primary: {
          DEFAULT: "#3b82f6",
          dark: "#60a5fa",
          foreground: "#ffffff",
        },
        secondary: {
          DEFAULT: "#6b7280",
          dark: "#9ca3af",
          foreground: "#ffffff",
        },
        accent: {
          DEFAULT: "#f59e0b",
          dark: "#fbbf24",
          foreground: "#ffffff",
        },
        border: {
          DEFAULT: "#e5e7eb",
          dark: "#374151",
        },
        muted: {
          DEFAULT: "#f3f4f6",
          dark: "#374151",
          foreground: "#6b7280",
        },
        destructive: {
          DEFAULT: "#ef4444",
          dark: "#f87171",
          foreground: "#ffffff",
        },
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        card: {
          DEFAULT: "#ffffff",
          dark: "#1a1a1a",
          foreground: "#000000",
          "foreground-dark": "#ffffff",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        card: "0 2px 4px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.1)",
        "card-hover": "0 4px 6px rgba(0, 0, 0, 0.05), 0 2px 4px rgba(0, 0, 0, 0.1)",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.5s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
    },
  },
  plugins: [aspectRatio],
}

export default config 