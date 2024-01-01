/**
 * @file A schema for storing metrics about the application usage of users.
 * @author Riley Barabash <riley@rileybarabash.com>
 */

import { messages, users } from "."
import { mysqlTable } from "~/utils"
import { relations } from "drizzle-orm"
import { index, int, json, timestamp, varchar } from "drizzle-orm/mysql-core"
import { v4 as uuid } from "uuid"

/**
 * @description All of the possible usage metric sources.
 */
export const usageMetricEvents = ["completion", "sms"] as const

/**
 * @description The source of a usage metric.
 */
export type UsageMetricEvent = (typeof usageMetricEvents)[number]

/**
 * @description All of the possible usage metric measurement units.
 */
export const usageMetricUnits = ["tokens", "count"] as const

/**
 * @description The measurement unit of a usage metric.
 */
export type UsageMetricUnit = (typeof usageMetricUnits)[number]

/**
 * @description Additional information about a usage metric.
 */
export type UsageMetricMetadata = unknown[]

/**
 * @description A table for storing metrics about the application usage of users.
 */
export const usageMetrics = mysqlTable(
    "usage_metric",

    {
        /**
         * @description The unique identifier of the metric.
         */
        id: varchar("id", { length: 255 }).notNull().$defaultFn(uuid).primaryKey(),

        /**
         * @description The ID of the user associated with the metric.
         */
        userId: varchar("user_id", { length: 255 }).notNull(),

        /**
         * @description The source of the metric.
         */
        event: varchar("event", { length: 15, enum: usageMetricEvents }).$type<UsageMetricEvent>().notNull(),

        /**
         * @description The ID associated with the source of the metric.
         */
        eventId: varchar("event_id", { length: 255 }),

        /**
         * @description The measurement unit of the metric.
         */
        unit: varchar("unit", { length: 15, enum: usageMetricUnits }).$type<UsageMetricUnit>().notNull(),

        /**
         * @description The numerical value of the metric.
         */
        value: int("value").notNull(),

        /**
         * @description The date and time the metric was created.
         */
        createdAt: timestamp("created_at").notNull().defaultNow(),

        /**
         * @description Additional information about the metric.
         */
        metadata: json("metadata").$type<UsageMetricMetadata>()
    },
    usageMetric => ({
        /**
         * @description An index used when searching for a specific type of metric.
         */
        lookupIdx: index("lookup_idx").on(usageMetric.event, usageMetric.unit),

        /**
         * @description An index on the ID of the user associated with the metric.
         */
        userIdIdx: index("user_id_idx").on(usageMetric.userId),

        /**
         * @description An index on the ID of the event associated with the metric.
         */
        eventIdIdx: index("event_id_idx").on(usageMetric.eventId),

        /**
         * @description An index on measurement unit of the metric.
         */
        unitIdx: index("unit_idx").on(usageMetric.unit)
    })
)

/**
 * @description The relations for the "usage_metric" table.
 */
export const usageMetricsRelations = relations(usageMetrics, ({ one }) => ({
    /**
     * @description One metric can be associated with one user.
     */
    user: one(users, { fields: [usageMetrics.userId], references: [users.id] }),

    /**
     * @description One metric can be associated with one message.
     */
    message: one(messages, { fields: [usageMetrics.eventId], references: [messages.id] })
}))
