/**
 * @file A router for experimental queries and mutations.
 * @author Riley Barabash <riley@rileybarabash.com>
 */

import { createTRPCRouter, protectedProcedure, publicProcedure } from "~/server/api/trpc"
import { z } from "zod"

export const experimentalRouter = createTRPCRouter({
    //  Example of a query that takes input from the client and returns a response

    test: publicProcedure.input(z.object({ fromClient: z.string() })).query(({ input }) => {
        //  Appends a string to the input and returns it to the client

        return { fromServer: input.fromClient + "response from backend" }
    }),

    //  Example of a protected query that takes no input and returns a string

    protectedTest: protectedProcedure.query(() => "how you doin -_^")
})
