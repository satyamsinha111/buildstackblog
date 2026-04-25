import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx,mdx}",
    "./components/**/*.{ts,tsx}",
    "./content/**/*.{md,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        sm: "1.5rem",
        lg: "2rem",
      },
      screens: {
        "2xl": "1240px",
      },
    },
    extend: {
      fontFamily: {
        sans: [
          "var(--font-inter)",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
        display: [
          "var(--font-fraunces)",
          "ui-serif",
          "Georgia",
          "Cambria",
          "Times New Roman",
          "serif",
        ],
        mono: [
          "var(--font-jetbrains-mono)",
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "Monaco",
          "Consolas",
          "monospace",
        ],
      },
      colors: {
        canvas: {
          DEFAULT: "rgb(var(--canvas) / <alpha-value>)",
          subtle: "rgb(var(--canvas-subtle) / <alpha-value>)",
          inset: "rgb(var(--canvas-inset) / <alpha-value>)",
        },
        line: {
          DEFAULT: "rgb(var(--line) / <alpha-value>)",
          strong: "rgb(var(--line-strong) / <alpha-value>)",
        },
        fg: {
          DEFAULT: "rgb(var(--fg) / <alpha-value>)",
          muted: "rgb(var(--fg-muted) / <alpha-value>)",
          subtle: "rgb(var(--fg-subtle) / <alpha-value>)",
          inverted: "rgb(var(--fg-inverted) / <alpha-value>)",
        },
        accent: {
          50: "#fff7ed",
          100: "#ffedd5",
          200: "#fed7aa",
          300: "#fdba74",
          400: "#fb923c",
          500: "#f97316",
          600: "#ea580c",
          700: "#c2410c",
          800: "#9a3412",
          900: "#7c2d12",
          950: "#431407",
        },
        brand: {
          50: "#eef6ff",
          100: "#d9eaff",
          200: "#bcdbff",
          300: "#8ec3ff",
          400: "#599fff",
          500: "#2f7bff",
          600: "#175cf2",
          700: "#1247c8",
          800: "#143ea1",
          900: "#15397f",
          950: "#0f244f",
        },
        ink: {
          50: "#f7f7f8",
          100: "#eeeef0",
          200: "#d9d9de",
          300: "#b6b6bf",
          400: "#8c8c98",
          500: "#6d6d79",
          600: "#555560",
          700: "#3f3f48",
          800: "#28282e",
          900: "#17171b",
          950: "#0c0c0f",
        },
      },
      boxShadow: {
        soft: "0 1px 2px rgba(15,23,42,0.04), 0 4px 12px rgba(15,23,42,0.06)",
        editorial:
          "0 1px 1px rgba(0,0,0,0.02), 0 6px 20px -10px rgba(15,23,42,0.10)",
        ring: "0 0 0 1px rgba(15,23,42,0.06)",
      },
      borderRadius: {
        xl: "0.875rem",
        "2xl": "1.125rem",
        "3xl": "1.5rem",
      },
      letterSpacing: {
        tightish: "-0.015em",
        crisp: "-0.025em",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(6px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.5s ease-out both",
        shimmer: "shimmer 2s linear infinite",
      },
      typography: ({ theme }: { theme: (path: string) => unknown }) => ({
        DEFAULT: {
          css: {
            "--tw-prose-body": "rgb(var(--fg) / 0.92)",
            "--tw-prose-headings": "rgb(var(--fg))",
            "--tw-prose-links": "rgb(var(--fg))",
            "--tw-prose-bold": "rgb(var(--fg))",
            "--tw-prose-bullets": "rgb(var(--fg-subtle))",
            "--tw-prose-quotes": "rgb(var(--fg))",
            "--tw-prose-quote-borders": theme("colors.accent.400"),
            "--tw-prose-code": "rgb(var(--fg))",
            "--tw-prose-pre-bg": theme("colors.ink.950"),
            "--tw-prose-pre-code": theme("colors.ink.50"),
            maxWidth: "70ch",
            fontSize: "1.0625rem",
            lineHeight: "1.75",
            "h2, h3, h4": {
              fontFamily: "var(--font-fraunces), ui-serif, Georgia, serif",
              letterSpacing: "-0.015em",
            },
            h2: {
              fontWeight: "600",
              fontSize: "1.75rem",
              marginTop: "2.25em",
              marginBottom: "0.6em",
              lineHeight: "1.25",
            },
            h3: {
              fontWeight: "600",
              fontSize: "1.35rem",
              marginTop: "1.75em",
              marginBottom: "0.4em",
              lineHeight: "1.3",
            },
            "code::before": { content: '""' },
            "code::after": { content: '""' },
            code: {
              backgroundColor: "rgb(var(--canvas-inset))",
              padding: "0.15em 0.4em",
              borderRadius: "0.375rem",
              fontWeight: "500",
              fontSize: "0.88em",
              border: "1px solid rgb(var(--line))",
            },
            pre: {
              borderRadius: "0.875rem",
              padding: "1.1rem 1.25rem",
              fontSize: "0.875rem",
              lineHeight: "1.65",
              border: "1px solid rgb(var(--line))",
            },
            "pre code": {
              border: "0",
              backgroundColor: "transparent",
              padding: "0",
            },
            a: {
              textDecoration: "none",
              fontWeight: "500",
              backgroundImage:
                "linear-gradient(transparent calc(100% - 1px), rgb(var(--fg) / 0.35) 1px)",
              backgroundRepeat: "no-repeat",
              backgroundSize: "100% 100%",
              transition: "background-size 200ms ease",
            },
            "a:hover": {
              backgroundImage:
                "linear-gradient(transparent calc(100% - 2px), rgb(var(--fg)) 2px)",
            },
            blockquote: {
              fontStyle: "normal",
              fontFamily: "var(--font-fraunces), ui-serif, Georgia, serif",
              fontSize: "1.25rem",
              lineHeight: "1.6",
              borderLeftWidth: "3px",
              paddingLeft: "1.25rem",
              color: "rgb(var(--fg))",
            },
            ul: {
              paddingLeft: "1.25em",
            },
            "ul > li::marker": {
              color: "rgb(var(--fg-subtle))",
            },
            "ol > li::marker": {
              color: "rgb(var(--fg-subtle))",
              fontWeight: "500",
            },
            hr: {
              borderColor: "rgb(var(--line))",
              marginTop: "3em",
              marginBottom: "3em",
            },
            "thead th": {
              fontFamily: "var(--font-inter), ui-sans-serif, system-ui, sans-serif",
              fontSize: "0.875rem",
              fontWeight: "600",
            },
          },
        },
        invert: {
          css: {
            "--tw-prose-body": "rgb(var(--fg) / 0.88)",
            "--tw-prose-headings": "rgb(var(--fg))",
            "--tw-prose-links": "rgb(var(--fg))",
            "--tw-prose-bold": "rgb(var(--fg))",
            "--tw-prose-bullets": "rgb(var(--fg-subtle))",
            "--tw-prose-quotes": "rgb(var(--fg))",
            "--tw-prose-code": "rgb(var(--fg))",
            "--tw-prose-pre-bg": "#06060a",
            "--tw-prose-pre-code": "rgb(var(--fg))",
          },
        },
      }),
    },
  },
  plugins: [typography],
};

export default config;
