import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        pixel: ['"Pixelify Sans"', "sans-serif"],
      },
      colors: {
        cyan: {
          400: "#22d3ee",
        },
      },
    },
  },
  plugins: [],
};

export default config;
