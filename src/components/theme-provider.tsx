/**
 * @file Wraps the provider that propagates theme information throughout the app.
 * @author Riley Barabash <riley@rileybarabash.com>
 */

"use client"

import { ThemeProvider as NextThemesProvider } from "next-themes"
import { type ThemeProviderProps } from "next-themes/dist/types"
import * as React from "react"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
    return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
