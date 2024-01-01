/**
 * @file A schema for storing user configurations for artificial intelligence models.
 * @author Riley Barabash <riley@rileybarabash.com>
 */

import { messages, threads, users } from "."
import { mysqlTable } from "~/utils"
import { relations } from "drizzle-orm"
import { boolean, index, int, json, primaryKey, text, timestamp, varchar } from "drizzle-orm/mysql-core"
import { v4 as uuid } from "uuid"
// import { JSONSchema } from "openai/lib/jsonschema.mjs"

/**
 * @description All of the possible LLM providers.
 */
export const llmProviders = ["openai"] as const

/**
 * @description The creator of the LLM.
 */
export type LLMProvider = typeof llmProviders

/**
 * @description All of the possible LLM IDs.
 */
export const llmIds = ["gpt-4-1106-preview", "gpt-3.5-turbo-1106"] as const

/**
 * @description The identifier of the LLM.
 */
export type LLMID = typeof llmIds

/**
 * @description A tool the model may call.
 */
export interface Tool {
    /**
     * @description The type of the tool. Currently, only `function` is supported.
     */
    type: string

    /**
     * @description A function that the model may call.
     */
    function: ToolFunction
}

/**
 * @description A function that the model may call.
 */
export interface ToolFunction {
    /**
     * @description A description of what the function does, used by the model to choose when and how to call the function.
     */
    description: string

    /**
     * @description The name of the function to be called. Must be a-z, A-Z, 0-9, or contain underscores and dashes, with a maximum length of 64.
     */
    name: string

    /**
     * @description The parameters the functions accepts, described as a JSON Schema object.
     */
    parameters?: JSON
}

/**
 * @description Additional information about the LLM configuration.
 */
export type LLMConfigurationMetadata = unknown[]

/**
 * @description A table for storing user-created LLM configurations.
 */
export const llmConfigurations = mysqlTable(
    "llm_configuration",

    {
        /**
         * @description The unique identifier for the configuration.
         */
        id: varchar("id", { length: 255 }).notNull().$defaultFn(uuid),

        /**
         * @description The ID of the user that created the configuration.
         */
        userId: varchar("user_id", { length: 255 }).notNull(),

        /**
         * @description The name of the configuration.
         */
        name: varchar("name", { length: 63 }),

        /**
         * @description The description of the configuration.
         */
        description: varchar("description", { length: 511 }),

        /**
         * @description The creator of the LLM.
         */
        provider: varchar("provider", { length: 63, enum: llmProviders }).$type<LLMProvider>().notNull(),

        /**
         * @description The ID of the LLM.
         */
        model: varchar("model", { length: 255, enum: llmIds }).$type<LLMID>().notNull(),

        /**
         * @description The system instructions for the LLM to use.
         */
        instructions: text("instructions"),

        /**
         * @description The maximum number of tokens allowed in a generated completion.
         */
        maxTokens: int("max_tokens"),

        /**
         * @description A list of tools the model may call.
         */
        tools: json("tool").$type<Tool[]>(),

        /**
         * @description The configuration's visibility status.
         */
        archived: boolean("archived").default(false),

        /**
         * @description The date and time the configuration was created.
         */
        createdAt: timestamp("created_at").notNull().defaultNow(),

        /**
         * @description The date and time the configuration was last updated.
         */
        updatedAt: timestamp("updated_at").notNull().defaultNow().onUpdateNow(),

        /**
         * @description Additional information about the configuration.
         */
        metadata: json("metadata").$type<LLMConfigurationMetadata>()
    },

    /**
     * @description Returns the indexes for the table.
     */
    llmConfiguration => ({
        /**
         * @description A primary key comprised of the "id" and "provider" columns, since custom IDs from different providers have the potential to collide.
         */
        compositeKey: primaryKey({ columns: [llmConfiguration.id, llmConfiguration.provider] }),

        /**
         * @description An index on all of the columns used to search for a configuration.
         */
        // lookupIdx: index("lookup_idx").on(llmConfiguration.name, llmConfiguration.description, llmConfiguration.provider, llmConfiguration.model, llmConfiguration.instructions),

        /**
         * @description An index on ID of the user associated with the configuration.
         */
        userIdIdx: index("user_id_idx").on(llmConfiguration.userId)
    })
)

/**
 * @description The relations for the "llm_configuration" table.
 */
export const llmConfigurationsRelations = relations(llmConfigurations, ({ one, many }) => ({
    /**
     * @description One config can be associated to one user.
     */
    user: one(users, { fields: [llmConfigurations.userId], references: [users.id] }),

    /**
     * @description One config can be associated to many threads.
     */
    threads: many(threads),

    /**
     * @description One config can be associated to many messages.
     */
    messages: many(messages)
}))
