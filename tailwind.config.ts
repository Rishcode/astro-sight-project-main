import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
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
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        // NASA Space Theme Extensions
        asteroid: {
          safe: "hsl(var(--asteroid-safe))",
          hazardous: "hsl(var(--asteroid-hazardous))",
        },
        earth: {
          glow: "hsl(var(--earth-glow))",
        },
        atmosphere: {
          inner: "hsl(var(--atmosphere-inner))",
          outer: "hsl(var(--atmosphere-outer))",
        },
        glass: {
          bg: "hsla(var(--glass-bg) / 0.8)",
          border: "hsla(var(--glass-border) / 0.3)",
          shadow: "hsla(var(--glass-shadow) / 0.3)",
        },
        space: {
          "gradient-start": "hsl(var(--space-gradient-start))",
          "gradient-end": "hsl(var(--space-gradient-end))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "pulse-danger": {
          "0%, 100%": { boxShadow: "0 0 0 0 hsla(var(--destructive) / 0.7)" },
          "70%": { boxShadow: "0 0 0 10px hsla(var(--destructive) / 0)" },
        },
        "orbital-rotation": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        "earth-rotation": {
          "0%": { transform: "rotateY(0deg)" },
          "100%": { transform: "rotateY(360deg)" },
        },
        "asteroid-wobble": {
          "0%, 100%": { transform: "rotateY(0deg) rotateX(0deg)" },
          "25%": { transform: "rotateY(5deg) rotateX(2deg)" },
          "50%": { transform: "rotateY(0deg) rotateX(-2deg)" },
          "75%": { transform: "rotateY(-5deg) rotateX(2deg)" },
        },
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.9)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "pulse-danger": "pulse-danger 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "orbital-rotation": "orbital-rotation 60s linear infinite",
        "earth-rotation": "earth-rotation 30s linear infinite",
        "asteroid-wobble": "asteroid-wobble 4s ease-in-out infinite",
        "fade-in-up": "fade-in-up 0.6s ease-out",
        "scale-in": "scale-in 0.4s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
