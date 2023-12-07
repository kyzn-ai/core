/**
 * @file The dev page used for admin controls and testing.
 * @author Riley Barabash <riley@rileybarabash.com>
 */

import { ModeToggle } from "~/components/mode-toggle"

export default async function Template(): Promise<JSX.Element> {
    return (
        <>
            {/* Main tag */}

            <main className="container flex min-h-screen w-full flex-col items-center justify-center">
                {/* Section one */}

                <section className="flex h-screen w-full flex-col items-center justify-center gap-4">
                    {/* Placeholder content */}

                    <ModeToggle />
                </section>
            </main>
        </>
    )
}
