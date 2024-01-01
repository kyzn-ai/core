/**
 * @file A helper for unwrapping tRPC errors on the client.
 * @author Riley Barabash <riley@rileybarabash.com>
 *
 * @todo: Do some reasearch into tRPC, and determine whether or not it is worth embracing the TRPC errors to some extent, instead of ignoring them entirely.
 */

import { type CustomError, type CustomErrorOptions } from "~/utils"
import { TRPCClientError } from "@trpc/client"
import { TRPCError } from "@trpc/server"

export function resolveTRPCError<ErrorName extends string, ErrorType extends CustomError<ErrorName>>(error: unknown, errorType?: new ({ ...params }: CustomErrorOptions<ErrorName>) => ErrorType): ErrorType | TRPCError | undefined {
    //  Checks if the error is an instance of `TRPCClientError`, then if the cause is a `TRPCError`, then if the cause of that is our custom error type if provided and returns the custom error, otherwise returns the inferred `TRPCError`

    if (error instanceof TRPCClientError)
        if (error.cause instanceof TRPCError)
            if (errorType && error.cause.cause instanceof errorType) return error.cause.cause
            else return error.cause

    //  Return undefined if the error couldn't be resolved to the expected type

    return undefined
}
