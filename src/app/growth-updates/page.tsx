/**
 * @file A page to that opens the user's SMS app with a message of "AI" for subscribing to growth updates.
 * @author Riley Barabash <riley@rileybarabash.com>
 */

import { DelayedRedirect } from "~/components"

export default function GrowthUpdates(): JSX.Element {
    return (
        <>
            {/* Main tag */}

            <main className="container flex min-h-screen w-full flex-col items-center justify-center">
                {/* Section 1 */}

                <section className="flex h-screen w-full flex-col items-center justify-center">
                    {/* Redirect modal */}

                    <DelayedRedirect title="Growth Updates" description="Thanks for checking out KYZN! You will be redirected to your SMS app in 5 seconds." buttonText="Time travel" redirectUrl="sms:+18722663742?body=AI" />
                </section>
            </main>
        </>
    )
}
