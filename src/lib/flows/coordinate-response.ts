import { temp } from "~/lib/flows"
import { api } from "~/trpc/server"
import { sendMessage, type DecodeParamsResult } from "~/lib/sms"
import { constants } from "~/constants"
import { createCheckoutLink, createCustomerIfNull, generateCustomerPortalLink, hasSubscription } from "../billing/stripe/helpers"
import { db, schema } from "~/server/db"
import { and, count, eq, sql } from "drizzle-orm"
import { resend } from "../email"
import { createSenderIdentity } from "~/utils"
import { preferences } from "~/preferences"

//  Manages the use of response flows

export const coordinateResponse = async ({ Body: content, From: sender, ..._ }: DecodeParamsResult): Promise<string | null> => {
    //  Get the sender's user ID, creating a new user if they don't exist & storing the returned ID

    const { id: userId } = (await api.users.get.query({ phone: sender })) ?? (await api.users.create.mutate({ phone: sender }))

    //  TODO: Switch over the available flows, choosing the appropriate one based on the sender's response & the most recent flow (get the `name` column from the most recent row in the `flows` table that matches the `userId`)

    // const flowName: string = await api.flows.getLatestName.query({ userId })

    // get number of messages

    const { value: aiResponseCount } = (
        await db
            .select({ value: count() })
            .from(schema.messages)
            .where(and(eq(schema.messages.userId, userId), eq(schema.messages.role, "assistant")))
    )[0]!

    const formattedContent: string = content.toLowerCase().trim()

    if (formattedContent.startsWith("@help ")) {
        //  Extract code

        const message: string = content.substring("@help ".length)

        try {
            //  Send the verification email

            const response = await resend.emails.send({
                from: createSenderIdentity({ name: "User", email: "user@kyzn.app" }),
                to: "riley@rileybarabash.com",
                subject: `'@help' request from ${sender}`,
                text: message
            })

            if (response.error) {
                throw new Error(`Failed to send verification email to ${sender}`, { cause: response.error })
            }
        } catch (error) {
            console.error(error)
        }

        return "Support request recieved! You should receive a response within 24 hours."
    }

    if (formattedContent.startsWith("@contact")) {
        //  Send the vcard

        await sendMessage({ content: "Here is the contact card for KYZN:", to: sender, mediaUrl: "https://kyzn.app/vcards/kyzn.vcf" })

        return null
    }

    if (formattedContent.startsWith("@billing")) {
        //  Extract code

        //  Create the customer if null

        const customerId = await createCustomerIfNull({ userId })

        const portalUrl: string | undefined = await generateCustomerPortalLink(customerId!)

        if (!portalUrl) return "You don't have any active subscriptions."

        return `Manage your subscription here: ${portalUrl}`
    }

    if (formattedContent.startsWith("@invite ")) {
        //  Extract code

        const inviteCode: string = formattedContent.substring("@invite ".length)

        //  Validate code, sending an "invalid invite code" response if it doesn't exist

        if (constants.inviteCodes.hasOwnProperty(inviteCode)) {
            //  Create the customer if null

            const customerID = await createCustomerIfNull({ userId })

            //  Get the rpice id
            const priceId: string = constants.inviteCodes[inviteCode]!

            // Use the priceID for further processing (e.g., creating a Stripe link)

            const checkoutURL: string = await createCheckoutLink(customerID!, priceId)

            return `Here's the link: ${checkoutURL}`

            // send link via text
        } else {
            // Handle the case when the extracted code is not found in the discount codes object

            // send an "invalid discount code" response

            return `'${inviteCode.toUpperCase()}' is not a valid invite code.`
        }

        //  If it does exist, create them as a customer, generate the stripe link
    }

    console.log(aiResponseCount)

    //  if new AI user, respond with welcome message

    const isSubscribed = await hasSubscription({ userId })

    //  Catch all (the default response)

    if (isSubscribed || aiResponseCount < 10) {
        if (!isSubscribed && !aiResponseCount) {
            await sendMessage({ content: "Hello! You have 10 free messages to test the power of KYZN. Your journey starts now.", to: sender })
        }
        return await temp({ userId, content, number: sender })
    }

    return "You don't have an active KYZN subscription. \n\nMessage '@rileybarabash' on Instagram for an invite code, then use \"@invite <YOUR_CODE>\" to generate a payment link. \n\nOnce subscribed, you will immediately recieve full access to KYZN."
    // return await optIn.growthUpdates({ userId, content })
}
