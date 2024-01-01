/**
 * @file Validates the signature of an incoming Twilio webhook request.
 * @author Riley Barabash <riley@rileybarabash.com>
 */

import { env } from "~/env"
import { SMSError } from "~/errors"
import { type NextRequest, NextResponse } from "next/server"
import twilio from "twilio"

export function validateTwilioWebhook(request: NextRequest): NextResponse | undefined {
    //  Validation by Twilio for requests to the inbound SMS endpoint

    if (request.nextUrl.pathname.startsWith("/api/sms")) {
        try {
            //  Attempt to validate the webhook

            twilio.webhook({}, env.TWILIO_SECRET)
        } catch (error) {
            //  Return the forbidden response code and an error message

            return new NextResponse(
                JSON.stringify(
                    new SMSError({
                        name: "INVALID_SIGNATURE",
                        message: "Twilio failed to validate the incoming request",
                        cause: error
                    })
                ),
                { status: 403 }
            )
        }
    }
}
