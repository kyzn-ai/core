/**
 * @file Re-exports all SVGs from one file for convenience.
 * @author Riley Barabash <riley@rileybarabash.com>
 */

//  Export independent SVG category objects

export * from "./icons"

//  Import every SVG from each category

import * as Brand from "./brand"
import * as Grid from "./grid"

//  Exports a monolithic SVG object

export const SVG = {
    ...Brand,
    ...Grid
}
