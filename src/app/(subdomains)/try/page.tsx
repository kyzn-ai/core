/**
 * @file The purpose of the page.
 * @author Riley Barabash <riley@rileybarabash.com>
 */

import { DelayedRedirect } from "~/components"
import { env } from "~/env"

export default function Try(): JSX.Element {
    return (
        <>
            {/* Main tag */}

            <main className="container flex min-h-screen w-full flex-col items-center justify-center">
                {/* Section 1 */}

                <section className="flex h-screen w-full flex-col items-center justify-center">
                    {/* Redirect modal */}

                    <DelayedRedirect title="Try Us Out" description="Thanks for checking out KYZN! You will be redirected to your SMS app in 5 seconds." buttonText="Time travel" redirectUrl={`sms:${env.TWILIO_NUMBER}`} />
                </section>
            </main>
        </>
    )
}
