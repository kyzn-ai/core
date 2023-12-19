/**
 * @file An custom class for database write-read related errors.
 * @author Riley Barabash <riley@rileybarabash.com>
 */

import { CustomError } from "~/utils"

/**
 * @description The provided values already exist in the database where only unique values are accepted.
 */
type DuplicateData = "DUPLICATE_DATA"

//  Unionize the error names & instantiate a custom error class

type ErrorName = DuplicateData
export class DatabaseError extends CustomError<ErrorName> {}
