/**
 * @file Applies a transformation on a string that converts it to title case.
 * @author Riley Barabash <riley@rileybarabash.com>
 */

export function toKebabCase(string: string): string {
    // Replaces underscores and dashes followed by a alphanumeric character with a hyphen, and uppercases the next character

    string = string.replace(/[-._ ]+([a-zA-Z0-9])/g, (_, char) => `-${(char as string).toUpperCase()}`)

    //  Inserts a hyphen between lowercase and uppercase letters or digits

    string = string.replace(/([a-z])([A-Z0-9])/g, "$1-$2")

    //  Inserts a hyphen between uppercase letters and digits

    string = string.replace(/([A-Z])([0-9])/g, "$1-$2")

    //  Inserts a hyphen between digits and uppercase letters

    string = string.replace(/([0-9])([A-Z])/g, "$1-$2")

    //  Inserts a hyphen between digits and lowercase letters

    string = string.replace(/([0-9])([a-z])/g, "$1-$2")

    //  Inserts a hyphen before the last character in a sequence of capital letters

    string = string.replace(/([A-Z]+)([A-Z][a-z])/g, "$1-$2")

    //  Returns the string in lowercase

    return string.toLowerCase()
}
