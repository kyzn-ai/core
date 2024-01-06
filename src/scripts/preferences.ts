import { toKebabCase } from "~/utils/to-kebab-case"

/**
 * @description The key of a `KVSet`.
 * @todo DEPRIORITIZED Implement better KV key system using types. Should conform to kebab-case`.
 * @see: https://t.ly/OfrIJ
 */
export type KVKey = string

export const KVValue = {
    String: "A" as string,
    Number: 1 as number,
    Boolean: true as boolean
} as const

/**
 * @description The value of a `KVSset`.
 */
export type KVValue = (typeof KVValue)[keyof typeof KVValue]

/**
 * @description All of the possible `KVSet` value types.
 */
export const kvValues: KVValue[] = Object.values(KVValue)

/**
 * @description A set containing a key-value pair.
 */
export type KVSet = [KVKey, KVValue]

/**
 * @description A set containing a key-value pair.
 */
export type KVMap = KVSet[]

/**
 * @description The object returned from `UseKVMap`.
 */
export interface UseKVMapResult {
    /**
     * @description The keys derived from the schema.
     */
    keys: KVKey[]

    /**
     * @description The keys derived from the schema.
     */
    values: KVValue[]
}

function introspectKVSchema<T>({ schema }: { schema: Record<string, unknown> }): KVMap {
    // Initialize `result` object to store the key-value pairs
    const result: KVMap = []

    // This is a helper function processSchema that recursively processes the schema object.
    function processSchema(obj: Record<string, unknown>, currentPath: string[] = []) {
        // A loop iterates over each property of the object
        for (const key in obj) {
            // Check if the object has a key
            if (obj.hasOwnProperty(key)) {
                // `fullPath` keeps track of the current path in the schema, and value is the current property value
                const fullPath = [...currentPath, key]
                const value = obj[key]

                if (typeof value === "object" && value !== null) {
                    // If the value is an object (excluding null), it recursively calls processSchema to explore nested objects
                    processSchema(value as Record<string, unknown>, fullPath)
                } else if (preferenceValues.includes(value as KVValue)) {
                    // If the value is an object and has properties 'String', 'Number', and 'Boolean', it is considered a KVValue.
                    // Its kebab-case key is added to the result object, and the value is added to the corresponding key
                    const kebabCaseKey = fullPath.map(toKebabCase).join("-")
                    result[kebabCaseKey] = value as T
                } else {
                    // If the value doesn't match the conditions for a KVValue, an error is thrown.
                    throw new Error(`Value at key "${fullPath.join(".")}" is not a valid KVValue.`)
                }
            }
        }
    }

    // The main function starts the processing by calling processSchema on the provided schema.
    // It returns the result object with keys and values.
    processSchema(schema)

    return result
}

export function useKVMap(map: KVMap): UseKVMapResult {
    //access [1] and flatmap
}

// /**
//  * @description Creates a union type from the elements of an array.
//  */
// type ArrayValueUnion<T extends readonly unknown[]> = T[number]

// /**
//  * @description
//  */
// function serializeKV<T>(opts: { key: T; value?: T }): { key: string; value: string | null } {
//     //  Convert the key to kebab case
//     //  Cast the value to a string and return the kebab key and the value

//     return { key: "replace", value: value ? String(value) : null }
// }

// /**
//  * @description
//  */
// function deserializeKV<T>(opts: { key: string; value: string; schema: unknown }): T {
//     //  Convert key from kebab-case to a series of keys to access the schema, using the available schema keys to infer the key when dealing with split identifiers (e.g., "standalone-model-id" needs to be inferred to ["standalone", "modelId"]). If unable to match/parse all of the keys successfully (e.g., a key doesn't exist on the schema) throw an error
//     //  Use the keys to access the schema, retrieving the `KVValue` value. If the the type of the value is not this, throw an error
//     //  Cast the value to the type of `KVValue` and somehow infer the return type successfully
//     return value as T
// }

