/**
 * @file A page to redirect to when an unauthorized user visits a forbidden route.
 * @author Riley Barabash <riley@rileybarabash.com>
 */

import { DelayedRedirect } from "~/components"

export default function Unauthenticated(): JSX.Element {
    return (
        <>
            {/* Main tag */}

            <main className="container flex min-h-screen w-full flex-col items-center justify-center">
                {/* Section 1 */}

                <section className="flex h-screen w-full flex-col items-center justify-center">
                    {/* Redirect modal */}

                    <DelayedRedirect title="403: Unauthorized" description="You don't have permission to access this page. You will be redirected in 5 seconds." buttonText="Go back" redirectUrl="/dashboard" />
                </section>
            </main>
        </>
    )
}
