/**
 * @file A router for manipulating users.
 * @author Riley Barabash <riley@rileybarabash.com>
 *
 * @todo: Add functionality for the merging and management of duplicate users. For now, the `get` procedure just returns the first user. In the future, if a request to update or create a user fails because of a duplicate identifier, there should be a way to resolve the merge confict.
 * @todo: Consider updating the `flowsRouter` and flow schema to a many-to-many relationship (like `usersToCampaigns`), where "flows" are their own independent entities.
 * @todo: Convert all generic or tRPC errors over to a custom error class.
 */

import { usersToCampaignsRouter } from "./campaigns"
import { flowsRouter } from "./flows"
import { TRPCError } from "@trpc/server"
import { type GetUserResult, getUser, userIsUnique } from "~/server/api/helpers"
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc"
import { schema } from "~/server/db"
import { DatabaseError } from "~/errors"
import { eq } from "drizzle-orm"
import { z } from "zod"

export const usersRouter = createTRPCRouter({
    //  Creates a user

    create: publicProcedure
        .input(
            z.object({
                //  Requires either an email or a phone number at minimum

                name: z.string().max(255).nullish(),
                email: z.string().email().max(255).nullish(),
                phone: z.string().max(15).nullish()
            })
        )
        .mutation(async ({ ctx, input }) => {
            //  Throw an error if neither an email nor a phone number was provided

            if (!input.email && !input.phone) throw new TRPCError({ message: "An email or phone number is required to create a user", code: "PRECONDITION_FAILED" })

            //  Check the inputs for uniqueness

            const inputIsUnique: boolean = await userIsUnique({ db: ctx.db, input })

            //  Throw an error if the input data is not unique

            if (!inputIsUnique)
                throw new DatabaseError({
                    name: "DUPLICATE_DATA",
                    message: "Cannot create user: the identifiers provided conflict with those of another user",
                    cause: input
                })

            //  Inserts a new user into the database

            await ctx.db.insert(schema.users).values({
                email: input.email,
                name: input.name,
                phone: input.phone,
                emailVerified: null
            })

            //  Returns the newly created user

            return (await getUser({ db: ctx.db, input }))[0]!
        }),

    //  Gets a user

    get: publicProcedure
        .input(
            z.object({
                //  Will use the first identifier provided

                id: z.string().max(255).optional(),
                email: z.string().email().max(255).optional(),
                phone: z.string().max(15).optional()
            })
        )
        .query(async ({ ctx, input }) => (await getUser({ db: ctx.db, input }))[0]),

    //  Updates a user

    update: publicProcedure
        .input(
            z.object({
                //  The ID of the user to update

                id: z.string().max(255),

                //  The new values for the user

                name: z.string().max(255).nullish(),
                email: z.string().email().max(255).nullish(),
                phone: z.string().max(15).nullish()
            })
        )
        .mutation(async ({ ctx, input }) => {
            //  Get the user

            const user: GetUserResult | undefined = (await getUser({ db: ctx.db, input }))[0]

            //  Throw an error if the user doesn't exist

            if (!user) throw new TRPCError({ message: `Unable to update user: user with ID "${input.id}" does not exist`, code: "NOT_FOUND" })

            //  Check the inputs for uniqueness

            const inputIsUnique: boolean = await userIsUnique({ db: ctx.db, input })

            //  Throw an error if the input data is not unique

            if (!inputIsUnique)
                throw new DatabaseError({
                    name: "DUPLICATE_DATA",
                    message: "Cannot update user: the identifiers provided conflict with those of another user",
                    cause: input
                })

            //  Update the user values

            await ctx.db
                .update(schema.users)
                .set({
                    //  If truthy or `null`, we want to pass the input, otherwise keep the existing value

                    name: input.name,
                    email: input.email,
                    phone: input.phone
                })
                .where(eq(schema.users.id, input.id))
        }),

    //  Manipulate the user-campaign relationships of a user

    campaigns: usersToCampaignsRouter,

    //  Manipulate the flows of a user

    flows: flowsRouter
})
