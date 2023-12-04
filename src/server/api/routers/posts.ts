/**
 * @file A router for manipulating posts.
 * @author Riley Barabash <riley@rileybarabash.com>
 */

import { createTRPCRouter, protectedProcedure, publicProcedure } from "~/server/api/trpc"
import { posts } from "~/server/db/schemas/misc"
import { z } from "zod"

export const postsRouter = createTRPCRouter({
    //  Creates a post

    create: protectedProcedure.input(z.object({ content: z.string().min(1) })).mutation(async ({ ctx, input }) => {
        //  DEBUG: Simulates a slow db call

        /* await new Promise(resolve => setTimeout(resolve, 1000)) */

        //  Inserts a new post into the database

        await ctx.db.insert(posts).values({
            content: input.content,
            createdById: ctx.session.user.id
        })
    }),

    //  Retrieves the most recent post

    getMostRecent: publicProcedure.query(({ ctx }) => {
        return ctx.db.query.posts.findFirst({
            //  Sorts the posts by the createdAt value in descending order

            orderBy: (posts, { desc }) => [desc(posts.createdAt)]
        })
    }),

    //  Deletes all posts

    deleteAll: protectedProcedure.mutation(async ({ ctx }) => await ctx.db.delete(posts))
})
