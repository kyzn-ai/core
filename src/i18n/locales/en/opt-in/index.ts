/**
 * @file Re-exports all localizable opt-in content from one file for convenience.
 * @author Riley Barabash <riley@rileybarabash.com>
 */

//  Import all opt-in copy

import * as growthUpdates from "./growth-updates"

//  Exports all copy in a monolithic `optIn` object

export const optIn = {
    ...growthUpdates
}
