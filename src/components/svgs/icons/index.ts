/**
 * @file SVG icons.
 * @author Riley Barabash <riley@rileybarabash.com>
 */

//  Import every icon from each category

import * as Actions from "./actions"
import * as Social from "./social"

//  Exports a monolithic icons object

export const Icon = {
    ...Actions,
    ...Social
}
