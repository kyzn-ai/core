/**
 * @file Where all of the tRPC server stuff is created and implemented.
 * @author Riley Barabash <riley@rileybarabash.com>
 *
 * @remarks You probably don't need to edit this file, unless:
 *
 * - You want to modify request context (see `createTRPCContext`)
 * - You want to create a new middleware or type of procedure (see `createTRPCRouter`)
 */

import { getServerAuthSession } from "~/server/auth"
import { db } from "~/server/db"
import { initTRPC, TRPCError } from "@trpc/server"
import superjson from "superjson"
import { ZodError } from "zod"

/**
 * @description Defines and generates the "internals" for the context that is available to all tRPC procedures, allowing you to access common properties when processing a request, like a database or the session.
 *
 * @see https://trpc.io/docs/server/context
 */
export const createTRPCContext = async (options: { headers: Headers }) => {
    //  Gets the auth session if the user is logged in

    const session = await getServerAuthSession()

    return {
        db: db,
        session,
        ...options
    }
}

/**
 * @description Initializes the tRPC API, implementing the context and transformer. We also parse Zod errors to provide typesafety on the frontend if your procedure fails due to validation errors on the backend.
 */
const t = initTRPC.context<typeof createTRPCContext>().create({
    //  Used to serialize and deserialize data when sending and receiving it over the network

    transformer: superjson,

    //  Used to customize the shape of the error object that is sent from the server to the client when an error occurs

    errorFormatter({ shape, error }) {
        return {
            //  Passes the original error message

            ...shape,

            //  Sets the data property of the new error object

            data: {
                //  Passes the original data

                ...shape.data,

                //  Sets the flattened Zod error if it exists

                zodError: error.cause instanceof ZodError ? error.cause.flatten() : null
            }
        }
    }
})

/**
 * @description Used to create new routers and sub-routers when buiding your tRPC API. You will need to import this frequently in the "~/server/api/routers" directory.
 *
 * @see https://trpc.io/docs/router
 */
export const createTRPCRouter = t.router

/**
 * @description The public (unauthenticated) procedure. This is the base piece you use to build new queries and mutations on for API. It does not guarantee that a user querying is authorized, but you can still access the user's session data if they are logged in.
 */
export const publicProcedure = t.procedure

/**
 * @description A middleware that enforces users are logged in before running the procedure.
 */
const enforceUserIsAuthed = t.middleware(({ ctx, next }) => {
    if (!ctx.session || !ctx.session.user) {
        //  Throws an error if the user object is not truthy

        throw new TRPCError({ code: "UNAUTHORIZED" })
    }

    //  Passes control to the next middleware or procedure

    return next({
        ctx: {
            // infers the `session` object as non-nullable

            session: { ...ctx.session, user: ctx.session.user }
        }
    })
})

/**
 * @description The protected (authenticated) procedure. If you want a query or mutation to ONLY be accessible to logged in users, use this. It verifies that the session is valid and guarantees `ctx.session.user` is not null.
 *
 * @see https://trpc.io/docs/procedures
 */
export const protectedProcedure = t.procedure.use(enforceUserIsAuthed)
