/**
 * @file Redirects after the elapse of an artificial delay and provides a button to force redirect.
 * @author Riley Barabash <riley@rileybarabash.com>
 *
 * @todo DEPRIORITIZED: Add support for arbitrary durations.
 */

"use client"

import { Button, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, Progress } from "~/components"
import { type AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime"
import Link from "next/link"
import { type ReadonlyURLSearchParams, useRouter, useSearchParams } from "next/navigation"
import React, { useEffect } from "react"

interface DelayedRedirectOptions {
    title: string
    description: string
    buttonText: string

    //  The delay in seconds — Tailwind arbitrary animation durations do not work here for whatever reason, so the duration is fixed to 5 seconds

    // duration?: number

    redirectUrl?: string
}

export function DelayedRedirect({ title, description, buttonText, redirectUrl }: DelayedRedirectOptions): JSX.Element {
    //  Grab the router

    const router: AppRouterInstance = useRouter()

    //  Use the provided `redirectUrl`, otherwise parse the search params for a redirect URL, otherwise default to the app root

    const searchParams: ReadonlyURLSearchParams = useSearchParams()
    const resolvedRedirectUrl: string = redirectUrl ?? searchParams.get("redirect-url") ?? "/"

    //  Create state for the progress bar

    const [hasCompleted, setHasCompleted] = React.useState<boolean>(false)

    useEffect(() => {
        //  Start the progress bar animation

        setHasCompleted(true)

        //  Perform the actions

        const timeout = setTimeout(() => router.push(resolvedRedirectUrl), 5000)

        //  Cleanup on unmount

        return () => clearTimeout(timeout)
    }, [])

    return (
        <>
            {/* Modal */}

            <Card className="w-full max-w-[256px]">
                {/* Modal header */}

                <CardHeader>
                    {/* Modal title */}

                    <CardTitle>{title}</CardTitle>

                    {/* Modal description */}

                    <CardDescription>{description}</CardDescription>
                </CardHeader>

                {/* Modal content */}

                <CardContent>
                    {/* Progress bar */}

                    <Progress indicatorClassName="transition-transform duration-5000 ease-in-out-expo" value={hasCompleted ? 100 : 0} />
                </CardContent>

                {/* Footer */}

                <CardFooter>
                    {/* Force redirect */}

                    <Button asChild={true}>
                        <Link href={resolvedRedirectUrl}>{buttonText}</Link>
                    </Button>
                </CardFooter>
            </Card>
        </>
    )
}
