/**
 * @file Creates and uses a Zod schema to validate and export preferences.
 * @author Riley Barabash <riley@rileybarabash.com>
 */

import preferences from "../app.config"
import { z } from "zod"

//  Define a schema to validate the configuration data

const appConfigSchema = z.object({
    brand: z.object({
        displayName: z.string(),
        tagline: z.string(),
        description: z.string(),

        emails: z.object({
            auth: z.string().email(),
            support: z.string().email()
        })
    })
})

//  Export a type inferred from the schema

export type AppConfig = z.infer<typeof appConfigSchema>

//  Validate the configuration data against the schema

const validatedConfig: AppConfig = appConfigSchema.parse(preferences)

//  Export the validated configuration for use throughout the application

export { validatedConfig as preferences }
