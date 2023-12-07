/**
 * @file Accepts and transforms a NextRequest from the Twilio messaging API, and returns a NextResponse.
 * @author Riley Barabash <riley@rileybarabash.com>
 *
 * @todo DEPRIORITIZED: Abstract into a more versatile utility that can be used for different applications. Maybe move to "~/lib"?
 */

import { NextResponse, type NextRequest } from "next/server"
import { twiml } from "twilio"

//  Shape of the incoming Twilio request

interface TwilioParams {
    ToCountry: string
    ToState: string
    SmsMessageSid: string
    NumMedia: string
    ToCity: string
    FromZip: string
    SmsSid: string
    FromState: string
    SmsStatus: string
    FromCity: string
    Body: string
    FromCountry: string
    To: string
    ToZip: string
    NumSegments: string
    MessageSid: string
    AccountSid: string
    From: string
    ApiVersion: string
}

//  Define function signature

interface receiveAndReplyOptions {
    //  The incoming request

    request: NextRequest

    //  The response message

    createMessage?: (params: TwilioParams) => string | void

    //  Logs the request params to the console

    debug?: boolean
}

//  Twilio request handling

export default async function receiveAndReply({ request, createMessage = (params): string => `Message received: "${params.Body}" from ${params.From}`, debug = false }: receiveAndReplyOptions): Promise<NextResponse> {
    try {
        //  Decode the incoming request body

        const encodedParams: string = await request.text()
        const searchParams = new URLSearchParams(encodedParams)

        //  Convert the search params to an object

        const params: TwilioParams = Array.from(searchParams.entries()).reduce((acc, [key, value]) => {
            acc[key as keyof TwilioParams] = value
            return acc
        }, {} as TwilioParams)

        //  Log the request if debug is enabled

        if (debug) {
            console.log("TwilioParams: ", params)
        }

        //  Construct a response

        const twimlResponse = new twiml.MessagingResponse().message(createMessage(params) ?? "")

        const response = twimlResponse.toString() as string

        //  Return the response

        return new NextResponse(response, {
            status: 200,
            headers: { "Content-Type": "text/xml" }
        })
    } catch (error) {
        //  Log the error

        console.error("Error handling Twilio request: ", error)

        //  Return an error response

        return new NextResponse("Internal Server Error", { status: 500 })
    }
}
