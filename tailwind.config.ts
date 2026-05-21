import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#1f2933",
        leaf: "#1f8a4c",
        mint: "#e7f7ef",
        paper: "#fbfaf6",
      },
      boxShadow: {
        soft: "0 18px 45px rgba(31, 41, 51, 0.08)",
      },
    },
  },
  plugins: [],
};

export default config;
