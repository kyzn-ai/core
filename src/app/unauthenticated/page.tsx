/**
 * @file A page to redirect to when an unauthenticated user visits a protected route.
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

                    <DelayedRedirect title="401: Unauthenticated" description="You need to be signed in to access this page. You will be redirected in 5 seconds." buttonText="Go back" redirectUrl="/" />
                </section>
            </main>
        </>
    )
}
