/**
 * @file Defines some miscellaneous Drizzle schemas for a MySQL database.
 * @author Riley Barabash <riley@rileybarabash.com>
 *
 * @todo DEPRIORITIZED: Consolidate database column name casing and conventions. Start with "~/server/db/schemas/auth".
 */

import { mysqlTable } from "~/utils/multi-project-schema"
import { sql } from "drizzle-orm"
import { bigint, index, timestamp, varchar } from "drizzle-orm/mysql-core"

//  A table for storing user posts

export const posts = mysqlTable(
    //  The name of the table

    "post",

    {
        //  A column named "id" of type bigint as a primary key that auto-increments

        id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),

        //  A column named "content" of type varchar with a maximum length of 256 characters (length optimized for presentation)

        content: varchar("content", { length: 256 }),

        //  A column named "createdById" of type varchar with a maximum length of 255 characters, that cannot be null (length optimized for byte semantics)

        createdById: varchar("createdById", { length: 255 }).notNull(),

        //  A column named "created_at" of type timestamp with a default value of the current time, that cannot be null

        createdAt: timestamp("created_at")
            .default(sql`CURRENT_TIMESTAMP`)
            .notNull(),

        //  A column named "updatedAt" of type timestamp that is updated whenever the row changes

        updatedAt: timestamp("updatedAt").onUpdateNow()
    },

    //  Accepts the post schema, and returns an object containing the table's indices

    post => ({
        //  An index named "createdById_idx" on the "createdById" column

        createdByIdIdx: index("createdById_idx").on(post.createdById),

        //  An index named "content_idx" on the "content" column

        contentIndex: index("content_idx").on(post.content)
    })
)
