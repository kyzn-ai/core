/**
 * @file Signs the user out when visited.
 * @author Riley Barabash <riley@rileybarabash.com>
 */

import { OnMount } from "."
import { DelayedRedirect } from "~/components"
import { getServerAuthSession } from "~/server/auth"
import { type Session } from "next-auth"
import { RedirectType, redirect } from "next/navigation"

interface SignOutParams {
    //  The search params from the URL

    searchParams: Record<string, string | string[] | undefined>
}

export default async function SignOut({ searchParams }: SignOutParams): Promise<JSX.Element> {
    //  Get the session

    const session: Session | null = await getServerAuthSession()

    //  Get the `callback-url` from the search params

    const callbackUrl: string = typeof searchParams?.["callback-url"] === "string" ? searchParams?.["callback-url"] : searchParams?.["callback-url"]?.[0] ?? "/"

    //  Redirect to the callback URL if the user is already signed in

    if (!session) {
        redirect(callbackUrl, RedirectType.replace)
        return <></>
    }

    return (
        <>
            {/* Main tag */}

            <main className="container flex min-h-screen w-full flex-col items-center justify-center">
                {/* Section 1 */}

                <section className="flex h-screen w-full flex-col items-center justify-center">
                    {/* Redirect */}

                    <DelayedRedirect title="Signing Out" description="You will be redirected in 5 seconds." buttonText="Force redirect" redirectUrl="/" />
                </section>
            </main>

            {/* Signs the user out */}

            <OnMount />
        </>
    )
}
