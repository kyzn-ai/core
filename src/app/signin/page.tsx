/**
 * @file Provides a way for users to authenticate with their preferred provider.
 * @author Riley Barabash <riley@rileybarabash.com>
 */

import { AuthenticationOptions } from "."
import { TypographyH3, TypographyMuted } from "~/components"
import { getServerAuthSession } from "~/server/auth"
import { type Session } from "next-auth"
import Link from "next/link"
import { RedirectType, redirect } from "next/navigation"

interface SignInParams {
    //  The search params from the URL

    searchParams: Record<string, string | string[] | undefined>
}

export default async function SignIn({ searchParams }: SignInParams): Promise<JSX.Element> {
    //  Get the server session

    const session: Session | null = await getServerAuthSession()

    //  Get the `callback-url` from the search params

    const callbackUrl: string = typeof searchParams?.["callback-url"] === "string" ? searchParams?.["callback-url"] : searchParams?.["callback-url"]?.[0] ?? "/dashboard"

    //  Redirect to the callback URL if the user is already signed in

    if (session) {
        redirect(callbackUrl, RedirectType.replace)
        return <></>
    }

    return (
        <>
            {/* Main */}

            <main className="container flex min-h-screen w-full flex-col items-center justify-center">
                {/* Section 1 */}

                <section className="flex h-screen w-full flex-col items-center justify-center">
                    {/* Modal wrapper */}

                    <div className="flex w-96 flex-col justify-center gap-6">
                        {/* Text */}

                        <div className="flex flex-col gap-2 text-center">
                            {/* Heading */}

                            <TypographyH3 className="">Sign In</TypographyH3>

                            {/* Subheading */}
                            <TypographyMuted>Enter your email below to access your account. If you're new here, we'll create one for you.</TypographyMuted>
                        </div>

                        {/* Providers */}

                        <AuthenticationOptions />

                        {/* Disclaimer */}

                        <TypographyMuted className="px-8 text-center">
                            By creating an account, you agree to our{" "}
                            <Link href="/terms" className="underline underline-offset-4 hover:text-primary">
                                Terms of Service
                            </Link>{" "}
                            and{" "}
                            <Link href="/privacy" className="underline underline-offset-4 hover:text-primary">
                                Privacy Policy
                            </Link>
                            .
                        </TypographyMuted>
                    </div>
                </section>
            </main>
        </>
    )
}
