/**
 * @file A router for manipulating programmatic flows.
 * @author Riley Barabash <riley@rileybarabash.com>
 */

import { TRPCError } from "@trpc/server"
import { type GetFlowResult, getFlow } from "~/server/api/helpers"
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc"
import { schema } from "~/server/db"
import { and, eq } from "drizzle-orm"
import { z } from "zod"

export const flowsRouter = createTRPCRouter({
    //  Creates a flow

    create: publicProcedure
        .input(
            z.object({
                //  Requires the flow ID and the user ID at minimum

                id: z.string().max(255),
                userId: z.string().max(255),
                step: z.string().max(255).nullish()
            })
        )
        .mutation(async ({ ctx, input }) => {
            //  Inserts a new flow into the database

            await ctx.db.insert(schema.flows).values({
                id: input.id,
                userId: input.userId,
                step: input.step
            })

            //  Returns the newly created flow

            return (await getFlow({ db: ctx.db, input }))!
        }),

    //  Gets a flow

    get: publicProcedure
        .input(
            z.object({
                id: z.string().max(255),
                userId: z.string().max(255)
            })
        )
        .query(async ({ ctx, input }) => await getFlow({ db: ctx.db, input })),

    //  Updates a flow

    update: publicProcedure
        .input(
            z.object({
                //  The flow ID and the user ID of the flow to update

                id: z.string().max(255),
                userId: z.string().max(255),

                //  The flow values to update

                step: z.string().max(255).nullish()
            })
        )
        .mutation(async ({ ctx, input }) => {
            //  Get the flow

            const flow: GetFlowResult | undefined = await getFlow({ db: ctx.db, input })

            //  Throw an error if the flow doesn't exist

            if (!flow) throw new TRPCError({ message: `A flow with ID "${input.id}" for user "${input.id}" does not exist`, code: "NOT_FOUND" })

            //  Update the flow values

            await ctx.db
                .update(schema.flows)
                .set({
                    //  If truthy or `null`, we want to pass the input, otherwise keep the existing value

                    step: input.step
                })
                .where(and(eq(schema.flows.id, input.id), eq(schema.flows.userId, input.userId)))
        })
})
