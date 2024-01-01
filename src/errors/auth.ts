/**
 * @file An custom class for database auth-related errors.
 * @author Riley Barabash <riley@rileybarabash.com>
 */

import { CustomError } from "~/utils"

/**
 * The request made to the endpoint did not contain a valid authentication token.
 */
type InvalidAuthToken = "INVALID_AUTH_TOKEN"

//  Unionize the error names & instantiate a custom error class

type ErrorName = InvalidAuthToken
export class AuthError extends CustomError<ErrorName> {}
