/**
 * @file Validates the Authentication header of a request against a validation token.
 * @author Riley Barabash <riley@rileybarabash.com>
 */

import { env } from "~/env"
import { AuthError } from "~/errors"
import { type NextRequest } from "next/server"

export interface ValidateRequestOptions {
    /**
     * The request to validate.
     */
    req: NextRequest

    /**
     * The validation token to compare against. Defaults to the `INTERNAL_SECRET` environment variable.
     */
    against?: string
}

export function validateRequest({ req, against: validationToken = env.INTERNAL_SECRET }: ValidateRequestOptions): void {
    //  Extract the auth token from the request header

    const authToken: string | undefined = (req.headers.get("Authorization") ?? "").split("Bearer ").at(1)

    //  Compare the auth token against the validation token

    if (authToken && authToken === validationToken) return
    //  If the auth token does not match the validation token, throw an error
    else
        throw new AuthError({
            name: "INVALID_AUTH_TOKEN",
            message: "The token from the request header does not match the validation token",
            cause: { authToken }
        })
}
