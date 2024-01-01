/**
 * @file Validates the auth token of matched API routes against a secret.
 * @author Riley Barabash <riley@rileybarabash.com>
 */

import { config } from "~/config"
import { validateRequest } from "~/utils"
import { type NextRequest, NextResponse } from "next/server"

export function validateAPIRequest(request: NextRequest): NextResponse | undefined {
    //  Match the paths provided in the config

    if (config.middleware.validateAPIRequest.paths.includes(request.nextUrl.pathname)) {
        try {
            //  Attempt to validate the auth header

            validateRequest({ req: request })
        } catch (error) {
            //  If the validation fails, return a 403

            return new NextResponse(JSON.stringify(error), { status: 403 })
        }
    }
}
