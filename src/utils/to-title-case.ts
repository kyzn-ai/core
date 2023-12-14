/**
 * @file Applies a transformation on a string that converts it to title case.
 * @author Riley Barabash <riley@rileybarabash.com>
 */

export function toTitleCase(string: string): string {
    return string
        .split(" ")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(" ")
}
