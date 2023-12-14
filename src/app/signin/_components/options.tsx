/**
 * @file Handles the sign-in page functionality.
 * @author Riley Barabash <riley@rileybarabash.com>
 */

"use client"

import { AuthenticateWithApple, AuthenticateWithEmail } from "."
import { Separator, TypographyMuted } from "~/components"
import { cn } from "~/utils"
import { type ReadonlyURLSearchParams, useSearchParams } from "next/navigation"
import * as React from "react"

//  Define the provider IDs for differentiating between state

export type AuthenticationOptionsProviderId = "email" | "Apple"

//  The options for the `AuthenticationOptions` component

export interface AuthenticationOptionsOptions extends React.HTMLAttributes<HTMLDivElement> {
    //  The URL to redirect to after authentication is complete

    callbackUrl?: string
}

export function AuthenticationOptions({ className, callbackUrl, ...props }: AuthenticationOptionsOptions) {
    //  Sets up state for the buttons

    const [loading, setLoading] = React.useState<AuthenticationOptionsProviderId | null>(null)

    //  Get the `callback-url` value from the search params, and use it to resolve the callback URL

    const searchParams: ReadonlyURLSearchParams = useSearchParams()
    const resolvedCallbackUrl: string = callbackUrl ?? searchParams.get("callback-url") ?? "/dashboard"

    return (
        <>
            {/* Wrapper */}

            <div className={cn("flex w-full flex-col items-center justify-center gap-6", className)} {...props}>
                {/* Email */}

                <AuthenticateWithEmail loading={loading} onLoadingChange={setLoading} callbackUrl={resolvedCallbackUrl} />

                {/* Divider */}

                <div className="flex w-full items-center justify-center">
                    {/* Left line */}

                    <Separator />

                    {/* Divider text */}

                    <TypographyMuted className="whitespace-nowrap px-2 uppercase">Or continue with</TypographyMuted>

                    {/* Right line */}

                    <Separator />
                </div>

                {/* Apple */}

                <AuthenticateWithApple variant="outline" disabled loading={loading} onLoadingChange={setLoading} buttonText="Sign in with Apple (coming soon)" />
            </div>
        </>
    )
}