// function introspectPrefs(props: { schema: unknown }): { keys: string[]; values: KVValue[] } {
//     //  Recursively search the schema object (or use a js function) to get all keys that have an accessable `KVValue` value, including those nested, and return every key to every value coverted to kebab-case in an array
//     //  Throw an error if any value is not a `KVValue`
//     //  Collect all of the possible value types in an array (e.g., [KVValue.Number, KVValue.Boolean])
//     //  Return the keys and values

//     return { keys: [], values: [] }
// }

//  Implementation example — all accessed values need to conform to a `KVValue` otherwise an error will be thrown in `useKV` and `parseKV`

const preferencesSchema = {
    defaults: {
        standalone: {
            modelId: KVValue.Number,
            testId: KVValue.Number
        },
        other: KVValue.Number
    },
    darkMode: KVValue.Boolean
} as const

//  Validating and converting a key/value pair for submission to a database

// const { key, value } = serializeKV({ key: preferencesSchema.defaults.standalone.modelId, value: 1234 })
// //  "defaults-standalone-model-id", "1234"
// console.log(key, value)

//  Re-typing the value when I retrieve it from the database

// const typedValue = deserializeKV({ key: "defaults-standalone-model-id", value: "1234", schema: preferencesSchema })
// //  1234
// console.log(typedValue)

//  Parsing the schema for all keys and a union type of the values

const { keys, values } = introspectPrefs({ schema: preferencesSchema })
//  {keys: [ "defaults-standalone-model-id", ... ], types: [] }
console.log(keys, values)

//
//
//

/**
 * @description Parses a schema for its keys and values, and returns them as a map of key-value pairs.
 */
// function introspectPrefs<T>({ schema }: { schema: Record<string, unknown> }): { keys: string[]; values: T[] } {
//     //  Initialize `keys` and `values` arrays to store the kebab-case keys and `KVValue` values

//     const keys: string[] = []
//     const values: T[] = []

//     //  This is a helper function processSchema that recursively processes the schema object. It takes an object (obj) and an optional array (currentPath) to keep track of the current path in the schema

//     function processSchema(obj: Record<string, unknown>, currentPath: string[] = []) {
//         // A loop iterates over each property of the object

//         for (const key in obj) {
//             //  Check if the object has a key

//             if (obj.hasOwnProperty(key)) {
//                 //  `fullPath` keeps track of the current path in the schema, and value is the current property value

//                 const fullPath = [...currentPath, key]
//                 const value = obj[key]

//                 if (typeof value === "object" && value !== null) {
//                     //  If the value is an object (excluding null), it recursively calls processSchema to explore nested objects

//                     processSchema(value as Record<string, unknown>, fullPath)
//                 } else if (KVValues.includes(value as KVValue)) {
//                     //  If the value is an object and has properties 'String', 'Number', and 'Boolean', it is considered a KVValue. Its kebab-case key is added to keys, and the value is added to values

//                     // if (value === typeof KVValue.Boolean) values.push(value as KVValue)
//                     // if (value === KVValue.Number) values.push(value as KVValue)
//                     // if (value === KVValue.String) values.push(value as KVValue)

//                     keys.push(fullPath.join("-").toLowerCase())
//                     values.push(value as T)
//                 } else {
//                     //  If the value doesn't match the conditions for a KVValue, an error is thrown.

//                     throw new Error(`Value at key "${fullPath.join(".")}" is not a valid KVValue.`)
//                 }
//             }
//         }
//     }

//     //  The main function starts the processing by calling processSchema on the provided schema. It returns an object with keys and values.

//     // Start processing the schema
//     processSchema(schema)

//     return { keys, values }
// }

// function segmentToKebabCase(segment: string): string {
//     return segment.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase()
// }

// Example usage:
// const introspectedPrefs = introspectPrefs({ schema: preferencesSchema })
// console.log(introspectedPrefs.keys, introspectedPrefs.values)
console.log(introspectPrefs({ schema: preferencesSchema }))

// const temp = [KVValue.Boolean]

// type KVValuesA = ArrayValueUnion<typeof introspectedPrefs.values>

// console.warn("singleHandeddoozyMamaBroand" as KebabCase<string>)
