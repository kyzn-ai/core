/**
 * @file Combines all of the configuration objects and re-exports them from one file for convenience.
 * @author Riley Barabash <riley@rileybarabash.com>
 */

//  Import each configuration module

import { env } from "~/env"
import { inviteCodes } from "./invite-codes"

//  Export all configurations in a monolithing `config` object

export const constants = {
    inviteCodes: (env.NODE_ENV ?? env.ENV) !== "production" ? inviteCodes.development : inviteCodes.production
}

// could be inviteCodes[env] with the correct beta/alpha/rc/stabe enum
