/**
 * @file A schema for storing information about marketing campaigns.
 * @author Riley Barabash <riley@rileybarabash.com>
 */

import { usersToCampaigns } from "."
import { mysqlTable } from "~/utils/multi-project-schema"
import { relations } from "drizzle-orm"
import { boolean, index, varchar } from "drizzle-orm/mysql-core"

//  A table for storing campaign data

export const campaigns = mysqlTable(
    "campaign",

    {
        //  A column named "name" of type varchar with a maximum length of 255 characters, that cannot be null

        id: varchar("name", { length: 255 }).notNull().primaryKey(),

        //  A column named "active" of type boolean with a default value of false, that cannot be null

        active: boolean("active").notNull().default(false)
    },

    //  Accepts the flow schema, and returns an object containing the table's indices

    campaign => ({
        //  An index named "active_idx" on the "active" column

        activeIdx: index("active_idx").on(campaign.active)
    })
)

//  The relations for the "campaign" table

export const campaignsRelations = relations(campaigns, ({ many }) => ({
    //  A many relation named "usersToCampaigns" between the "campaign" and "user_to_campaign" tables — meaning that one campaign can have many associated users, and one user can have many associated campaigns

    users: many(usersToCampaigns)
}))
