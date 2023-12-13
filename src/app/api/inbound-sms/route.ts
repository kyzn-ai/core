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

            if (content.toLowerCase().trim() === "yes") {
                console.log(`New opt-in from ${sender}`)
                return "Thank you! I will send you an invite when it's ready."
            } else {
                console.log(`New inbound SMS from ${sender}: ${content}`)
                return `Hey ${toTitleCase(content.toLowerCase().trim())}! My name is Riley, and I’m an independent software dev. I’m building an app called AMNESIA that will allow you to communicate with the future version of yourself via SMS (it’s powered by the world’s leading AI). My goal with AMNESIA is to help you reach your truest potential and achieve your goals by providing motivation, helpful insights, secondary accountability, and infinite knowledge at your fingertips.\n\nIt’s not finished yet, but when it is it will be free to get started.\n\nCan I send you an invite when it’s ready?\n\nReply with “YES” to confirm.`
            }
        },
        debug: true
    })
}

function toTitleCase(str: string) {
    return str.replace(/\w\S*/g, function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    })
}
