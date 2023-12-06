/**
 * @file Configures the Drizzle ORM.
 * @author Riley Barabash <riley@rileybarabash.com>
 */

import { env } from "~/env"
import { type Config } from "drizzle-kit"

export default {
    //  Path to the database schema file

    schema: "./src/server/db/schemas/index.ts",

    driver: "mysql2",

    //  Credentials to connect to the database

    dbCredentials: { uri: env.DATABASE_URL },

    tablesFilter: ["amnesia_*"]
} satisfies Config
