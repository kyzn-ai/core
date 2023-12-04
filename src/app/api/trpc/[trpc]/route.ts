/**
 * @file Sets up the tRPC API routes for the app.
 * @author Riley Barabash <riley@rileybarabash.com>
 */

import { env } from "~/env"
import { appRouter } from "~/server/api/root"
import { createTRPCContext } from "~/server/api/trpc"
import { fetchRequestHandler } from "@trpc/server/adapters/fetch"
import { type NextRequest } from "next/server"

/**
 * @description Wraps the `createTRPCContext` helper and provides the required context for the tRPC API when handling a tRPC request via HTTP (e.g, when you make requests from Client Components)
 */
const createContext = async (req: NextRequest) => {
    return createTRPCContext({
        headers: req.headers
    })
}

//  Handles incoming requests to the tRPC API

const handler = (req: NextRequest) =>
    //  Passes the `NextRequest` params to the `fetchRequestHandler` helper
    fetchRequestHandler({
        //  The location of this route

        endpoint: "/api/trpc",
        req,
        router: appRouter,
        createContext: () => createContext(req),

        //  Logs errors in development

        onError: env.NODE_ENV === "development" ? ({ path, error }) => console.error(`tRPC failed on ${path ?? "<no-path>"}: ${error.message}`) : undefined
    })

export { handler as GET, handler as POST }
