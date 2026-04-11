import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        machina: ["Neue Machina", "sans-serif"],
        norms: ["TT Norms", "sans-serif"],
      },
      colors: {
        "blue-accent": "#0b3bec",
        "bg-main": "#17181c",
        "bg-input": "#1a1b1c",
        "bg-card": "#191a1b",
        "text-muted": "#898a8b",
        "text-light": "#f5f5f6",
      },
    },
  },
  plugins: [],
};
export default config;
