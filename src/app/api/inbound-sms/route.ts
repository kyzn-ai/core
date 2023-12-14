/**
 * @file The endpoint that recieves inbound SMS message requests from Twilio.
 * @author Riley Barabash <riley@rileybarabash.com>
 *
 * @todo Store opt-ins in a database.
 * @todo Refactor `receiveAndReply` into individual lib functions for receiving and sending SMS messages.
 * @todo DEPRIORITIZED: Add a security check to only allow requests from Twilio.
 */

import receiveAndReply from "~/app/api/inbound-sms/receive-and-reply"
import { en } from "~/i18n/locales"
import { toTitleCase } from "~/utils"
import { type NextResponse, type NextRequest } from "next/server"

//  Handle incoming Twilio requests

export async function POST(req: NextRequest): Promise<NextResponse> {
    //  Reply to the sender

    return await receiveAndReply({
        request: req,
        createMessage: ({ Body: content, From: sender }) => handleOptIn({ content, sender }),
        debug: true
    })
}

//  Temporary opt-in flow

const handleOptIn = ({ content, sender }: { content: string; sender: string }): string => {
    if (content.toLowerCase().trim() !== "yes") {
        //  Log the inbound message (debug only)

        console.log(`New inbound SMS from ${sender}: ${content}`)

        //  Reply to the sender

        return en.preflight.optIn.opener({ firstName: toTitleCase(content.trim()) })
    } else {
        //  Log the opt-in candidate (debug only) — should be added to the database and sent as a notification to admin

        console.log(`New opt-in from ${sender}`)

        //  Return the response

        return en.preflight.optIn.confirmation
    }
}
