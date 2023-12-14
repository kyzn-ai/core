/**
 * @file Signs the user out on mount.
 * @author Riley Barabash <riley@rileybarabash.com>
 */

"use client"

import { signOut } from "next-auth/react"
import { useCallback, useEffect } from "react"

export function OnMount(): null {
    //  The sign out functionality abstracted into a callback to use asynchronicity

    const _signOut = useCallback(async () => {
        try {
            await signOut({ redirect: false })
        } catch (error) {
            console.error("Error signing out", { cause: error })
        }
    }, [])

    //  Runs on mount

    useEffect(() => void _signOut(), [_signOut])

    return null
}
