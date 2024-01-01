/**
 * @file Configures the Drizzle ORM.
 * @author Riley Barabash <riley@rileybarabash.com>
 */

import { env } from "~/env"
import { createTableName } from "~/utils"
import { type Config } from "drizzle-kit"

export default {
    //  Path to the database schema file

    schema: "./src/server/db/schemas/index.ts",

    driver: "mysql2",

    //  Credentials to connect to the database

    dbCredentials: { uri: env.DATABASE_URL },

    //  A glob pattern that selects the tables to push and introspect

    tablesFilter: createTableName() + "*"
} satisfies Config
