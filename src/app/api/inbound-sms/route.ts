/**
 * @file The endpoint that recieves inbound SMS message requests from Twilio.
 * @author Riley Barabash <riley@rileybarabash.com>
 *
 * @todo DEPRIORITIZED: Add a security check to only allow incoming requests from Twilio.
 */

import receiveAndReply, { type TwilioParams } from "~/app/api/inbound-sms/receive-and-reply"
import { optIn } from "~/lib/flows"
import { api } from "~/trpc/server"
import { type NextResponse, type NextRequest } from "next/server"

//  Handle incoming Twilio requests

export async function POST(req: NextRequest): Promise<NextResponse> {
    //  Generate a response and send it back to Twilio

    return await receiveAndReply({
        request: req,
        createMessage: responseCoordinator,
        debug: true
    })
}

//  Manages the use of response flows

const responseCoordinator = async ({ Body: content, From: sender, ..._ }: TwilioParams): Promise<string> => {
    //  Get the sender's user ID, creating a new user if they don't exist & storing the returned ID

    const { id: userId } = (await api.users.get.query({ phone: sender })) ?? (await api.users.create.mutate({ phone: sender }))

    //  TODO: Switch over the available flows, choosing the appropriate one based on the sender's response & the most recent flow (get the `name` column from the most recent row in the `flows` table that matches the `userId`)

    /*

    const flowName: string = await api.flows.getLatestName.query({ userId })

    switch (content.toLowerCase().trim()) {

        //  If the sender resonds with "ai", opt them in to growth updates

        case "ai": break

    }
    
    */

    //  Catch all (the default response)

    return await optIn.growthUpdates({ userId, content })
}
