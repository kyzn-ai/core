/**
 * @file The purpose of the page.
 * @author Riley Barabash <riley@rileybarabash.com>
 */

import { DelayedRedirect } from "~/components"

export default function REVYSE(): JSX.Element {
    return (
        <>
            {/* Main tag */}

            <main className="container flex min-h-screen w-full flex-col items-center justify-center">
                {/* Section 1 */}

                <section className="flex h-screen w-full flex-col items-center justify-center">
                    {/* Redirect modal */}

                    <DelayedRedirect title="Get REVYSE" description="Thanks for checking out REVYSE! You will be redirected in 5 seconds." buttonText="Time travel" redirectUrl={"https://kyznai.notion.site/Welcome-to-REVYSE-2e6dddbff6af482992bdaca9ad8743f1?pvs=4"} />
                </section>
            </main>
        </>
    )
}
