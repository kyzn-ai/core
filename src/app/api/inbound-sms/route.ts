/**
 * @file The endpoint that recieves inbound SMS message requests from Twilio.
 * @author Riley Barabash <riley@rileybarabash.com>
 *
 * @todo DEPRIORITIZED: Add a security check to only allow requests from Twilio.
 */

import receiveAndReply from "~/app/api/inbound-sms/receive-and-reply"
import { type NextResponse, type NextRequest } from "next/server"

//  Handle incoming Twilio requests

export async function POST(req: NextRequest): Promise<NextResponse> {
    //  Reply to the sender

    return await receiveAndReply({
        request: req,
        createMessage: ({ Body: content, From: sender }) => {
            //  Template response

            return `Message received: "${content}" from ${sender}`
        },
        debug: true
    })
}
