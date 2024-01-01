/**
 * @file Helper functions for creating MySQL database tables with support for custom table name prefixes and testing.
 * @author Riley Barabash <riley@rileybarabash.com>
 *
 * @remark Currently, we are defaulting the table prefix to the brand display name rather than omitting the prefix, which is not possible because of a bug in Drizzle that causes an error on push if the string returned in the `createTableName` func is empty.
 */

import { env } from "~/env"
import { preferences } from "~/preferences"
import { mysqlTableCreator } from "drizzle-orm/mysql-core"

/**
 * @description Constructs a table name based on the application's environment and preferences.
 */
export const createTableName = (name?: string) =>
    `${env.DATABASE_TABLE_PREFIX ?? preferences.brand.displayName.toLowerCase() + "_"}${
        //  If the multi-project schema strategy is selected and the app is not running in prod, postfix the database table prefix with "test_"

        env.TEST_DATABASE_STRATEGY === "mps" && (env.DATABASE_ENV ?? env.NODE_ENV ?? env.ENV) !== "production" ? "test_" : ""
    }${name ?? ""}`

/**
 * @description Uses Drizzle's multi-project schema feature, which allows you to use the same database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const mysqlTable = mysqlTableCreator(createTableName)
