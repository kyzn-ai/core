/**
 * @file Sets up a connection for a PlanetScale database using Drizzle.
 * @author Riley Barabash <riley@rileybarabash.com>
 */

import * as Schema from "./schemas"
import { Client } from "@planetscale/database"
import { env } from "~/env"
import { drizzle } from "drizzle-orm/planetscale-serverless"

//  Uses the database URL and schema to configure the ORM

export const db = drizzle(new Client({ url: env.DATABASE_URL }).connection(), { schema: Schema })
