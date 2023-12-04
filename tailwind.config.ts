/**
 * @file Allows additional customization of Tailwind, such as arbitrary themes and plugins.
 * @author Riley Barabash <riley@rileybarabash.com>
 */

import { type Config } from "tailwindcss"
import { fontFamily } from "tailwindcss/defaultTheme"

export default {
    //  All of the pages to parse for Tailwind classes

    content: ["./src/**/*.tsx"],

    theme: {
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
            }
        }
    },

    plugins: []
} satisfies Config
