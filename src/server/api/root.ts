/**
 * @file Configures the main router for the tRPC server.
 * @author Riley Barabash <riley@rileybarabash.com>
 */

import { experimentalRouter, usersRouter } from "./routers"
import { createTRPCRouter } from "./trpc"

/**
 * @description This is the primary router for your server. All routers added in "~/server/api/routers" should be manually added here.
 */
export const appRouter = createTRPCRouter({
    experimental: experimentalRouter,
    users: usersRouter
})

//  Export the type definition of the API

export type AppRouter = typeof appRouter
