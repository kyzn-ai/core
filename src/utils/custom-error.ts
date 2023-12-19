/**
 * @file Defines an error class to use as a base for constructing custom application errors.
 * @author Riley Barabash <riley@rileybarabash.com>
 */

export interface CustomErrorOptions<ErrorName> {
    //  The name of the error

    name: ErrorName

    //  A detailed description of the error

    message: string

    //  Additional values related to the error

    cause?: unknown
}

export class CustomError<ErrorName extends string> extends Error {
    name: ErrorName
    message: string
    cause: unknown

    constructor({ name, message, cause }: CustomErrorOptions<ErrorName>) {
        super()
        this.name = name
        this.message = message
        this.cause = cause
    }
}
