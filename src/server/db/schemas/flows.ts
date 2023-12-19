/**
 * @file A schema for storing information about programmatic SMS flows.
 * @author Riley Barabash <riley@rileybarabash.com>
 */

import { schema } from "~/server/db"
import { mysqlTable } from "~/utils/multi-project-schema"
import { relations } from "drizzle-orm"
import { index, primaryKey, timestamp, varchar } from "drizzle-orm/mysql-core"

//  A table for storing flow data

export const flows = mysqlTable(
    "flow",

    {
        //  A column named "name" of type varchar with a maximum length of 255 characters, that cannot be null

        id: varchar("name", { length: 255 }).notNull(),

        //  A column named "user_id" of type varchar with a maximum length of 255 characters, that cannot be null

        userId: varchar("user_id", { length: 255 }).notNull(),

        //  A column named "step" of type varchar with a maximum length of 255 characters

        step: varchar("step", { length: 255 }),

        //  A column named "created_at" of type timestamp with a default value of the current time, that cannot be null

        createdAt: timestamp("created_at").notNull().defaultNow(),

        //  A column named "updated_at" of type timestamp with a default value of the current time, that cannot be null

        updatedAt: timestamp("updated_at").notNull().defaultNow().onUpdateNow()
    },

    //  Accepts the flow schema, and returns an object containing the table's indices

    flow => ({
        //  A primary key named "compoundKey" on the "id" and "user_id" columns

        compoundKey: primaryKey({ columns: [flow.id, flow.userId] }),

        //  An index named "user_id_idx" on the "user_id" column

        userIdIdx: index("user_id_idx").on(flow.userId)
    })
)

//  The relations for the "flow" table

export const flowsRelations = relations(flows, ({ one }) => ({
    // A one relation named "user" between the "flow" and "user" tables — meaning that one flow is associated with one user

    user: one(schema.users, { fields: [flows.userId], references: [schema.users.id] })
}))
