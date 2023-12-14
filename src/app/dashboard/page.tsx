/**
 * @file The default page for authenticated users.
 * @author Riley Barabash <riley@rileybarabash.com>
 */

import { Button, Card, CardDescription, CardFooter, CardHeader, CardTitle, SignInOutButton } from "~/components"
import { getServerAuthSession } from "~/server/auth"
import { type Session } from "next-auth"
import Link from "next/link"
import { redirect, RedirectType } from "next/navigation"

export default async function Dashboard(): Promise<JSX.Element> {
    //  Get the server session

    const session: Session | null = await getServerAuthSession()

    //  Redirect to the unauthenticated page if the user is not authenticated

    if (!session) {
        redirect("/unauthenticated", RedirectType.replace)
        return <></>
    }

    return (
        <>
            {/* Main tag */}

            <main className="container flex min-h-screen w-full flex-col items-center justify-center">
                {/* Section 1 */}

                <section className="flex h-screen w-full flex-col items-center justify-center">
                    {/* Placeholder modal */}

                    <Card className="max-w-[24rem]">
                        {/* Header */}

                        <CardHeader>
                            {/* Title */}

                            <CardTitle>Dashboard</CardTitle>

                            {/* Description */}

                            <CardDescription>This page is under development. Please choose a destination below to navigate the app.</CardDescription>
                        </CardHeader>

                        {/* Footer */}

                        <CardFooter>
                            {/* Buttons */}

                            <div className="flex w-full items-center justify-center gap-2">
                                {/* A sign in / sign out button */}

                                <SignInOutButton className="w-full" variant={"outline"} session={session} callbackUrl={{ signOut: "/" }} />

                                {/* Settings */}

                                <Button className="w-full" asChild={true} variant={"secondary"}>
                                    <Link href="/settings">Settings</Link>
                                </Button>

                                {/* Chat */}

                                <Button className="w-full" asChild={true} variant={"default"}>
                                    <Link href="/chat">Chat</Link>
                                </Button>

                                {/* Dev (if admin) */}

                                {session.user?.email === "admin@rileybarabash.com" && (
                                    <Button className="w-full" asChild={true} variant={"destructive"}>
                                        <Link href="/dev">Dev</Link>
                                    </Button>
                                )}
                            </div>
                        </CardFooter>
                    </Card>
                </section>
            </main>
        </>
    )
}
