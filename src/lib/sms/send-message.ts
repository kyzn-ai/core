/**
 * @file Sends a plaintext message to a single person or a small group of recipients.
 * @author Riley Barabash <riley@rileybarabash.com>
 */

import { env } from "~/env"
import { SMSError } from "~/errors"
import { twilio } from "~/lib/sms"

export interface SendMessageOptions {
    //  The message to send

    content: string

    //  The sender's phone number in E.164 format — defaults to values defined in the ".env" file

    from?: string

    //  The recipient's phone number, or a group of numbers in E.164 format

    to: string | string[]

    /**
     * The URL of the media to attach to the message.
     */
    mediaUrl?: string | string[]
}

//  Returns the Twilio MessageInstance's SID, throwing an error if unsuccessful

export async function sendMessage({ content, from: sender = env.NODE_ENV === "production" ? env.TWILIO_NUMBER : env.TWILIO_TEST_NUMBER, to: recipients, mediaUrl }: SendMessageOptions): Promise<string[]> {
    //  If the recipients input is a string, convert it to an array

    if (typeof recipients === "string") recipients = [recipients]
    if (typeof mediaUrl === "string") mediaUrl = [mediaUrl]

    try {
        //  Map over the recipients and send each one individually

        const messageSids: string[] = await Promise.all(
            recipients.map(async recipient => {
                const message = await twilio.messages.create({
                    from: sender,
                    to: recipient,
                    body: content,
                    mediaUrl: mediaUrl as string[]
                })
                return message.sid
            })
        )

        //  Return the Message SIDs

        return messageSids
    } catch (error) {
        // If there was an error, throw an `SMSError`

        throw new SMSError({
            name: "MESSAGE_CREATION_FAILED",
            message: `Failed to send "${content}" to "${recipients.toString()}" from "${sender}"`,
            cause: error
        })
    }
}
