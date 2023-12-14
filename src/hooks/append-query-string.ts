/**
 * @file Gets the current search params, appends a param, and returns the new search params as a string.
 * @author Riley Barabash <riley@rileybarabash.com>
 *
 * @todo DEPRIORITIZED: Allow multiple key/value pairs to be appended at once.
 */

import { type ReadonlyURLSearchParams, useSearchParams } from "next/navigation"
import { useCallback } from "react"

export const useAppendQueryString = () => {
    const searchParams: ReadonlyURLSearchParams = useSearchParams()

    //  Create a new search params string by merging the current query string with a new key/value pair

    const appendQueryString = useCallback(
        //  The callback to memoize — will update if the search params change

        (name: string, value: string) => {
            //  Create a new search params object, and set the new key/value pair

            const params: URLSearchParams = new URLSearchParams(searchParams)
            params.set(name, value)

            //  Return the stringified search params

            return params.toString()
        },
        [searchParams]
    )

    return appendQueryString
}
