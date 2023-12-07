/**
 * @file Combines the "clsx" and "twMerge" libraries to create a class string based on the inputs.
 * @author Riley Barabash <riley@rileybarabash.com>
 */

import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

//  Uses `clsx` to construct a className string from the input, and then uses `twMerge` to merge the resulting classes

export const cn = (...input: ClassValue[]) => twMerge(clsx(input))
