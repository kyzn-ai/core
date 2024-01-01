/**
 * @file Validates a phone number using the Twilio Lookup API.
 * @author Riley Barabash <riley@rileybarabash.com>
 */

import { SMSError } from "~/errors"
import { twilio } from "~/lib/sms"

export interface ValidatePhoneOptions {
    /**
     * The number to validate.
     */
    number: string
}

//  Returns the phone number, or throws an error if unsuccessful

export async function validatePhone({ number }: ValidatePhoneOptions): Promise<string> {
    //  Query the Lookup API for the validation data

    const validationResult = await twilio.lookups.v2.phoneNumbers(number).fetch()

    if (validationResult.valid) return number
    else
        throw new SMSError({
            name: "INVALID_PHONE_NUMBER",
            message: `Validation failed on "${number}" via the Twilio Lookup API`,
            cause: validationResult.validationErrors
        })
}
