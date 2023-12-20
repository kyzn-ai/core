/**
 * @file Helper function for creating tables for multiple projects inside the same database.
 * @author Riley Barabash <riley@rileybarabash.com>
 */

import { env } from "~/env"
import { preferences } from "~/preferences"
import { mysqlTableCreator } from "drizzle-orm/mysql-core"

/**
 * @description Uses Drizzle's multi-project schema feature — allowing you to use the same database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const mysqlTable = mysqlTableCreator(name => `${preferences.brand.displayName.toLowerCase()}_${
    //  If the Multi-Project Schema test strategy is selected and the app is not running in prod, postfix the database table prefix with "test_"

    env.TEST_DATABASE_STRATEGY === "mps" && (env.DATABASE_ENV ?? env.NODE_ENV) !== "production" ? "test_" : ""}${name}`)
