import { temp } from "~/lib/flows"
import { api } from "~/trpc/server"
import { sendMessage, type DecodeParamsResult } from "~/lib/sms"
import { constants } from "~/constants"
import { createCheckoutLink, createCustomerIfNull, generateCustomerPortalLink, hasSubscription } from "../billing/stripe/helpers"
import { db, schema } from "~/server/db"
import { and, count, eq } from "drizzle-orm"
import { resend } from "../email"
import { createSenderIdentity, encodeMultilineString } from "~/utils"
// import { preferences } from "~/preferences"

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

    if (formattedContent.startsWith("@help")) {
        //  Return a message with all possible cmds

        return encodeMultilineString(
            `You can talk to KYZN using natural language, or use one of the following system commands:

            @about: You can find out more about KYZN here.
            @billing: View and modify your subscription details.
            @contact: Retrieve the contact card for KYZN.
            @help: Get information on how to use KYZN.
            @invite <CODE>: Get access to KYZN with an invite code.
            @support <MESSAGE>: Send a support request to our team.`
        )
    }

    if (formattedContent.startsWith("@about")) {
        //  Return a message with all possible cmds

        return `Here's more info on KYZN: ${"https://kyznai.notion.site/Welcome-609c87a56a9342bf941c504953f4874e?pvs=4"}`
    }

    if (formattedContent.startsWith("@support ")) {
        //  Extract code

        const message: string = content.substring("@support ".length)

        try {
            //  Send the verification email

            const response = await resend.emails.send({
                from: createSenderIdentity({ name: sender, email: "user@kyzn.app" }),
                to: "riley@rileybarabash.com",
                subject: "Support Request (SMS)",
                text: message
            })

            if (response.error) {
                throw new Error(`Failed to send support email to ${sender}`, { cause: response.error })
            }
        } catch (error) {
            console.error(error)
        }

        return "Support request received! You should get a response within 24 hours."
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

        if (!portalUrl) return "You don't have an active subscription."

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

    // console.log(aiResponseCount)

    //  if new AI user, respond with welcome message

    const isSubscribed = await hasSubscription({ userId })

    //  Catch all (the default response)

    if (isSubscribed || aiResponseCount < 10) {
        if (!isSubscribed && !aiResponseCount) {
            await sendMessage({
                content: encodeMultilineString(`Hello! You have 10 free messages to test the power of KYZN. Your journey starts now.
            
            To learn more, use the '@help' command.`),
                to: sender
            })
        }
        return await temp({ userId, content, number: sender })
    }

    return encodeMultilineString(
        `You don't have an active KYZN subscription.

        If you have an invite code, use '@invite <CODE>' to generate a payment link. Once subscribed, you will immediately receive full access to KYZN.
        
        If you would like access to KYZN, please submit an invite request with '@support <MESSAGE>' and someone will be in touch with you.`
    )
    // return await optIn.growthUpdates({ userId, content })
}
