/**
 * @file Parses a webhook request from the Twilio messaging API into a usable params object.
 * @author Riley Barabash <riley@rileybarabash.com>
 */

import { type NextRequest } from "next/server"
import { env } from "~/env"
import { SMSError } from "~/errors"

//  Shape of the incoming Twilio request

export interface DecodeParamsResult {
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

export interface DecodeParamsOptions {
    //  The incoming request

    req: NextRequest

    //  Logs the request params to the console

    debug?: boolean
}

//  Parses the incoming Twilio webhook request into usable params object

export async function decodeParams({ req, debug = env.NODE_ENV !== "production" }: DecodeParamsOptions): Promise<DecodeParamsResult> {
    try {
        //  Decode the incoming request and extract the search params

        const urlEncodedParams: string = await req.text()
        const searchParams: URLSearchParams = new URLSearchParams(urlEncodedParams)

        //  Convert the search params to an object

        const params: DecodeParamsResult = Array.from(searchParams.entries()).reduce((acc, [key, value]) => {
            acc[key as keyof DecodeParamsResult] = value
            return acc
        }, {} as DecodeParamsResult)

        //  Log the request if `debug` is enabled

        if (debug) console.log("DecodeParamsResult: ", params)

        //  Return the result

        return params
    } catch (error) {
        //  Rethrow the error

        throw new SMSError({
            name: "PARAMS_DECODE_ERROR",
            message: "Failed to parse the body of an incoming Twilio webhook request",
            cause: { error, request: await req.text() }
        })
    }
}
