/**
 * @file A schema for storing information about the relationships between users and campaigns.
 * @author Riley Barabash <riley@rileybarabash.com>
 */

import { campaigns, users } from "."
import { mysqlTable } from "~/utils/multi-project-schema"
import { relations } from "drizzle-orm"
import { boolean, index, primaryKey, timestamp, varchar } from "drizzle-orm/mysql-core"

//  A table for storing joins between a user and a campaign

export const usersToCampaigns = mysqlTable(
    "user_to_campaign",

    {
        //  A column named "user_id" of type varchar with a maximum length of 255 characters, and cannot be null

        userId: varchar("user_id", { length: 255 }).notNull(),

        //  A column named "campaign_id" of type varchar with a maximum length of 255 characters, that cannot be null

        campaignId: varchar("campaign_id", { length: 255 }).notNull(),

        //  A column named "subscribed" of type boolean with a default value of false, that cannot be null

        subscribed: boolean("subscribed").notNull().default(false),

        //  A column named "created_at" of type timestamp with a default value of the current time, that cannot be null

        createdAt: timestamp("created_at").notNull().defaultNow(),

        //  A column named "updated_at" of type timestamp with a default value of the current time, that cannot be null

        updatedAt: timestamp("updated_at").notNull().defaultNow().onUpdateNow()
    },

    //  Accepts the join schema, and returns an object containing the table's indices

    join => ({
        //  A primary key named "compoundKey" on the "user_id" and "campaign_id" columns

        compoundKey: primaryKey({ columns: [join.userId, join.campaignId] }),

        //  An index named "subscribed_idx" on the "subscribed" column

        subscribedIdx: index("subscribed_idx").on(join.subscribed)
    })
)

//  The relations for the "user_to_campaign" table

export const usersToCampaignsRelations = relations(usersToCampaigns, ({ one }) => ({
    // A one relation named "user" between the "user_to_campaign" and "user" tables — meaning that one join is associated with one user

    user: one(users, { fields: [usersToCampaigns.userId], references: [users.id] }),

    // A one relation named "campaign" between the "user_to_campaign" and "campaign" tables — meaning that one join is associated with one campaign

    campaign: one(campaigns, { fields: [usersToCampaigns.campaignId], references: [campaigns.id] })
}))
