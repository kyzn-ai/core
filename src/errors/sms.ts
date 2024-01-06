/**
 * @file An custom class for SMS-related errors.
 * @author Riley Barabash <riley@rileybarabash.com>
 */

import { CustomError } from "~/utils"

/**
 * Twilio failed to create the message.
 */
type MessageCreationFailed = "MESSAGE_CREATION_FAILED"

/**
 * Failed to parse the incoming Twilio webhook request.
 */
type ParamsDecodeError = "PARAMS_DECODE_ERROR"

/**
 * The incoming webhook request could not be validated by Twilio.
 */
type InvalidSignature = "INVALID_SIGNATURE"

/**
 * The provided phone number is invalid.
 */
type InvalidPhoneNumber = "INVALID_PHONE_NUMBER"

//  Unionize the error names & instantiate a custom error class

type ErrorName = MessageCreationFailed | ParamsDecodeError | InvalidSignature | InvalidPhoneNumber

export class SMSError extends CustomError<ErrorName> {}
