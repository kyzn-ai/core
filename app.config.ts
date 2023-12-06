/**
 * @file Contains preferences for the application.
 * @author Riley Barabash <riley@rileybarabash.com>
 *
 * @remarks Why not make this a JSON file?
 *
 * JSON files don't enforce types, so we can't validate the configuration data against a schema. Creating a configuration in Typescript also allows us to create dynamic data, for when you need to fetch information or reference an existing property (e.g, using a getter).
 */

import { type AppConfig } from "~/preferences"

//  Define build-time values for use throughout the application

const appConfig: AppConfig = {
    brand: {
        displayName: "AMNESIA",
        tagline: "Meet the Future You",
        description: "Communicate with an artificial personality derived from your internet presence, private thoughts, and personal preferences.",

        emails: {
            auth: "auth@amnesia.onambrosia.app",
            support: "support@amnesia.onambrosia.app"
        },

        urls: {
            primary: "https://amnesia.onambrosia.app"
        }
    }
} as const

export default appConfig
