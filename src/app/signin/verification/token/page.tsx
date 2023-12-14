/**
 * @file Authenticates a user by matching the user's verification token with a valid one stored in the database.
 * @author Riley Barabash <riley@rileybarabash.com>
 */

import { Card, CardDescription, CardHeader, CardTitle, RefreshOnFocus } from "~/components"
import { getServerAuthSession } from "~/server/auth"
import { type Session } from "next-auth"
import { RedirectType, redirect } from "next/navigation"

interface VerifyWithTokenParams {
    //  The search params from the URL

    searchParams: Record<string, string | string[] | undefined>
}

export default async function VerifyWithToken({ searchParams }: VerifyWithTokenParams): Promise<JSX.Element> {
    //  Get the session

    const session: Session | null = await getServerAuthSession()

    //  Get the `callback-url` from the search params

    const callbackUrl: string = typeof searchParams?.["callback-url"] === "string" ? searchParams?.["callback-url"] : searchParams?.["callback-url"]?.[0] ?? "/dashboard"

    //  Redirect to the dashboard if the user is authenticated

    if (session) {
        redirect(callbackUrl, RedirectType.replace)
        return <></>
    }

    return (
        <>
            {/* Main tag */}

            <main className="container flex min-h-screen w-full flex-col items-center justify-center">
                {/* Section 1 */}

                <section className="flex h-screen w-full flex-col items-center justify-center">
                    {/* Placeholder content */}

                    <Card>
                        <CardHeader>
                            <CardTitle>Verification</CardTitle>

                            {/* <CardDescription>Enter the token you recieved to sign in, or click the link if viewing from the same device.</CardDescription> */}

                            <CardDescription>Open the link sent to your email in this browser.</CardDescription>
                        </CardHeader>

                        {/* <CardContent>
                            <Skeleton className="h-[32px] w-full" />
                        </CardContent> */}

                        {/* <CardFooter>
                            <div className="flex w-full items-center justify-center gap-2">
                                <Button variant="outline" className="w-full">
                                    Go back
                                </Button>
                                <Button className="w-full">Submit</Button>
                            </div>
                        </CardFooter> */}
                    </Card>
                </section>
            </main>

            {/* Refresh on focus */}

            <RefreshOnFocus />
        </>
    )
}
