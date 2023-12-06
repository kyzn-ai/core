/**
 * @file Creates and uses a Zod schema to validate and export preferences.
 * @author Riley Barabash <riley@rileybarabash.com>
 */

import appConfig from "../app.config"
import { createDisplayUrl } from "~/utils"
import { z } from "zod"

//  Define a schema to validate the configuration data

const appConfigSchema = z.object({
    brand: z.object({
        displayName: z.string(),
        tagline: z.string(),
        description: z.string(),

        emails: z.object({
            noReply: z.string().email(),
            support: z.string().email()
        }),
        urls: z.object({
            primary: z.string().transform(value => createDisplayUrl({ from: value }))
        })
    })
})

//  Export an input type inferred from the schema

export type AppConfig = z.input<typeof appConfigSchema>

//  Infer an output type from the schema (equivalent to `z.output`)

type Preferences = z.infer<typeof appConfigSchema>

//  Validate the configuration data against the schema, and export for use throughout the application

export const preferences: Preferences = appConfigSchema.parse(appConfig)
