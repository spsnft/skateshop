import { fontFamily } from "tailwindcss/defaultTheme"
import { type Config } from "tailwindcss/types/config"

export default {
  darkMode: ["class"],
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@tremor/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    transparent: "transparent",
    current: "currentColor",
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      screens: {
        xs: "480px",
        xxs: "380px",
      },
      colors: {
        // Твоя фирменная палитра
        brand: {
          buds: "#193D2E",
          silver: "#C1C1C1",
          gold: "#FEC107",
          premium: "#193D2E",
          selected: "#5CE1E6",
        },
        hash: {
          oldschool: "#402917",
          frozen: "#3F999C",
          rosin: "#693A7B",
        },
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
        /* tremor */
        tremor: {
          brand: { faint: "#eff6ff", muted: "#bfdbfe", subtle: "#60a5fa", DEFAULT: "#3b82f6", emphasis: "#1d4ed8", inverted: "#ffffff" },
          background: { muted: "#f9fafb", subtle: "#f3f4f6", DEFAULT: "#ffffff", emphasis: "#374151" },
          border: { DEFAULT: "#e5e7eb" },
          ring: { DEFAULT: "#e5e7eb" },
          content: { subtle: "#9ca3af", DEFAULT: "#6b7280", emphasis: "#374151", strong: "#111827", inverted: "#ffffff" },
        },
        "dark-tremor": {
          brand: { faint: "#0B1229", muted: "#172554", subtle: "#1e40af", DEFAULT: "#3b82f6", emphasis: "#60a5fa", inverted: "#030712" },
          background: { muted: "#131A2B", subtle: "#1f2937", DEFAULT: "#111827", emphasis: "#d1d5db" },
          border: { DEFAULT: "#1f2937" },
          ring: { DEFAULT: "#1f2937" },
          content: { subtle: "#4b5563", DEFAULT: "#6b7280", emphasis: "#e5e7eb", strong: "#f9fafb", inverted: "#000000" },
        },
      },
      borderRadius: {
        lg: `var(--radius)`,
        md: `calc(var(--radius) - 2px)`,
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        // Твои эффекты свечения
        'gold-glow': '0 0 20px rgba(254, 193, 7, 0.35)',
        'emerald-glow': '0 0 20px rgba(25, 61, 46, 0.5)',
        'selected-glow': '0 0 15px rgba(92, 225, 230, 0.4)',
        // tremor
        "tremor-input": "0 1px 2px 0 rgb(0 0 0 / 0.05)",
        "tremor-card": "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
        "tremor-dropdown": "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
        "dark-tremor-input": "0 1px 2px 0 rgb(0 0 0 / 0.05)",
        "dark-tremor-card": "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
        "dark-tremor-dropdown": "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
      },
      backgroundImage: {
        'gold-metallic': "linear-gradient(to bottom right, #BF953F, #FCF6BA, #B38728, #FBF5B7, #AA771B)",
        'premium-gradient': "linear-gradient(135deg, #193D2E 0%, #000000 100%)",
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", ...fontFamily.sans],
        mono: ["var(--font-geist-mono)", ...fontFamily.mono],
        heading: ["var(--font-heading)", ...fontFamily.sans],
      },
      keyframes: {
        "accordion-down": { from: { height: "0" }, to: { height: "var(--radix-accordion-content-height)" } },
        "accordion-up": { from: { height: "var(--radix-accordion-content-height)" }, to: { height: "0" } },
        wiggle: {
          "0%, 100%": { transform: "translateX(0%)", transformOrigin: "50% 50%" },
          "15%": { transform: "translateX(-6px) rotate(-6deg)" },
          "30%": { transform: "translateX(9px) rotate(6deg)" },
          "45%": { transform: "translateX(-9px) rotate(-3.6deg)" },
          "60%": { transform: "translateX(3px) rotate(2.4deg)" },
          "75%": { transform: "translateX(-2px) rotate(-1.2deg)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        wiggle: "wiggle 0.8s both",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
} satisfies Config