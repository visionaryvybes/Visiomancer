import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        'heading': ['M PLUS 1 Code', 'monospace'],
        'base': ['Share Tech Mono', 'monospace'],
        'sans': ['Share Tech Mono', 'monospace'],
        'mono': ['Share Tech Mono', 'monospace'],
        'serif': ['Share Tech Mono', 'monospace'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/aspect-ratio'),
  ],
};
export default config; 