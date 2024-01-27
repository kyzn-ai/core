/**
 * @file Receives inbound webhooks from Twilio for messages to my personal number (until it is ported).
 * @author Riley Barabash <riley@rileybarabash.com>
 */

import { env } from "~/env"
import { type DecodeParamsResult, composeResponse, decodeParams, sendMessage, validatePhone } from "~/lib/sms"
import { type NextResponse, type NextRequest } from "next/server"

export async function POST(req: NextRequest): Promise<NextResponse> {
    //  Decode the request

    const messageParams: DecodeParamsResult = await decodeParams({ req })

    //  Define the numbers I will be receiving messages to and sending from

    //  TextNow / Text+

    const myNumbers = ["+15873178927", "+17806663364"]

    //  If the incoming message is from me, forward it to the specified recipient

    if (myNumbers.includes(messageParams.From)) {
        //  Gets the encoded media URL of an MMS, and sends it back to me

        const rawEncodedMediaUrls: string[] | undefined = await getEncodedMediaUrls(messageParams)
        if (rawEncodedMediaUrls) return composeResponse({ content: rawEncodedMediaUrls.join(", ") })

        //  Split the incoming SMS into components

        const [recipient, message, encodedMediaUrls] = messageParams.Body.split(" | ")

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

        // if (!message) {
        //     return composeResponse({ content: "Please specify the message using <NUMBER> | <MESSAGE>." })
        // }

        //  Decode the media URLs

        const mediaUrls: string[] | undefined = encodedMediaUrls ? encodedMediaUrls.split(", ").map(encodedMediaUrl => Buffer.from(encodedMediaUrl, "base64url").toString("utf-8")) : undefined

        //  Send the message

        await sendMessage({
            to: recipient,
            from: "+16672220221",
            content: message ?? "",
            mediaUrl: mediaUrls
        })

        //  Generate a response and send it back to Twilio

        return composeResponse({ content: "Delivered" })
    } else {
        //  Get the media URLs if any

        const rawEncodedMediaUrls: string[] | undefined = await getEncodedMediaUrls(messageParams)
        const mediaUrls: string[] | undefined = rawEncodedMediaUrls ? rawEncodedMediaUrls.map(encodedMediaUrl => Buffer.from(encodedMediaUrl, "base64url").toString("utf-8")) : undefined

        //  If the incoming message is from someone else, forward it to each of my numbers

        for (const number of myNumbers) {
            await sendMessage({
                to: number,
                from: "+16672220221",
                content: `${messageParams.From}${messageParams.Body && " | " + messageParams.Body}`,
                mediaUrl: mediaUrls
            })
        }
    }

    //  Generate a response and send it back to Twilio

    return composeResponse({ content: "" })
}

async function getEncodedMediaUrls(messageParams: DecodeParamsResult): Promise<string[] | undefined> {
    //  Check if the incoming message is an MMS

    if (Number(messageParams.NumMedia) !== 0) {
        //  Define a var for the URLs

        const encodedMediaUrls: string[] = []

        //  Loop over the media URLs

        for (let index = 0; index < Number(messageParams.NumMedia); index++) {
            //  Get the URL

            // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
            const privateUrl: string = (messageParams as any)[`MediaUrl${index}`] as string

            //  Get the public URL

            const publicUrl = (await fetch(privateUrl, { headers: { Authorization: "Basic " + Buffer.from(env.TWILIO_SID + ":" + env.TWILIO_SECRET).toString("base64") } })).url

            //  Encode the URL and push it to the array

            encodedMediaUrls.push(Buffer.from(publicUrl).toString("base64url"))
        }

        //  Return the array

        return encodedMediaUrls
    } else return undefined
}
