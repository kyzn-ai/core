/**
 * @file Re-exports all opt-in flows from one file for convenience.
 * @author Riley Barabash <riley@rileybarabash.com>
 */

//  Import all flows

import * as growthUpdates from "./growth-updates"

//  Exports all flows in a monolithic `optIn` object

export const optIn = {
    ...growthUpdates
}