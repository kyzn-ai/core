/**
 * @file The purpose of the page.
 * @author Riley Barabash <riley@rileybarabash.com>
 */

// import { Button, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, Skeleton } from "~/components"
import { StripePricingTable } from "./_components/table"

export default function SecretPricingTable(): JSX.Element {
    return (
        <>
            {/* Main tag */}

            <main className="container flex min-h-screen w-full flex-col items-center justify-center">
                {/* Section 1 */}

                <section className="flex h-screen w-full flex-col items-center justify-center">
                    {/* Placeholder content */}
                    {/* <Card className="w-full max-w-[256px]">
                        <CardHeader>
                            <CardTitle>Secret Pricing Table</CardTitle>

                            <CardDescription>This card is a placeholder for the page content.</CardDescription>
                        </CardHeader>

                        <CardContent>
                            <Skeleton className="h-[32px] w-full" />
                        </CardContent>

                        <CardFooter>
                            <Button>Get Started</Button>
                        </CardFooter>
                    </Card> */}
                    {/* Pricing Table */}
                    <StripePricingTable />
                </section>
            </main>
        </>
    )
}

/*

IMPLEMENT SOMEWHERE

HOMEPAGE

grey out get started. (invite only)

to get KYZN with an invite code, visit get.kyzn.app/invite. If you would like to manage your subscription, visit kyzn.app/billing

createCustomerIfNull(...)

This should be implemented before a payment link is created. Requires the User ID (phone number) on the invite page. get.kyzn.app/invite

generateCustomerPortalLink(customerId)

This should be placed on the /billing page, where customers can enter their number and get redirected to the portal.

const isSubscribed = await hasSubscription(userID)

Use this to check subscription status before displaying sensitive content.

const checkoutLink = await createCheckoutLink(customerID) 

Use this to generate a checkout link for the user if not subscribed



*/
