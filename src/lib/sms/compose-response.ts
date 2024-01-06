/**
 * @file Constructs a response for Twilio from an incoming webhook request.
 * @author Riley Barabash <riley@rileybarabash.com>
 */

import { NextResponse } from "next/server"
import { twiml } from "twilio"
import type MessagingResponse from "twilio/lib/twiml/MessagingResponse"

export interface ComposeResponseParams {
    //  The message to return

    content: string | null
}

//  Create and return a TwiML response from the message content

export async function composeResponse({ content }: ComposeResponseParams): Promise<NextResponse> {
    //  Construct a response, and stringify the XML

    const twimlResponse: MessagingResponse.Message = new twiml.MessagingResponse().message(content ?? "")
    const response: string = twimlResponse.toString() as string

    //  Return the response

    return new NextResponse(response, {
        status: 200,
        headers: { "Content-Type": "text/xml" }
    })
}
