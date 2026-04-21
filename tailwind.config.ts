import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "media",
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"], // Textos normais (body, labels, inputs)
        heading: ["Space Grotesk", "sans-serif"], // Títulos (h1, h2, botões principais)
      },
      colors: {
        brand: {
          cyan: {
            50: "#E6F9FF",
            100: "#CCF3FF",
            200: "#99E8FF",
            300: "#66DCFF",
            400: "#33D1FF",
            500: "#00AEEB",
            600: "#0096D1",
            700: "#007AB7",
            800: "#005E9D",
            900: "#004283",
          },
          orange: {
            50: "#FFF4E6",
            100: "#FFE6CC",
            200: "#FFD199",
            300: "#FFBC66",
            400: "#FFAA33",
            500: "#F6A300",
            600: "#DD9200",
            700: "#C48200",
            800: "#AB7200",
            900: "#926200",
          },
          neutral: {
            50: "#F8FAFC",
            100: "#F1F5F9",
            200: "#E2E8F0",
            300: "#CBD5E1",
            400: "#94A3B8",
            500: "#64748B",
            600: "#475569",
            700: "#334155",
            800: "#1F2937",
            900: "#0B0F14",
          },
          success: { 50: "#EAF7EE", 500: "#22C55E", 700: "#15803D" },
          danger: { 50: "#FEECEC", 500: "#EF4444", 700: "#B91C1C" },
          warning: { 50: "#FFF7E6", 500: "#F59E0B", 700: "#B45309" },
        },
      },
    },
  },
} satisfies Config;
