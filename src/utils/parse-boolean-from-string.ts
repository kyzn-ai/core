export function parseBooleanFromString(value: string | null | undefined): boolean | undefined {
    if (!value) return undefined

    const lowerCaseValue = value.toLowerCase()
    if (lowerCaseValue === "true") {
        return true
    } else if (lowerCaseValue === "false") {
        return false
    } else {
        return undefined
    }
}
