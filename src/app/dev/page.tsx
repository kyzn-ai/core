/**
 * @file The dev page used for admin controls and testing.
 * @author Riley Barabash <riley@rileybarabash.com>
 */

import { SignInOutButton, Separator, ThemeSwitcher } from "~/components"
import { getServerAuthSession } from "~/server/auth"
import { type Session } from "next-auth"
import { RedirectType, redirect } from "next/navigation"

export default async function Dev(): Promise<JSX.Element> {
    //  Get the session

    const session: Session | null = await getServerAuthSession()

    //  Redirect to the unauthenticated page if the user is not authenticated

    if (!session) {
        redirect("/unauthenticated", RedirectType.replace)
        return <></>
    }

    //  Redirect to the unauthorized page if the user is not Riley

    if (session.user?.email !== "admin@rileybarabash.com") {
        redirect("/unauthorized", RedirectType.replace)
        return <></>
    }

    return (
        <>
            {/* Main tag */}

            <main className="container flex min-h-screen w-full flex-col items-center justify-center">
                {/* Section 1 */}

                <section className="flex h-screen w-full flex-col items-center justify-center gap-4">
                    {/* A dropdown to switch the theme */}

                    <ThemeSwitcher />

                    {/* Divider */}

                    <Separator />

                    {/* A sign in / sign out button */}

                    <SignInOutButton variant={"outline"} session={session} />
                </section>
            </main>
        </>
    )
}
