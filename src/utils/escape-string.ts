// TODO P3 implement easily changeable defaults

// const defaultOptions: EncodeOptions = {
//     newLines: { escape: true },
//     spaces: { escape: false }
// }

export interface EncodeOptions {
    newLines?: {
        escape?: boolean
    }
    spaces?: {
        escape?: boolean
        afterNewLine?: {
            remove?: {
                count?: number
            }
            add?: {
                count?: number
            }
        }
    }
}

// Extending code options to include before.
// Extending code options to include before.
// Space removal and adding

export function escapeString(value: string, options?: EncodeOptions): string {
    // Set default values if not provided in the options
    const escapeNewLines = options?.newLines?.escape ?? true // Default to true
    const escapeSpaces = options?.spaces?.escape ?? false // Default to true

    // Split the input by newlines
    const lines = value.split(/\r?\n/)

    const processedLines = lines.map((line, index) => {
        if (index > 0) {
            // Skip the first line
            // Handle leading space removal
            // if (options?.spaces?.afterNewLine?.remove?.count !== undefined) {
            const countToRemove = options?.spaces?.afterNewLine?.remove?.count ?? 999
            line = line.replace(new RegExp(`^ {0,${countToRemove}}`), "")
            // }

            // Handle leading space addition
            if (options?.spaces?.afterNewLine?.add?.count !== undefined) {
                const countToAdd = options.spaces.afterNewLine.add.count
                line = " ".repeat(countToAdd) + line
            }
        }
        return line
    })

    // Join back with the \n escape sequence if escaping new lines
    let result = escapeNewLines ? processedLines.join("\\n") : processedLines.join("\n")

    // Escape spaces if enabled
    if (escapeSpaces) {
        result = result.replace(/ /g, "\\s")
    }

    return result
}

// Example usage:
// console.log(
//     encodeString(
//         `Hello! You have 10 free messages to test the power of KYZN. Your journey starts now.

//         To learn more, use the '@help' command.

//          Space before newline test`
//         // { spaces: { afterNewLine: { remove: { count: 8 } } } }
//     )
// )

// Newlines and spaces should be escaped by default
