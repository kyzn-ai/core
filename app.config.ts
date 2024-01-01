/**
 * @file Contains preferences for the application.
 * @author Riley Barabash <riley@rileybarabash.com>
 *
 * @remarks Why not make this a JSON file?
 *
 * JSON files don't enforce types, so we can't validate the configuration data against a schema. Creating a configuration in Typescript also allows us to create dynamic data, for when you need to fetch information or reference an existing property (e.g, using a getter).
 *
 * @todo: Maybe move the tagline and description to the `en` locale?
 * @todo P3 Relocate to "~/config" and/or a locale.
 */

import { type AppConfig } from "~/preferences"

//  Define build-time values for use throughout the application

const appConfig: AppConfig = {
    brand: {
        displayName: "KYZN",
        tagline: "Meet the Future You",
        description: "Communicate with an artificial personality derived from your internet presence, private thoughts, and personal preferences.",

        emails: {
            noReply: "no-reply@kyzn.app",
            support: "support@kyzn.app"
        },

        urls: {
            primary: "https://kyzn.app"
        }
    }
} as const

export default appConfig
