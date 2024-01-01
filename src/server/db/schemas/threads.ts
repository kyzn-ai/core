/**
 * @file A schema for storing conversational threads.
 * @author Riley Barabash <riley@rileybarabash.com>
 */

import { llmConfigurations, messages, users } from "."
import { mysqlTable } from "~/utils"
import { relations } from "drizzle-orm"
import { boolean, index, json, timestamp, varchar } from "drizzle-orm/mysql-core"
import { v4 as uuid } from "uuid"

/**
 * @description Additional information about the thread.
 */
export type ThreadMetadata = unknown[]

/**
 * @description A table for storing conversational message threads.
 */
export const threads = mysqlTable(
    "thread",

    {
        /**
         * @description The unique identifier of the thread.
         */
        id: varchar("id", { length: 255 }).notNull().$defaultFn(uuid).primaryKey(),

        /**
         * @description The ID of the user associated with the thread.
         */
        userId: varchar("user_id", { length: 255 }).notNull(),

        /**
         * @description The ID of the default configuration associated with the thread.
         */
        llmConfigurationId: varchar("llm_configuration_id", { length: 255 }).notNull(),

        /**
         * @description The name of the thread.
         */
        name: varchar("name", { length: 63 }),

        /**
         * @description The description of the thread.
         */
        description: varchar("description", { length: 511 }),

        /**
         * @description The thread's visibility status.
         */
        archived: boolean("archived").default(false),

        /**
         * @description The date and time the thread was created.
         */
        createdAt: timestamp("created_at").notNull().defaultNow(),

        /**
         * @description The date and time the thread was last updated.
         */
        updatedAt: timestamp("updated_at").notNull().defaultNow().onUpdateNow(),

        /**
         * @description Additional information about the thread.
         */
        metadata: json("metadata").$type<ThreadMetadata>()
    },

    /**
     * @description Returns the indexes for the table.
     */
    thread => ({
        /**
         * @description An index on all of the columns used to search for a thread.
         */
        lookupIdx: index("lookup_idx").on(thread.name, thread.description),

        /**
         * @description An index on the LLM configuration ID.
         */
        llmConfigurationIdIdx: index("llm_configuration_id_idx").on(thread.llmConfigurationId)
    })
)

/**
 * @description The relations for the "llm_configuration" table.
 */
export const threadRelations = relations(threads, ({ one, many }) => ({
    /**
     * @description One thread can be associated to one user.
     */
    user: one(users, { fields: [threads.userId], references: [users.id] }),

    /**
     * @description One thread can be associated to one LLM configuration.
     */
    llmConfiguration: one(llmConfigurations, { fields: [threads.llmConfigurationId], references: [llmConfigurations.id] }),

    /**
     * @description One thread can be associated to many messages.
     */
    messages: many(messages)
}))
