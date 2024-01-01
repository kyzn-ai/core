/**
 * @file A lightweight but versatile key-value helper library for working with serializable KV pairs in a typed environment.
 * @author Riley Barabash <riley@rileybarabash.com>
 *
 * @todo P4 Upgrade better KV key system using types.
 * @see: https://t.ly/OfrIJ
 */

import { type Brand } from "~/utils/brand"
import { toKebabCase } from "~/utils/to-kebab-case"
import { CustomError } from "~/utils/custom-error"

/**
 * @description There was an error parsing the KV schema.
 */
type SchemaParseFailure = "SCHEMA_PARSE_FAILURE"

/**
 * @description A union of all KV-related error labels.
 */
type KVErrorName = SchemaParseFailure

/**
 * @description An custom error class for KV-related errors.
 */
export class KVError extends CustomError<KVErrorName> {}

/**
 * @description The key of a `KVSet`.
 * @todo P4 Should conform to kebab-case`.
 */
export type KVKey = string

/**
 * @description All of the possible `KVSet` value types and their respective type labels.
 */
export const kvValues = {
    string: "A" as string,
    number: 1 as number,
    boolean: true as boolean
} as const satisfies Record<string, unknown>

/**
 * @description The type of a `KVSet` value.
 */
export type KVValue = (typeof kvValues)[keyof typeof kvValues]

/**
 * @description The type of a serialized `KVSet` value.
 */
export type KVSerializedValue = string

/**
 * @description The label of a `KVSet` value type.
 */
export type KVType = keyof typeof kvValues

/**
 * @description All of the possible `KVSet` value type labels.
 */
export const kvTypes: Array<KVType> = Object.keys(kvValues) as KVType[]

/**
 * @description A set containing a key-value pair.
 */
export type KVSet = [KVKey, KVValue]

/**
 * @description A set containing a serialized key-value pair.
 */
export type KVSerializedSet = [KVKey, KVSerializedValue]

/**
 * @description A tuple that stores the value type and default in a `KVSchema` definition.
 */
export type KVSchemaValue = Brand<[defaultValue: KVValue | null, valueType: KVType], "KVValue">

/**
 * @description The `string` value type for a `KVSchema`.
 */
export const KVString: KVSchemaValue = [null, "string"]

/**
 * @description The `number` value type for a `KVSchema`.
 */
export const KVNumber: KVSchemaValue = [null, "number"]

/**
 * @description The `boolean` value type for a `KVSchema`.
 */
export const KVBoolean: KVSchemaValue = [null, "boolean"]

/**
 * @description A schema that defines a hierarchy of key-value pairs.
 * @Remarks The object key path to the value defines the `KVKey`, and will be translated into kebab-case. To define a value, use an expected primitive value type if specifying a default (e.g., "default-value" or false), use a predefined `KVSchemaValue` type to default the value to `null`, or for greater control, use `[defaultValue, "valueType"] as KVSchemaValue` to define your own default and type.
 */
export interface KVSchema {
    //  Explicity specifying the index signature enables the interface to reference itself

    [key: string]: KVValue | KVSchemaValue | KVSchema
}

/**
 * @description A key-value set containing the key, default value, and the type label.
 */
export interface KVSchemaSet {
    /**
     * @description The key derived from the schema.
     */
    key: KVKey

    /**
     * @description The default value derived from the schema.
     */
    default: KVValue | null

    /**
     * @description The value type label derived from the schema.
     */
    type: KVType
}

/**
 * @description A collection of all of the `KVSchemaSet` entries derived from a `KVSchema`.
 */
export type KVSchemaMap = KVSchemaSet[]

/**
 * @description Parses a `KVSchema`, and returns a `KVSchemaMap`.
 */
export function introspectKVSchema({ schema }: { schema: KVSchema }): KVSchemaMap {
    //  Initialize an array to store the `KVSchemaSet` entries

    const schemaSets: KVSchemaMap = []

    /**
     * @description A helper function that recursively parses each level of the schema and pushes the result to the `schemaSets` array.
     */
    function processSchema(schema: KVSchema, { currentPath = [] }: { currentPath?: string[] }) {
        //  Iterate over each key in the schema

        for (const schemaKey in schema) {
            //  Check if the object has a key

            if (schema.hasOwnProperty(schemaKey)) {
                // `fullPath` keeps track of the current object key path in the schema, key is the kebab-cased `KVKey`, and value is the current property value

                const fullPath: string[] = [...currentPath, schemaKey],
                    key = fullPath.map(toKebabCase).join("-"),
                    value = schema[schemaKey]

                if (isKVSchemaValue(value)) {
                    //  If the value is a `KVSchemaValue`, destructure the value data and push it to the result array

                    const [defaultValue, type] = value
                    schemaSets.push({ key, default: defaultValue, type })
                } else if (typeof value === "object" && value) {
                    // If the value is an object and is not null or undefined, it recursively calls `processSchema` to parse nested schemas and values

                    processSchema(value, { currentPath: fullPath })
                } else if (value !== undefined && !!(value as KVValue)) {
                    //  If the value is not undefined and is of type `KVValue`, infer the value type and push it to the result array with the value

                    const type: KVType = Object.entries(kvValues).find(([_, KvValue]) => typeof KvValue === typeof value)?.[0] as KVType
                    schemaSets.push({ key, default: value, type })
                } else
                    throw new KVError({
                        name: "SCHEMA_PARSE_FAILURE",
                        message: `Failed to parse schema value: ${value}`,
                        cause: schema
                    })
            }
        }
    }

    /**
     * @description Uses a series of conditional tests to verify that the value type is of `KVSchemaValue`.
     */
    function isKVSchemaValue(value: unknown): value is KVSchemaValue {
        return (
            //  Check if the value is an array
            Array.isArray(value) &&
            //  Check if it has exactly two elements

            value.length === 2 &&
            //  Check if the default value successfully casts to `KVValue`

            (value[0] as KVValue) !== undefined &&
            //  Check if the value type successfully casts to `KVType`

            (value[1] as KVType) !== undefined
        )
    }

    //  Call the recursive function

    processSchema(schema, {})

    //  Return the result

    return schemaSets
}

