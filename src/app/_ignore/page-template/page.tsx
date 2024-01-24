/**
 * @file The purpose of the page.
 * @author Riley Barabash <riley@rileybarabash.com>
 */

import { Button, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, Skeleton } from "~/components"

export default function PageTitle(): JSX.Element {
    return (
        <>
            {/* Main tag */}

            <main className="container flex min-h-screen w-full flex-col items-center justify-center">
                {/* Section 1 */}

                <section className="flex h-screen w-full flex-col items-center justify-center">
                    {/* Placeholder content */}

                    <Card className="w-full max-w-[256px]">
                        <CardHeader>
                            <CardTitle>Page Template</CardTitle>

                            <CardDescription>This card is a placeholder for the page content.</CardDescription>
                        </CardHeader>

                        <CardContent>
                            <Skeleton className="h-[32px] w-full" />
                        </CardContent>

                        <CardFooter>
                            <Button>Get Started</Button>
                        </CardFooter>
                    </Card>
                </section>
            </main>
        </>
    )
}
