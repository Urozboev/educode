import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
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
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        /**
         * Brend ranglari — "Syntax" palitrasi.
         * Nomlar eski `neon-*` bilan bir xil qoldirildi (66 faylda ishlatilgan),
         * lekin qiymatlar CSS o'zgaruvchilaridan olinadi va light/dark'da almashadi.
         */
        neon: {
          purple: "hsl(var(--brand-purple) / <alpha-value>)",
          blue: "hsl(var(--brand-blue) / <alpha-value>)",
          green: "hsl(var(--brand-green) / <alpha-value>)",
          yellow: "hsl(var(--brand-amber) / <alpha-value>)",
          red: "hsl(var(--brand-coral) / <alpha-value>)",
          pink: "hsl(var(--brand-orchid) / <alpha-value>)",
        },
        surface: {
          DEFAULT: "hsl(var(--surface))",
          hover: "hsl(var(--surface-hover))",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "Sora", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "Plus Jakarta Sans", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "JetBrains Mono", "ui-monospace", "monospace"],
      },
      /**
       * Tipografik shkala. Ilgari `.text-sm { !important }` hacklari bilan
       * kattalashtirilgan edi — endi shkala manbasining o'zi sozlandi.
       */
      fontSize: {
        xs: ["0.8rem", { lineHeight: "1.5" }],
        sm: ["0.9rem", { lineHeight: "1.55" }],
        base: ["1rem", { lineHeight: "1.65" }],
        lg: ["1.125rem", { lineHeight: "1.6" }],
        xl: ["1.28rem", { lineHeight: "1.45", letterSpacing: "-0.01em" }],
        "2xl": ["1.56rem", { lineHeight: "1.3", letterSpacing: "-0.015em" }],
        "3xl": ["1.95rem", { lineHeight: "1.2", letterSpacing: "-0.02em" }],
        "4xl": ["2.44rem", { lineHeight: "1.12", letterSpacing: "-0.025em" }],
        "5xl": ["3.05rem", { lineHeight: "1.06", letterSpacing: "-0.03em" }],
        "6xl": ["3.8rem", { lineHeight: "1.02", letterSpacing: "-0.035em" }],
        "7xl": ["4.75rem", { lineHeight: "1", letterSpacing: "-0.04em" }],
        "8xl": ["6rem", { lineHeight: "1", letterSpacing: "-0.04em" }],
        "9xl": ["8rem", { lineHeight: "1", letterSpacing: "-0.045em" }],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        soft: "0 1px 2px hsl(var(--shadow-color) / 0.04), 0 4px 16px -4px hsl(var(--shadow-color) / 0.06)",
        lift: "0 2px 4px hsl(var(--shadow-color) / 0.04), 0 12px 32px -8px hsl(var(--shadow-color) / 0.10)",
        terminal: "0 24px 64px -16px hsl(var(--shadow-color) / 0.28)",
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
        "slide-up": {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        /* AI agent gapirayotgandagi ovoz to'lqini */
        wave: {
          "0%, 100%": { transform: "scaleY(0.4)" },
          "50%": { transform: "scaleY(1)" },
        },
        "slide-down": {
          from: { opacity: "0", transform: "translateY(-20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 0 0 hsl(var(--brand-purple) / 0.28)" },
          "50%": { boxShadow: "0 0 0 10px hsl(var(--brand-purple) / 0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "coin-spin": {
          "0%": { transform: "rotateY(0deg)" },
          "100%": { transform: "rotateY(360deg)" },
        },
        /* Terminal kursori — brendning imzo elementi */
        caret: {
          "0%, 45%": { opacity: "1" },
          "50%, 95%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "type-in": {
          from: { width: "0" },
          to: { width: "100%" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "slide-up": "slide-up 0.5s ease-out",
        "slide-down": "slide-down 0.5s ease-out",
        "fade-in": "fade-in 0.5s ease-out",
        shimmer: "shimmer 2s infinite linear",
        "pulse-glow": "pulse-glow 2s infinite",
        float: "float 3s ease-in-out infinite",
        "coin-spin": "coin-spin 0.6s ease-in-out",
        caret: "caret 1.1s steps(1) infinite",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "hero-gradient":
          "linear-gradient(135deg, hsl(var(--brand-purple)) 0%, hsl(var(--brand-blue)) 100%)",
        "card-gradient":
          "linear-gradient(180deg, hsl(var(--brand-purple) / 0.06) 0%, hsl(var(--brand-blue) / 0.02) 100%)",
        "glass-gradient":
          "linear-gradient(135deg, hsl(var(--surface) / 0.9) 0%, hsl(var(--surface) / 0.5) 100%)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
