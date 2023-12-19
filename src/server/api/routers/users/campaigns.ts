/**
 * @file A router for manipulating the user-campaign relationships of a user.
 * @author Riley Barabash <riley@rileybarabash.com>
 */

import { TRPCError } from "@trpc/server"
import { type GetUserToCampaignResult, getUserToCampaign } from "~/server/api/helpers"
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc"
import { schema } from "~/server/db"
import { and, eq } from "drizzle-orm"
import { z } from "zod"

export const usersToCampaignsRouter = createTRPCRouter({
    //  Creates a relationship between a campaign and a user

    create: publicProcedure
        .input(
            z.object({
                //  Requires the user ID and the campaign ID at minimum

                userId: z.string().max(255),
                campaignId: z.string().max(255),
                subscribed: z.boolean().optional()
            })
        )
        .mutation(async ({ ctx, input }) => {
            //  Inserts a new relationship into the database

            await ctx.db.insert(schema.usersToCampaigns).values({
                userId: input.userId,
                campaignId: input.campaignId,
                subscribed: input.subscribed
            })

            //  Returns the newly created relationship

            return (await getUserToCampaign({ db: ctx.db, input }))!
        }),

    //  Gets a relationship

    get: publicProcedure
        .input(
            z.object({
                userId: z.string().max(255),
                campaignId: z.string().max(255)
            })
        )
        .query(async ({ ctx, input }) => await getUserToCampaign({ db: ctx.db, input })),

    //  Updates a relationship

    update: publicProcedure
        .input(
            z.object({
                //  The user ID and the campaign ID of the relationship to update

                userId: z.string().max(255),
                campaignId: z.string().max(255),

                //  The relationship values to update

                subscribed: z.boolean().optional()
            })
        )
        .mutation(async ({ ctx, input }) => {
            //  Get the relationship

            const userToCampaign: GetUserToCampaignResult | undefined = await getUserToCampaign({ db: ctx.db, input })

            //  Throw an error if the relationship doesn't exist

            if (!userToCampaign) throw new TRPCError({ message: `A relationship between user "${input.userId}" and campaign "${input.campaignId}" does not exist`, code: "NOT_FOUND" })

            //  Update the relationship values

            await ctx.db
                .update(schema.usersToCampaigns)
                .set({
                    //  If truthy or `null`, we want to pass the input, otherwise keep the existing value

                    subscribed: input.subscribed
                })
                .where(and(eq(schema.usersToCampaigns.userId, input.userId), eq(schema.usersToCampaigns.campaignId, input.campaignId)))
        })
})
