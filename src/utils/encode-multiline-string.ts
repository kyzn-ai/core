export function encodeMultilineString(value: string): string {
    // Split the input by newlines, trim each line, and then join back with the \n escape sequence
    const lines = value.split(/\r?\n/)
    const trimmedLines = lines.map(line => line.trim())
    return trimmedLines.join("\n")
}
