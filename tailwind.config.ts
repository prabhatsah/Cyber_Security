import type { Config } from "tailwindcss";
import colors from "tailwindcss/colors";
import formsPlugin from "@tailwindcss/forms";
export default {
	darkMode: ["class"],
	content: [
		"./src/ikon/components/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/shadcn/ui/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/app/**/*.{js,ts,jsx,tsx,mdx}",
		"./node_modules/@tremor/**/*.{js,ts,jsx,tsx}",
		"./src/app/(protected)/(apps)/cyber-security/components**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		extend: {
		  colors: {
			// Light mode (Tremor)
			tremor: {
			  brand: {
				faint: colors.blue[50],
				muted: colors.blue[200],
				subtle: colors.blue[400],
				DEFAULT: colors.blue[500],
				emphasis: colors.blue[700],
				inverted: colors.white,
			  },
			  background: {
				muted: colors.gray[50],
				subtle: colors.gray[100],
				DEFAULT: colors.white,
				emphasis: colors.gray[700],
			  },
			  border: {
				DEFAULT: colors.gray[200],
			  },
			  ring: {
				DEFAULT: colors.gray[200],
			  },
			  content: {
				subtle: colors.gray[400],
				DEFAULT: colors.gray[500],
				emphasis: colors.gray[700],
				strong: colors.gray[900],
				inverted: colors.white,
			  },
			},
	  
			// Dark mode (Tremor)
			"dark-tremor": {
			  brand: {
				faint: "#0B1229",
				muted: colors.blue[950],
				subtle: colors.blue[800],
				DEFAULT: colors.blue[500],
				emphasis: colors.blue[400],
				inverted: colors.blue[950],
			  },
			  background: {
				muted: "#131A2B",
				subtle: colors.gray[800],
				DEFAULT: colors.gray[900],
				emphasis: colors.gray[300],
			  },
			  border: {
				DEFAULT: colors.gray[800],
			  },
			  ring: {
				DEFAULT: colors.gray[800],
			  },
			  content: {
				subtle: colors.gray[600],
				DEFAULT: colors.gray[500],
				emphasis: colors.gray[200],
				strong: colors.gray[50],
				inverted: colors.gray[950],
			  },
			},
	  
			// Shared themes
			dark: {
			  bgPrimary: "#030712",
			  bgSecondary: "#131a2b",
			  bgTertiary: "#2e3851",
			},
			widget: {
			  title: "var(--title)",
			  mainHeader: "var(--mainHeader)",
			  mainDesc: "var(--mainDesc)",
			  secondaryheader: "var(--secondaryheader)",
			  secondaryDesc: "var(--secondaryDesc)",
			},
			table: {
			  tableHeader: "var(--tableHeader)",
			  tableDesc: "var(--tableDesc)",
			},
			primary: {
			  DEFAULT: "var(--primary)",
			  foreground: "hsl(var(--primary-foreground))",
			},
			secondary: {
			  DEFAULT: "var(--secondary)",
			  foreground: "var(--secondary-foreground)",
			},
			success: "var(--success)",
			critical: "var(--critical)",
			error: "var(--error)",
			warning: "var(--warning)",
			background: "hsl(var(--background))",
			foreground: "hsl(var(--foreground))",
			card: {
			  DEFAULT: "hsl(var(--card))",
			  foreground: "hsl(var(--card-foreground))",
			},
			popover: {
			  DEFAULT: "hsl(var(--popover))",
			  foreground: "hsl(var(--popover-foreground))",
			},
			muted: {
			  DEFAULT: "hsl(var(--muted))",
			  foreground: "hsl(var(--muted-foreground))",
			},
			accent: {
			  DEFAULT: "hsl(var(--accent))",
			  foreground: "hsl(var(--accent-foreground))",
			},
			destructive: {
			  DEFAULT: "hsl(var(--destructive))",
			  foreground: "hsl(var(--destructive-foreground))",
			},
			border: "hsl(var(--border))",
			input: "hsl(var(--input))",
			ring: "hsl(var(--ring))",
			chart: {
			  1: "hsl(var(--chart-1))",
			  2: "hsl(var(--chart-2))",
			  3: "hsl(var(--chart-3))",
			  4: "hsl(var(--chart-4))",
			  5: "hsl(var(--chart-5))",
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
		  },
	  
		  padding: {
			out: "1.5rem",
			in: ".75rem",
		  },
	  
		  boxShadow: {
			"tremor-input": "0 1px 2px 0 rgb(0 0 0 / 0.05)",
			"tremor-card": "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
			"tremor-dropdown": "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
			"dark-tremor-input": "0 1px 2px 0 rgb(0 0 0 / 0.05)",
			"dark-tremor-card": "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
			"dark-tremor-dropdown": "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
		  },
	  
		  borderRadius: {
			"tremor-small": "0.375rem",
			"tremor-default": "0.5rem",
			"tremor-full": "9999px",
			lg: "var(--radius)",
			md: "calc(var(--radius) - 2px)",
			sm: "calc(var(--radius) - 4px)",
		  },
	  
		  fontSize: {
			pageheader: "var(--pageheader)",
			widgetHeader: "var(--widgetHeader)",
			"tremor-label": ["0.75rem", { lineHeight: "1rem" }],
			"tremor-default": ["0.875rem", { lineHeight: "1.25rem" }],
			"tremor-title": ["1.125rem", { lineHeight: "1.75rem" }],
			"tremor-metric": ["1.875rem", { lineHeight: "2.25rem" }],
			xs: ["0.75rem", { lineHeight: "1rem" }],
			sm: ["0.875rem", { lineHeight: "1.25rem" }],
			base: ["1rem", { lineHeight: "1.5rem" }],
			lg: ["1.125rem", { lineHeight: "1.75rem" }],
			xl: ["1.25rem", { lineHeight: "1.75rem" }],
			"2xl": ["1.5rem", { lineHeight: "2rem" }],
		  },
	  
		  fontFamily: {
			sans: ["Inter", "system-ui", "sans-serif"],
		  },
	  
		  animation: {
			gradient: "gradient 8s linear infinite",
			"pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
			"accordion-down": "accordion-down 0.2s ease-out",
			"accordion-up": "accordion-up 0.2s ease-out",
			"pulse-3s": "pulse 3s infinite",
		  },
	  
		  keyframes: {
			gradient: {
			  "0%, 100%": {
				"background-size": "200% 200%",
				"background-position": "left center",
			  },
			  "50%": {
				"background-size": "200% 200%",
				"background-position": "right center",
			  },
			},
			"accordion-down": {
			  from: { height: "0" },
			  to: { height: "var(--radix-accordion-content-height)" },
			},
			"accordion-up": {
			  from: { height: "var(--radix-accordion-content-height)" },
			  to: { height: "0" },
			},
		  },
		},
	  },
	safelist: [
		{
		  pattern:
			/^(bg-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/,
		  variants: ["hover", "data-[selected]"],
		},
		{
		  pattern:
			/^(text-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/,
		  variants: ["hover", "data-[selected]"],
		},
		{
		  pattern:
			/^(border-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/,
		  variants: ["hover", "data-[selected]"],
		},
		{
		  pattern:
			/^(ring-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/,
		},
		{
		  pattern:
			/^(stroke-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/,
		},
		{
		  pattern:
			/^(fill-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/,
		},
	  ],
	plugins: [require("tailwindcss-animate"),formsPlugin],
} satisfies Config;
