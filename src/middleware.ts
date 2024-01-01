/**
 * @file Next.js middleware that all routes are pre-processed with.
 * @author Riley Barabash <riley@rileybarabash.com>
 */

import { validateAPIRequest, validateTwilioWebhook } from "~/lib/middleware"
import { type NextRequest, type NextResponse } from "next/server"

export function middleware(request: NextRequest): NextResponse | undefined {
    //  Verify the Twilio webhook signature, returning 403 if verification fails

    const twilioWebhookValidationResponse: NextResponse | undefined = validateTwilioWebhook(request)
    if (twilioWebhookValidationResponse) return twilioWebhookValidationResponse

    //  Verify the auth token of the request, returning 403 if verification fails

    const apiValidationResponse: NextResponse | undefined = validateAPIRequest(request)
    if (apiValidationResponse) return apiValidationResponse
}
