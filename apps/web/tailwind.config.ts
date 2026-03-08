import type { Config } from "tailwindcss";
import sharedConfig from "@repo/ui/tailwind.config";

const config: Pick<Config, "content" | "presets" | "theme"> = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  presets: [sharedConfig],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#F0F7FF",
          100: "#E0EFFF",
          200: "#B8DBFF",
          300: "#7ABFFF",
          400: "#4AADE5",
          500: "#2196D3",
          600: "#1A78B0",
          primary: "#4AADE5",
        },
        accent: {
          50: "#FFF8E1",
          100: "#FFECB3",
          200: "#FFD54F",
          300: "#F5A623",
          400: "#F09819",
          primary: "#F5A623",
        },
        surface: {
          50: "#FAFBFF",
          100: "#F0F4FF",
          200: "#EEF2FF",
          300: "#E8ECFF",
        },
      },
      borderRadius: {
        card: "16px",
        button: "24px",
      },
      boxShadow: {
        card: "0 2px 12px rgba(0, 0, 0, 0.06)",
        "card-hover": "0 4px 20px rgba(0, 0, 0, 0.1)",
        nav: "0 1px 8px rgba(0, 0, 0, 0.04)",
      },
    },
  },
};

export default config;
