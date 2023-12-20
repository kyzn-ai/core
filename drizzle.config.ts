/**
 * @file Configures the Drizzle ORM.
 * @author Riley Barabash <riley@rileybarabash.com>
 */

import { env } from "~/env"
import { preferences } from "~/preferences"
import { type Config } from "drizzle-kit"

export default {
    //  Path to the database schema file

    schema: "./src/server/db/schemas/index.ts",

    driver: "mysql2",

    //  Credentials to connect to the database

    dbCredentials: { uri: env.DATABASE_URL },

    //  A glob pattern that selects the tables to push and introspect

    tablesFilter: `${preferences.brand.displayName.toLowerCase()}_${
        //  If the Multi-Project Schema test strategy is selected and the app is not running in prod, postfix the database table prefix with "test_"

        env.TEST_DATABASE_STRATEGY === "mps" && (env.DATABASE_ENV ?? env.NODE_ENV) !== "production" ? "test_" : ""
    }*`
} satisfies Config
