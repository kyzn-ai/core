/**
 * @file Formats the time difference between two dates.
 * @author Riley Barabash <riley@rileybarabash.com>
 *
 * @remarks WIP.
 *
 * Known issues:
 *
 * - When the scope is set to `[ "past" ]`, no result is returned because the initial duration operation always returns a positive value.
 *
 * @todo DEPRIORITIZED: Write some comprehensive tests, debug, and document (properly). Implement the logic for the newly created `as: DurationCalculation` option. Remove the ESLint ignore once complete.
 */

/* eslint-disable @typescript-eslint/no-unused-vars */

/**
 * @description Defines whether or not past and future durations are shown, returning zero for scopes that are not included.
 */
type DurationScope = "past" | "future"

/**
 * @description The date components to return in the formatted duration string.
 */
type DurationComponent = "years" | "months" | "days" | "hours" | "minutes" | "seconds"

/**
 * @description The duration date component values.
 */
interface DurationComponents {
    years?: number
    months?: number
    days?: number
    hours?: number
    minutes?: number
    seconds?: number
}

/**
 * @description The duration as the largest date component that is not zero.
 */
type AmalgamatedDurationComponentSet = "single"

/**
 * @description All of the date components that are not zero in decending order, each with a value relative to its parent component.
 */
type RecommendedDurationComponentSet = "auto"

/**
 * @description All of the date components in decending order, each with a value relative to its parent component.
 */
type CompleteDurationComponentSet = "all"

/**
 * @description A pre-configured set of date components.
 */
type DurationComponentSet = AmalgamatedDurationComponentSet | RecommendedDurationComponentSet | CompleteDurationComponentSet

/**
 * @description Uses the absolute date component value in the result.
 */
type AbsoluteDurationCalculationMethod = "absolute"

/**
 * @description Chooses between the absolute and relative calculation methods based on the components provided.
 */
type AutoDurationCalculationMethod = "auto"

/**
 * @description Uses the component's closest parent to derive its value.
 */
type RelativeDurationCalculationMethod = "relative"

/**
 * @description A method for calculating date component values.
 */
type DurationCalculationMethod = AbsoluteDurationCalculationMethod | RelativeDurationCalculationMethod | AutoDurationCalculationMethod

/**
 * @description Parameters for the `formatDuration` function.
 */
interface FormatDurationOptions {
    //  The target of the duration range

    to: Date

    //  The date that the target is relative to

    from?: Date

    //  The scopes to allow in the formatted duration string

    show?: DurationScope[]

    //  The date components to include in the formatted duration string

    include?: DurationComponent[] | DurationComponentSet

    //  The method to use to calculate the date component values

    as?: DurationCalculationMethod
}

/**
 * @description The result of the `formatDuration` function.
 */
interface FormatDurationResult {
    //  The formatted duration string

    result: string

    //  The numerical values of the date components

    components: DurationComponents

    //  Whether or not the duration has elapsed

    elapsed: boolean
}

/**
 * @remarks
 *
 * Components provided individually in a `durationComponent` array will be formatted in the order provided, each with a value relative to its parent component (when the calculation is set to auto).
 */
export function formatDuration({ to: target, from: relative = new Date(), show: scope = ["future"], include: components = "auto", as: calculation = "auto" }: FormatDurationOptions): FormatDurationResult {
    //  Get the duration in milliseconds, and determine if the duration is elapsed

    let duration = target.getTime() - relative.getTime()
    const elapsed = duration <= 0

    if (!(scope.includes("past") && scope.includes("future"))) {
        //  FIXME: If only the past is included, do not show future durations

        if (scope.includes("past")) {
            duration = Math.min(0, duration)
        }

        //  If only the future is included, do not show past durations

        if (scope.includes("future")) {
            duration = Math.max(0, duration)
        }

        //  If no scopes are specified, set the duration of zero

        if (!scope.length) {
            duration = 0
        }
    }

    //  Remove the minus sign

    duration = Math.abs(duration)

    //  Calculate the absolute duration components

    const absoluteSeconds = Math.floor(duration / 1000)
    const absoluteMinutes = Math.floor(absoluteSeconds / 60)
    const absoluteHours = Math.floor(absoluteMinutes / 60)
    const absoluteDays = Math.floor(absoluteHours / 24)
    const absoluteMonths = Math.floor(absoluteDays / 30)
    const absoluteYears = Math.floor(absoluteMonths / 12)

    //  Install the values into an map

    const absoluteDurationComponents = new Map<DurationComponent, number>([
        ["years", absoluteYears],
        ["months", absoluteMonths],
        ["days", absoluteDays],
        ["hours", absoluteHours],
        ["minutes", absoluteMinutes],
        ["seconds", absoluteSeconds]
    ])

    //  Derive a set of components set to use if not provided

    if (!Array.isArray(components)) {
        switch (components) {
            case "single":
                //  Find the first component that is not zero and put the key in the components array

                components = [[...absoluteDurationComponents.entries()].find(([_, value]) => value !== 0)?.[0] ?? "seconds"] as DurationComponent[]

                break

            case "auto":
                //  Find all components that are not zero and put the keys in the components array

                components = [...absoluteDurationComponents.entries()].filter(([_, value]) => value !== 0).map(([key, _]) => key)

                break

            case "all":
                //  Put all keys in the components array

                components = [...absoluteDurationComponents.entries()].map(([key, _]) => key)

                break
        }
    }

    //  Initialize a map for the final duration component values

    const durationComponents = new Map<DurationComponent, number>()

    // Convert the absolute duration components map to an array of entries

    const absoluteDurationComponentsEntries = [...absoluteDurationComponents.entries()]

    //  Define the divisor for each date component

    const durationComponentDivisors: DurationComponents = {
        years: 12,
        months: 30,
        days: 24,
        hours: 60,
        minutes: 60,
        seconds: 1000
    }

    //  Initialize a mutable divisor

    let compoundingDivisor = 1

    //  Evaluate the component set, iterating over the date components from largest to smallest

    absoluteDurationComponentsEntries.forEach(([key, value]) => {
        //  Multiply the exisiting divisor by the current divisor

        compoundingDivisor *= durationComponentDivisors[Array.from(durationComponents.keys()).pop()! as DurationComponent]!

        //  If the component is not included, skip it

        if (components.includes(key)) {
            //  If it is not the largest component, calculate and set the component result value to the absolute value modulo the compounded divisor, otherwise set it to the absolute value

            const componentValue: number = durationComponents.size !== 0 ? value % compoundingDivisor : value
            durationComponents.set(key, componentValue)

            //  Reset the divisor to one

            compoundingDivisor = 1
        }
    })

    //  Format the set as a string

    const result: string = components.reduce((accumulator, component, index) => {
        //  Get the result value of the corresponding key

        const value = durationComponents.get(component)

        //  Remove the "s" from the component if the value is one

        component = value === 1 ? (component.slice(0, -1) as DurationComponent) : component

        switch (true) {
            //  Append the value and component to the result string, including a comma and "and" as appropriate

            case index === 0:
                return `${value} ${component}`
            case index === components.length - 1:
                return `${accumulator} and ${value} ${component}`
            default:
                return `${accumulator}, ${value} ${component}`
        }
    }, "")

    //  Return the output

    return {
        result,
        components: Object.fromEntries(durationComponents) as DurationComponents,
        elapsed
    }
}
