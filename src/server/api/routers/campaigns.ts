/**
 * @file A router for manipulating marketing campaigns.
 * @author Riley Barabash <riley@rileybarabash.com>
 */

import { TRPCError } from "@trpc/server"
import { type GetCampaignResult, getCampaign } from "~/server/api/helpers"
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc"
import { schema } from "~/server/db"
import { eq } from "drizzle-orm"
import { z } from "zod"

export const campaignsRouter = createTRPCRouter({
    //  Creates a campaign

    create: publicProcedure
        .input(
            z.object({
                //  Requires the campaign ID at minimum

                id: z.string().max(255),
                active: z.boolean().optional()
            })
        )
        .mutation(async ({ ctx, input }) => {
            //  Inserts a new campaign into the database

            await ctx.db.insert(schema.campaigns).values({
                id: input.id,
                active: input.active
            })

            //  Returns the newly created campaign

            return (await getCampaign({ db: ctx.db, input }))!
        }),

    //  Gets a campaign

    get: publicProcedure
        .input(
            z.object({
                id: z.string().max(255)
            })
        )
        .query(async ({ ctx, input }) => await getCampaign({ db: ctx.db, input })),

    //  Updates a campaign

    update: publicProcedure
        .input(
            z.object({
                //  The ID of the campaign to update

                id: z.string().max(255),

                //  The campaign values to update

                active: z.boolean().optional()
            })
        )
        .mutation(async ({ ctx, input }) => {
            //  Get the campaign

            const campaign: GetCampaignResult | undefined = await getCampaign({ db: ctx.db, input })

            //  Throw an error if the campaign doesn't exist

            if (!campaign) throw new TRPCError({ message: `A campaign with ID "${input.id}" does not exist`, code: "NOT_FOUND" })

            //  Update the campaign values

            await ctx.db
                .update(schema.campaigns)
                .set({
                    //  If truthy or `null`, we want to pass the input, otherwise keep the existing value

                    active: input.active
                })
                .where(eq(schema.campaigns.id, input.id))
        })
})
