/**
 * @file Fixed values that control the operation of middleware functions.
 * @author Riley Barabash <riley@rileybarabash.com>
 */

//  Import the config schema

import { type MiddlewareConfig } from "."

//  Define the middleware configuration

export const middlewareConfig: MiddlewareConfig = {
    validateAPIRequest: {
        //  The API paths that should be protected

        paths: ["/api/openai/assistant/poll"]
    }
}

//  Re-export the schema

export * from "./schema"
