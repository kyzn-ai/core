import { NextResponse, type NextRequest } from "next/server"
import { twiml } from "twilio"

//  Shape of the incoming Twilio request

type TwilioParams = {

    ToCountry: string,
    ToState: string,
    SmsMessageSid: string,
    NumMedia: string,
    ToCity: string,
    FromZip: string,
    SmsSid: string,
    FromState: string,
    SmsStatus: string,
    FromCity: string,
    Body: string,
    FromCountry: string,
    To: string,
    ToZip: string,
    NumSegments: string,
    MessageSid: string,
    AccountSid: string,
    From: string,
    ApiVersion: string

}

//  Define function signature

export async function recieveAndReply(

    request: NextRequest,
    action?: (params: TwilioParams) => string | void,
    debug?: boolean

): Promise<NextResponse>

//  Twilio request handling

export default async function recieveAndReply(

    request: NextRequest,
    action: (params: TwilioParams) => string | void = (params) => `Message received: "${params.Body}" from ${params.From}`,
    debug = false

): Promise<NextResponse> {

    try {

        //  Decode the incoming request body

        const encodedParams: string = await request.text()
        const searchParams = new URLSearchParams(encodedParams)

        //  Convert the search params to an object

        const params: TwilioParams = Array
            .from(searchParams.entries())
            .reduce((acc, [key, value]) => {

                acc[key as keyof TwilioParams] = value
                return acc

            }, {} as TwilioParams)

        //  Log the request if debug is enabled

        if (debug) { console.log("TwilioParams: ", params) }

        //  Construct a response

        const twimlResponse = new twiml
            .MessagingResponse()
            .message(action(params) ?? "")

        const response = twimlResponse.toString() as string

        //  Return the response

        return new NextResponse(response, {

            status: 200,
            headers: { "Content-Type": "text/xml", }

        })

    } catch (error) {

        //  Log the error

        console.error("Error handling Twilio request: ", error)

        //  Return an error response

        return new NextResponse("Internal Server Error", { status: 500 })

    }

}