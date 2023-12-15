/**
 * @file A schema for storing information about email and SMS campaigns.
 * @author Riley Barabash <riley@rileybarabash.com>
 */

import { users } from "."
import { mysqlTable } from "~/utils/multi-project-schema"
import { relations, sql } from "drizzle-orm"
import { boolean, index, primaryKey, timestamp, varchar } from "drizzle-orm/mysql-core"

//  A table for storing campaign data

export const campaigns = mysqlTable(
    "campaign",

    {
        //  A column named "userId" of type varchar with a maximum length of 255 characters, that cannot be null

        userId: varchar("userId", { length: 255 }).notNull(),

        //  A column named "name" of type varchar with a maximum length of 255 characters, that cannot be null

        name: varchar("name", { length: 255 }).notNull(),

        //  A column named "step" of type varchar with a maximum length of 255 characters

        step: varchar("step", { length: 255 }),

        //  A column named "active" of type boolean with a default value of false, that cannot be null

        active: boolean("active").notNull().default(false),

        //  A column named "createdAt" of type timestamp with a default value of the current time, that cannot be null

        createdAt: timestamp("createdAt")
            .notNull()
            .default(sql`CURRENT_TIMESTAMP`)
    },
    campaign => ({
        //  A primary key named "compoundKey" on the "userId" and "name" columns

        compoundKey: primaryKey({ columns: [campaign.userId, campaign.name] }),

        //  An index named "userId_idx" on the "userId" column

        userIdIdx: index("userId_idx").on(campaign.userId)
    })
)

//  The relations for the "campaigns" table

export const campaignsRelations = relations(campaigns, ({ one }) => ({
    // A "one" relation named "user" between the "campaigns" and "users" tables — meaning that one campaign is associated with one user

    user: one(users, { fields: [campaigns.userId], references: [users.id] })
}))
