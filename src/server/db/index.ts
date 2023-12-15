/**
 * @file Sets up a connection for a PlanetScale database using Drizzle.
 * @author Riley Barabash <riley@rileybarabash.com>
 */

import * as schema from "./schemas"
import { Client } from "@planetscale/database"
import { env } from "~/env"
import { drizzle } from "drizzle-orm/planetscale-serverless"

//  Uses the database URL and schema to configure the ORM

export const db = drizzle(new Client({ url: env.DATABASE_URL }).connection(), { schema })

//  Export the type definition of the database

export type Drizzle = typeof db

//  Re-export the schema

export { schema }
