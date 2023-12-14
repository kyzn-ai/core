/**
 * @file Refeshes the page on window focus.
 * @author Riley Barabash <riley@rileybarabash.com>
 */

"use client"

import { type AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime"
import { useRouter } from "next/navigation"
import { useCallback, useEffect } from "react"

export function RefreshOnFocus(): null {
    //  Get the router

    const router: AppRouterInstance = useRouter()

    //  Memoize the refresh action

    const refresh: () => void = useCallback(() => router.refresh(), [router])

    useEffect(() => {
        //  Install a listener

        window.addEventListener("focus", refresh)

        //  Clean up the effect

        return () => window.removeEventListener("focus", refresh)
    }, [refresh])

    return null
}