// /**
//  * @description A collection of key-value pairs.
//  */
// export type KVMap = KVSet[]

/**
 * @description The object returned from `UseKVMap`.
 */
export interface KVSchemaComponents {
    // /**
    //  * @description All of the serialized key-value pairs derived from the schema.
    //  */
    // map: KVMap

    /**
     * @description All of the serialized keys derived from the schema.
     */
    keys: KVKey[]

    // /**
    //  * @description All of the serialized default values derived from the schema.
    //  */
    // defaults: (KVValue | null)[]

    // /**
    //  * @description All of the value type labels derived from the schema.
    //  */
    // types: KVType[]
}

/**
 * @description Used to get a human-readable set of schema components for use throughout an implementation.
 */
export function getKVSchemaComponents({ schema }: { schema: KVSchema }): KVSchemaComponents {
    //  Parse the schema

    const schemaMap: KVSchemaMap = introspectKVSchema({ schema })

    //  Extract the keys, default values, and value types from the schema map

    const [keys] = schemaMap.reduce(
        (acc, set) => {
            //  Push each prop into its respective position in the accumulator

            acc[0].push(set.key)
            acc[1].push(set.default)
            acc[2].push(set.type)

            //  Return the accumulator

            return acc
        },

        //  Typed tuple literal as initial accumulator value

        [[], [], []] as [KVKey[], (KVValue | null)[], KVType[]]
    )

    //  Return the extracted values

    return { keys }
}

//
//
//

/**
 * @description
 * @todo P4 This function should either infer the `KVKey` as you're typing the string, it should take the actual object key path to the object if possible (may require modifying the schema value structure again to include a UUID/identifier, then inside the function this ID will be matched against the schema passed in to retrieve the key path), or the user will avoid this entirely and just get the schema components beforehand, which is not intuitive. Aside from inferring the key path and returning the actual key, it should also serialize the value (using the default value if null) and return both as a `KVSet`. It should also throw an error if the `KVValue` type passed in does not match the `KVType` of the schema value. It should also optionally take in a `KVKey` for re-serializing deserialized pairs.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare function serializeKVSet({ using, keyPath, value }: { using: KVSchema; keyPath: KVSchemaValue; value?: KVValue }): KVSerializedSet

/**
 * @description
 * @todo P4 This function should take in a `KVSchema`, a serialized `KVKey`, and a serialized value. It should convert the key from kebab-case to a series of keys to access the schema, using the available schema object keys to infer the key path when dealing with split identifiers (e.g., "standalone-model-id" needs to be inferred to ["standalone", "modelId"]). If unable to parse the key path successfully (e.g., a key doesn't exist on the schema) throw an error. Use the key path to access the schema, retrieving the `KVValue` default value and value type. Cast the provided value to the value type, using the default if not provided. Right now, this declaration is returning a `KVSet`, but ideally this should be inferred to the type of the result value.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare function deserializeKVSet({ using, key, value }: { using: KVSchema; key: string; value?: string }): KVSet

/**
 * @summary Example implementation and testing.
 */

//  Defining a schema

/**
 * @description A demonstration schema.
 */
const schema: KVSchema = {
    defaults: {
        standalone: {
            modelId: "null",
            testId: KVString
        },
        other: 21,
        arrStyle: [null, "string"] as KVSchemaValue,

        type: KVBoolean
    },
    darkMode: 12
} as const

//  Introspecting a schema (internal & edge cases)

const schemaMap: KVSchemaMap = introspectKVSchema({ schema })

console.log("Introspected Schema:", schemaMap)
// Introspected Schema: [
//     {
//       key: 'defaults-standalone-model-id',
//       default: 'null',
//       type: 'string'
//     },
//     { key: 'defaults-standalone-test-id', default: null, type: 'string' },
//     { key: 'defaults-other', default: 21, type: 'number' },
//     { key: 'defaults-arr-style', default: null, type: 'string' },
//     { key: 'defaults-type', default: null, type: 'boolean' },
//     { key: 'dark-mode', default: 12, type: 'number' }
//   ]

//  Retrieving the schema components (for type inference)

const schemaComponents: KVSchemaComponents = getKVSchemaComponents({ schema })

console.log("Schema Components:", schemaComponents)
// Schema Components: {
//     keys: [
//       'defaults-standalone-model-id',
//       'defaults-standalone-test-id',
//       'defaults-other',
//       'defaults-arr-style',
//       'defaults-type',
//       'dark-mode'
//     ]
//   }

//  Validating and converting a key/value pair for submission to a database

// const [key, value] = serializeKVSet({ using: schema, key: "defaults", value: 1234 })

// console.log(key, value)
//  "defaults-standalone-model-id", "1234"

//  Re-typing the value when I retrieve it from the database

// const [key, value] = deserializeKVSet({ using: schema, key: "defaults-standalone-model-id", value: "1234" })

// console.log(key, value)
//  "defaults-standalone-model-id", "1234"
