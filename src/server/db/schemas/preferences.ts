/**
 * @file A schema for storing user preferences.
 * @author Riley Barabash <riley@rileybarabash.com>
 */

import { users } from "."
import { mysqlTable } from "~/utils"
import { relations } from "drizzle-orm"
import { json, primaryKey, timestamp, varchar } from "drizzle-orm/mysql-core"

/*

I want to define a preference schema that contains data about a preference's key (always a string) and the value type of the preference. All preferences will be put into the database as varchars, so the value type is important for both inputting data and parsing it out.

Consider the following schema/model:

interface preferencesSchema {
    defaults: {
        standalone: {
            modelId: string
        }
    }
    darkMode: boolean
}

Below is an alternative schema format, which uses an object and strings instead of an interface, and may be easier to implement and create the functionality. However I would prefer to use the interface version if possible because it's simpler. In this case, all of the values in the object denote to the type of the preference, and must somehow conform to the `PreferenceType` type when defined.

type PreferenceType = "string" | "boolean" | {...}

const preferencesSchema = {
    defaults: {
        standalone: {
            modelId: "string"
        }
    }
    darkMode: "boolean"
}

This is how I want to use the schema to set a preference in my db. It should take in an opts object with the schema, then something accessing a property of the schema (with intellisense). I'm not sure exactly what to access here (as you can see, I just started the access with a dot). This might be the original `preferencesSchema` object, maybe I define this inside a closure so that I can access them on a parameter, I don't know what's best. It will validate my input against the type, and return both as a string, as they will be stored as varchars in my db. If I donlt pass a value, it should return null.

const { key, value } = usePreference({key: .defaults.standalone.modelId, value?: "1234", schema: preferencesSchema})
db.preferences.mutate({key, value})

Or, if this is better:

const { key, value } = usePreference(preferenceSchema.darkmode, true)
db.preferences.mutate({key, value})

And then to re-type the value when I get it from the db:

const { key, value } = db.preferences.get()
const typedValue = parsePreference(key, value, {schema: preferencesSchema})

Or, if it's not possible to dynamically type the return:

const { key, value } = db.preferences.get()
const { value, Value } = parsePreference(key, value, {schema: preferencesSchema})
const newValue: Value = value

I also want to get all cases of the schema (similar to export const preferenceKeys = ["defaults-standalone-model-id", "color-theme"] as const) (a read only array of strings) and the type of all of the keys (similar to: export type PreferenceKey = typeof preferenceKeys) so that I can use it for inference on the database column. This could be done with a `parsePreferenceSchema` func or something similar, or maybe just the `parsePreference` func but I only pass in the schema.

So in conclusion, the main purpose is to convert the camelCase sequence of object/interface keys to kebab/skewer case, validate the type of the value going in against the schema, and type the value when parsing it out of the db.

*/

/**
 * @description All of the possible user preference keys.
 */
export const preferenceKeys = ["defaults-standalone-model-id", "color-theme", "disable-personality"] as const

/**
 * @description The ID of the preference.
 */
export type PreferenceKey = (typeof preferenceKeys)[number]

/**
 * @description Additional information about the preference.
 */
export type PreferenceMetadata = unknown[]

/**
 * @description A table for storing user preferences.
 */
export const preferences = mysqlTable(
    "preference",

    {
        /**
         * @description The ID of the user associated with the preference.
         */
        userId: varchar("user_id", { length: 255 }).notNull(),

        /**
         * @description The ID of the preference.
         */
        key: varchar("key", { length: 255, enum: preferenceKeys }).$type<PreferenceKey>().notNull(),

        /**
         * @description The preference value.
         */
        value: varchar("value", { length: 255 }),

        /**
         * @description The date and time the preference was created.
         */
        createdAt: timestamp("created_at").notNull().defaultNow(),

        /**
         * @description The date and time the preference was last updated.
         */
        updatedAt: timestamp("updated_at").notNull().defaultNow().onUpdateNow(),

        /**
         * @description Additional information about the preference.
         */
        metadata: json("metadata").$type<PreferenceMetadata>()
    },

    /**
     * @description Returns the indexes for the table.
     */
    preference => ({
        /**
         * @description A primary key on the preference ID and the ID of the associated user.
         */
        compositeKey: primaryKey({ columns: [preference.userId, preference.key] })
    })
)

/**
 * @description The relations for the "preference" table.
 */
export const preferencesRelations = relations(preferences, ({ one }) => ({
    /**
     * @description One preference can be associated with one user.
     */
    user: one(users, { fields: [preferences.userId], references: [users.id] })
}))
