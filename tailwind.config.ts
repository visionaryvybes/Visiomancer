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
       // Add custom theme extensions if HeroScene relies on them
    },
  },
  plugins: [
    require('@tailwindcss/aspect-ratio'),
  ],
};
export default config; 