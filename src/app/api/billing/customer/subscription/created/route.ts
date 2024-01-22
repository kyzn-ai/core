//  This endpoint will be hit when the deferred function completes, and this will ultimately call another endpoint which will (for now) just respond to the user, ideally it would call a task sorting route of some sort, which would get the defer task from the db, get the continuation id, and continue the flow. Skipping through code could be done with if (!continueID || continueID != "xxx")

/**
 * @file The webhook endpoint that recieves inbound SMS message requests from Twilio.
 * @author Riley Barabash <riley@rileybarabash.com>
 */

import { eq } from "drizzle-orm"
import { headers } from "next/headers"
import { NextResponse, type NextRequest } from "next/server"
import { env } from "~/env"
import { stripe } from "~/lib/billing"
import { sendMessage } from "~/lib/sms"
import { db, schema } from "~/server/db"

export async function POST(req: NextRequest): Promise<NextResponse> {
    //  get sig

    const sig: string | null = headers().get("Stripe-Signature")

    const body = await req.text()

    // Verify the event came from Stripe

    let event

    try {
        if (sig === null) throw new Error("No signature")

        event = stripe.webhooks.constructEvent(body, sig, (env.NODE_ENV ?? env.ENV) !== "production" ? env.STRIPE_TEST_WEBHOOK_SK : env.STRIPE_WEBHOOK_SK)
    } catch (err) {
        return new NextResponse(`Webhook Error: ${(err as { message: string }).message}`, {
            status: 400
        })
    }

    // Handle the event
    switch (event.type) {
        case "customer.subscription.created":
            const customerSubscriptionCreated = event.data.object
            // Then define and call a function to handle the event customer.subscription.created

            // Get the number associated with the customer ID

            const customer = await db.query.users.findFirst({ where: eq(schema.users.stripeId, customerSubscriptionCreated.customer as string) })

            if (!customer?.phone) {
                console.error("No phone number found")
                return new NextResponse(null, {
                    status: 200
                })
            }

            // Send success message to number

            await sendMessage({ content: "Congratulations! You have successfully subscribed to KYZN. Welcome to your next chapter. \n\nTo manage your subscription, use the '@billing' command. \n\nIf you need help with something, try asking KYZN — otherwise use '@help' followed by your message and a real person will get in touch with you.", to: customer.phone })

            break
        // ... handle other event types
        default:
            console.log(`Unhandled event type ${event.type}`)
    }

    return new NextResponse(null, {
        status: 200
    })
}
