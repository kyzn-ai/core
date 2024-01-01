/**
 * @file The webhook endpoint that recieves inbound SMS message requests from Twilio.
 * @author Riley Barabash <riley@rileybarabash.com>
 */

import { coordinateResponse } from "~/lib/flows"
import { type DecodeParamsResult, composeResponse, decodeParams } from "~/lib/sms"
import { type NextResponse, type NextRequest } from "next/server"

export async function POST(req: NextRequest): Promise<NextResponse> {
    //  Decode the request

    const messageParams: DecodeParamsResult = await decodeParams({ req })

    //  Process the message params and produce a response

    const response: string | null = await coordinateResponse(messageParams)

    //  Generate a response and send it back to Twilio

    return composeResponse({ content: response })
}
