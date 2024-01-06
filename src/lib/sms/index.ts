/**
 * @file Initializes and exports a shared `Twilio` instance, and re-exports all Twilio helpers from one file for convenience.
 * @author Riley Barabash <riley@rileybarabash.com>
 */

import { env } from "~/env"
import { Twilio } from "twilio"

export const twilio: Twilio = new Twilio(env.TWILIO_SID, env.TWILIO_SECRET)

export * from "./compose-response"
export * from "./decode-params"
export * from "./send-message"
export * from "./validate-phone"
