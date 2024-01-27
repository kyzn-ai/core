/**
 * @file Receives inbound webhooks from Twilio for messages to my personal number (until it is ported).
 * @author Riley Barabash <riley@rileybarabash.com>
 */

import { type DecodeParamsResult, composeResponse, decodeParams, sendMessage, validatePhone } from "~/lib/sms"
import { type NextResponse, type NextRequest } from "next/server"

export async function POST(req: NextRequest): Promise<NextResponse> {
    //  Decode the request

    const messageParams: DecodeParamsResult = await decodeParams({ req })

    //  Define the numbers I will be receiving messages to + sending with

    const myNumbers = ["+15873178927"]

    //  If the incoming message is from me, forward it to the specified recipient

    if (myNumbers.includes(messageParams.From)) {
        //  Split the incoming SMS into components

        const [recipient, message] = messageParams.Body.split(" | ")

        //  Validate the recipient

        if (!recipient) {
            return composeResponse({ content: "Please specify the recipient using <NUMBER> | <MESSAGE>." })
        }

        //  Validate the recipient number

        try {
            await validatePhone({ number: recipient })
        } catch (error) {
            return composeResponse({ content: "Invalid phone number. Please specify the number of the recipient using <NUMBER> | <MESSAGE>. Numbers need to be in E.164 format." })
        }

        //  Validate the message

        if (!message) {
            return composeResponse({ content: "Please specify the message using <NUMBER> | <MESSAGE>." })
        }

        //  Send the message

        await sendMessage({
            to: recipient,
            from: "+16672220221",
            content: message
        })
    } else {
        //  If the incoming message is from someone else, forward it to each of my numbers

        for (const number of myNumbers) {
            await sendMessage({
                to: number,
                from: "+16672220221",
                content: `${messageParams.From} | ${messageParams.Body}`
            })
        }
    }

    //  Generate a response and send it back to Twilio

    return composeResponse({ content: "" })
}
