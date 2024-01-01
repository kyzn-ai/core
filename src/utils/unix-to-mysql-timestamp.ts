/**
 * @file Converts a Unix timestamp in seconds to a MySQL timestamp.
 * @author Riley Barabash <riley@rileybarabash.com>
 */

export interface UnixToMySQLTimestampParams {
    /**
     * The Unix timestamp to convert.
     */
    time: number
}

export function unixToMySQLTimestamp({ time }: UnixToMySQLTimestampParams): string {
    //  Convert to milliseconds, then a date

    const date: Date = new Date(time * 1000)

    //  Create the date component strings

    const year: number = date.getUTCFullYear()
    const month: string = `0${date.getUTCMonth() + 1}`.slice(-2)
    const day: string = `0${date.getUTCDate()}`.slice(-2)
    const hours: string = `0${date.getUTCHours()}`.slice(-2)
    const minutes: string = `0${date.getUTCMinutes()}`.slice(-2)
    const seconds: string = `0${date.getUTCSeconds()}`.slice(-2)

    //  Concatenate and return the components

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}
