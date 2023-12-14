/**
 * @file A button that will sign a user in or out based on the current session. Shows a confirmation dialog before signing out.
 * @author Riley Barabash <riley@rileybarabash.com>
 */

"use client"

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger, Button, type ButtonVariants } from "~/components"
import { useAppendQueryString } from "~/hooks"
import { type Session } from "next-auth"
import { signOut } from "next-auth/react"
import Link from "next/link"
import { usePathname } from "next/navigation"

export interface AuthButtonOptions extends React.ButtonHTMLAttributes<HTMLButtonElement>, ButtonVariants {
    //  The current auth session

    session: Session | null

    //  The URL to redirect to after the auth action — will return to the current page if not provided

    callbackUrl?:
        | {
              signIn?: string
              signOut?: string
          }
        | string
}

export function SignInOutButton({ className, variant, session, callbackUrl, ...props }: AuthButtonOptions) {
    //  Get the current path and query string helper

    const pathname: string = usePathname()
    const appendQueryString: (name: string, value: string) => string = useAppendQueryString()

    //  Adds the `callback-url` search param to the sign in URL, defaulting to the current path if not provided

    const signInUrl: string = "/signin" + "?" + appendQueryString("callback-url", !!callbackUrl ? (typeof callbackUrl === "string" ? callbackUrl : callbackUrl?.signIn ?? pathname) : pathname)

    //  Assigns the sign out callback URL if it exists, defaulting to the current path if not provided

    const signOutCallbackUrl: string = !!callbackUrl ? (typeof callbackUrl === "string" ? callbackUrl : callbackUrl?.signOut ?? pathname) : pathname

    return (
        <>
            {!session ? (
                //  If the user is signed out, show a sign in button
                <Button asChild={true} variant={variant} className={className} {...props}>
                    <Link href={signInUrl}>Sign in</Link>
                </Button>
            ) : (
                //  If the user is signed in, show a sign out button with a confirmation dialog
                <AlertDialog>
                    {/* The dialog trigger */}

                    <AlertDialogTrigger asChild>
                        <Button variant={variant} className={className} {...props}>
                            Sign out
                        </Button>
                    </AlertDialogTrigger>

                    {/* Content */}

                    <AlertDialogContent>
                        {/* Header */}

                        <AlertDialogHeader>
                            {/* Title */}

                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>

                            {/* Description */}

                            <AlertDialogDescription>You're about to sign out of your account. You can always log back in at any time to continue where you left off.</AlertDialogDescription>
                        </AlertDialogHeader>

                        {/* Footer */}

                        <AlertDialogFooter>
                            {/* Closes the dialog */}

                            <AlertDialogCancel>Cancel</AlertDialogCancel>

                            {/* Signs the user out */}

                            <AlertDialogAction onClick={_ => signOut({ callbackUrl: signOutCallbackUrl })}>Sign out</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            )}
        </>
    )
}
