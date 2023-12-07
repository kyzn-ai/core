/**
 * @file The root level layout. This is the outermost wrapper for the app, and will apply to all of the pages nested within it.
 * @author Riley Barabash <riley@rileybarabash.com>
 */

import { Analytics } from "@vercel/analytics/react"
import "~/styles/globals.css"
import { preferences } from "~/preferences"
import { TRPCReactProvider } from "~/trpc/react"
import { GeistMono } from "geist/font/mono"
import { GeistSans } from "geist/font/sans"
import { IBM_Plex_Mono, Inter } from "next/font/google"
import { cookies } from "next/headers"
import { cn } from "~/utils"
import { ThemeProvider } from "~/components/theme-provider"

//  Import fonts

const inter = Inter({
    subsets: ["latin"],
    variable: "--font-inter"
})

const ibmPlexMono = IBM_Plex_Mono({
    weight: ["100", "400", "700"],
    subsets: ["latin"],
    variable: "--font-ibm-plex-mono"
})

//  Define some global metadata for the app

export const metadata = {
    title: `${preferences.brand.displayName} | ${preferences.brand.tagline}`,
    description: preferences.brand.description,
    icons: [{ rel: "icon", url: "/favicon.png" }]
}

export default function RootLayout({ children }: { children: React.ReactNode }): JSX.Element {
    return (
        <html lang="en">
            {/* Body */}

            <body
                className={cn(
                    // Integrates typefaces

                    "min-h-screen bg-background font-sans antialiased",
                    GeistSans.variable,
                    GeistMono.variable,
                    inter.variable,
                    ibmPlexMono.variable
                )}
            >
                {/* TRPC provider */}

                <TRPCReactProvider
                    //  Uses cookies to store and retrieve sessions

                    cookies={cookies().toString()}
                >
                    {/* Theme provider */}

                    <ThemeProvider
                        //  Uses the `.dark` class to determine the theme

                        attribute="class"
                        defaultTheme="system"
                        enableSystem
                        disableTransitionOnChange
                    >
                        {children}
                    </ThemeProvider>
                </TRPCReactProvider>

                {/* Vercel analytics */}

                <Analytics />
            </body>
        </html>
    )
}
