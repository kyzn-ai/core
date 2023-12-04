/**
 * @file Sets up a connection for a PlanetScale database using Drizzle.
 * @author Riley Barabash <riley@rileybarabash.com>
 */

import { env } from "~/env"
import * as schema from "~/server/db/schemas/index"
import { Client } from "@planetscale/database"
import { drizzle } from "drizzle-orm/planetscale-serverless"

//  Uses the database URL and schemas to configure the ORM

export const db = drizzle(new Client({ url: env.DATABASE_URL }).connection(), { schema })
