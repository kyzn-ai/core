import { eq } from "drizzle-orm"
import { stripe } from "."
import { db, schema } from "~/server/db"
import { env } from "~/env"

export async function hasSubscription({ userId }: { userId: string }) {
    // //  Get the session

    // const session: Session | null = await getServerAuthSession()

    // if (session) {
    const user = await db.query.users.findFirst({ where: eq(schema.users.id, userId) })

    const subscriptions = await stripe.subscriptions.list({
        customer: user?.stripeId ?? undefined
    })

    return subscriptions.data.length > 0
    // }

    return false
}

export async function createCheckoutLink(customer: string, priceId: string): Promise<string> {
    const checkout = await stripe.checkout.sessions.create({
        success_url: `${env.BASE_URL}/billing/confirmation?success=true`,
        cancel_url: `${env.BASE_URL}/billing/confirmation?success=false`,
        customer: customer,
        line_items: [
            {
                price: priceId,
                quantity: 1
            }
        ],
        mode: "subscription"
    })

    return checkout.url!
}

export async function generateCustomerPortalLink(customerId: string) {
    try {
        const portalSession = await stripe.billingPortal.sessions.create({
            customer: customerId,
            return_url: env.BASE_URL
        })

        return portalSession.url
    } catch (error) {
        console.log(error)
        return undefined
    }
}

export async function createCustomerIfNull({ userId }: { userId: string }): Promise<string | null> {
    // //  Get the session

    // const session: Session | null = await getServerAuthSession()

    // if (session) {
    const user = await db.query.users.findFirst({ where: eq(schema.users.id, userId) })

    // if (!user?.api_key) {
    //     await prisma.user.update({
    //         where: {
    //             id: user?.id
    //         },
    //         data: {
    //             api_key: "secret_" + randomUUID()
    //         }
    //     })
    // }
    if (!user?.stripeId) {
        if (!user?.phone) {
            return null
        }
        const customer = await stripe.customers.create({
            phone: user.phone
        })

        await db.update(schema.users).set({ stripeId: customer.id }).where(eq(schema.users.id, userId))
    }

    const user2 = await db.query.users.findFirst({ where: eq(schema.users.id, userId) })

    return user2!.stripeId
    // }
}
