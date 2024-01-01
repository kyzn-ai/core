/**
 * @file Combines all of the configuration objects and re-exports them from one file for convenience.
 * @author Riley Barabash <riley@rileybarabash.com>
 */

//  Import each configuration module

import { aliases } from "./aliases"
import { middlewareConfig } from "./middleware"

//  Export all configurations in a monolithing `config` object

export const config = {
    aliases,
    middleware: middlewareConfig
}
