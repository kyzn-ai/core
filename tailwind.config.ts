/**
 * @file Allows additional customization of Tailwind, such as arbitrary themes and plugins.
 * @author Riley Barabash <riley@rileybarabash.com>
 */

import { type Config } from "tailwindcss"
import { fontFamily } from "tailwindcss/defaultTheme"

export default {
    //  Searches for the `.dark` class in the HTML element to determine whether to use the dark theme

    darkMode: ["class"],

    //  All of the pages to parse for Tailwind classes

    content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],

    theme: {
        //  A container utility that you can use to center and horizontally pad your content

        container: {
            center: true,
            padding: "2rem",

            //  The widths at which your container should be constrained

            screens: {
                "2xl": "1400px"
            }
        },

        extend: {
            //  Configures the fonts defined as CSS variables in "~/app/layout", then appends the original typefaces as fallbacks

            fontFamily: {
                sans: ["var(--font-geist-sans)", ...fontFamily.sans],
                mono: ["var(--font-geist-mono)", ...fontFamily.mono],
                inter: ["var(--font-inter)", ...fontFamily.sans],
                "ibm-plex-mono": ["var(--font-ibm-plex-mono)", ...fontFamily.mono]
            },

            //  Custom timing functions for animation

            transitionTimingFunction: {
                "out-expo": "cubic-bezier(0.125, 1.0, 0.25, 1.0)",
                "in-out-expo": "cubic-bezier(0.875, 0.0, 0.125, 1.0)"
            },

            //  Extends the default color palette

            colors: {
                border: "hsl(var(--border))",
                input: "hsl(var(--input))",
                ring: "hsl(var(--ring))",
                background: "hsl(var(--background))",
                foreground: "hsl(var(--foreground))",

                primary: {
                    DEFAULT: "hsl(var(--primary))",
                    foreground: "hsl(var(--primary-foreground))"
                },

                secondary: {
                    DEFAULT: "hsl(var(--secondary))",
                    foreground: "hsl(var(--secondary-foreground))"
                },

                destructive: {
                    DEFAULT: "hsl(var(--destructive))",
                    foreground: "hsl(var(--destructive-foreground))"
                },

                muted: {
                    DEFAULT: "hsl(var(--muted))",
                    foreground: "hsl(var(--muted-foreground))"
                },

                accent: {
                    DEFAULT: "hsl(var(--accent))",
                    foreground: "hsl(var(--accent-foreground))"
                },

                popover: {
                    DEFAULT: "hsl(var(--popover))",
                    foreground: "hsl(var(--popover-foreground))"
                },

                card: {
                    DEFAULT: "hsl(var(--card))",
                    foreground: "hsl(var(--card-foreground))"
                }
            },

            //  Variable corner radii

            borderRadius: {
                lg: "var(--radius)",
                md: "calc(var(--radius) - 2px)",
                sm: "calc(var(--radius) - 4px)"
            },

            //  Animation keyframe presets

            keyframes: {
                "accordion-down": {
                    from: { height: "0" },
                    to: { height: "var(--radix-accordion-content-height)" }
                },

                "accordion-up": {
                    from: { height: "var(--radix-accordion-content-height)" },
                    to: { height: "0" }
                }
            },

            //  Animation presets

            animation: {
                "accordion-down": "accordion-down 0.2s ease-out",
                "accordion-up": "accordion-up 0.2s ease-out"
            }
        }
    },

    plugins: [require("tailwindcss-animate")]
} satisfies Config
