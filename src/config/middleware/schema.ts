/**
 * @file A Zod schema used to infer a type for the middleware config object.
 * @author Riley Barabash <riley@rileybarabash.com>
 */

import { z } from "zod"

//  Define a schema to validate the configuration data

export const middlewareConfigSchema = z.object({
    validateAPIRequest: z.object({
        paths: z.array(z.string())
    })
})

//  Infer and export an output type from the schema

export type MiddlewareConfig = z.infer<typeof middlewareConfigSchema>
