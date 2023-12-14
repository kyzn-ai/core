/**
 * @file The landing page for the app.
 * @author Riley Barabash <riley@rileybarabash.com>
 */

import { Button, Card, CardContent, Pattern, SVG } from "~/components"
import { getServerAuthSession } from "~/server/auth"
import { type Session } from "next-auth"
import Link from "next/link"

export default async function Root(): Promise<JSX.Element> {
    //  Get the server session

    const session: Session | null = await getServerAuthSession()

    return (
        <>
            {/* Main tag */}

            <main className="flex min-h-screen w-full flex-col items-center justify-center">
                {/* Background pattern */}

                <Pattern className="max-w-100vw fixed -z-10 min-h-screen w-full" align="center">
                    {/* Grid */}

                    <SVG.Grid />
                </Pattern>

                {/* Container */}

                <div className="flex w-full flex-col items-center justify-center">
                    {/* Section 1 */}

                    <section className="flex h-screen w-full flex-col items-center justify-center gap-8 px-8">
                        {/* Modal */}

                        <Card>
                            {/* Card content */}

                            <CardContent className="flex w-full flex-col items-center justify-center gap-8 px-8 py-8">
                                {/* Logo image */}

                                <SVG.Logo width={256} />

                                {/* Get started button */}

                                <Button asChild={true} variant={"outline"}>
                                    <Link className="font-mono font-[700]" href={!!session ? "/dashboard" : "/signin"}>
                                        Get started
                                    </Link>
                                </Button>

                                {/* Divider */}

                                {/* Growth updates opt-in */}
                                {/* Want to recieve updates? -> (phone input) "Count me in" */}
                            </CardContent>
                        </Card>
                    </section>
                </div>
            </main>
        </>
    )
}
