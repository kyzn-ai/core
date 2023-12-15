/**
 * @file The endpoint that recieves inbound SMS message requests from Twilio.
 * @author Riley Barabash <riley@rileybarabash.com>
 *
 * @todo DEPRIORITIZED: Add a security check to only allow incoming requests from Twilio.
 */

import receiveAndReply, { type TwilioParams } from "~/app/api/inbound-sms/receive-and-reply"
import { type NextResponse, type NextRequest } from "next/server"
import { api } from "~/trpc/server"

//  Handle incoming Twilio requests

export async function POST(req: NextRequest): Promise<NextResponse> {
    //  Reply to the sender

    return await receiveAndReply({
        request: req,
        createMessage: responseCoordinator,
        debug: true
    })
}

//  Manages the use of response campaigns

const responseCoordinator = async (params: TwilioParams): Promise<string> => {
    //  The default response

    return await growthUpdates(params)
}

//  The campaign flow for opting in to growth updates

const growthUpdates = async ({ From: sender }: TwilioParams): Promise<string> => {
    //  Attempt to get the user's ID

    const id: string | undefined = await api.users.getId.query({ phoneNumber: sender })

    //  Create a new user if they don't exist and return their ID, otherwise return the original ID

    if (!id) return `New user: ${await api.users.create.mutate({ phoneNumber: sender })}`
    else return `Existing user: ${id}`

    //  Create a campaign, store the campaign step, use the campaign step to determine the response, use the response to update the campaign and user data...
}
