import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        toyota: {
          red: "#EB0A1E",
          black: "#030712",
          steel: "#9CA3AF",
          cyan: "#58F4FF",
          blue: "#0B1120"
        }
      },
      boxShadow: {
        hud: "0 0 40px rgba(88,244,255,.18), inset 0 0 24px rgba(88,244,255,.08)",
        redglow: "0 0 36px rgba(235,10,30,.26)"
      },
      backgroundImage: {
        "hud-grid": "linear-gradient(rgba(88,244,255,.06) 1px, transparent 1px), linear-gradient(90deg, rgba(88,244,255,.06) 1px, transparent 1px)"
      }
    }
  },
  plugins: [animate]
};

export default config;
