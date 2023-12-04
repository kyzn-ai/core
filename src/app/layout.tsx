/**
 * @file The root level layout. This is the outermost wrapper for the app, and will apply to all of the pages nested within it.
 * @author Riley Barabash <riley@rileybarabash.com>
 */

import "~/styles/globals.css"
import { preferences } from "~/preferences"
import { TRPCReactProvider } from "~/trpc/react"
import { GeistMono } from "geist/font/mono"
import { GeistSans } from "geist/font/sans"
import { IBM_Plex_Mono, Inter } from "next/font/google"
import { cookies } from "next/headers"

//  Import Google fonts

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

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            {/* Create font CSS variables */}

            <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} ${inter.variable} ${ibmPlexMono.variable} bg-gradient-to-tr from-black to-[#222222] text-sm text-white`}>
                {/* TRPC uses cookies to store and retrieve sessions */}

                <TRPCReactProvider cookies={cookies().toString()}>{children}</TRPCReactProvider>
            </body>
        </html>
    )
}
