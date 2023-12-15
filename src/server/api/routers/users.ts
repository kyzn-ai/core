/**
 * @file A router for manipulating users.
 * @author Riley Barabash <riley@rileybarabash.com>
 */

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc"
import { type Drizzle, schema } from "~/server/db"
import { eq } from "drizzle-orm"
import { z } from "zod"

//  Define the input for the `getUserId` helper

interface GetUserIdProps {
    db: Drizzle
    input: {
        email?: string
        phoneNumber?: string
    }
}

//  Define some reusable logic for getting a user's ID

const getUserId = async ({ db, input }: GetUserIdProps): Promise<string | undefined> => {
    //  Declare a variable to store the result

    let result

    if (input.email) {
        //  Use the email to fetch the user ID

        result = await db
            .select({
                id: schema.users.id
            })
            .from(schema.users)
            .where(eq(schema.users.email, input.email))
    } else if (input.phoneNumber) {
        //  Use the phone number to fetch the user ID

        result = await db
            .select({
                id: schema.users.id
            })
            .from(schema.users)
            .where(eq(schema.users.phoneNumber, input.phoneNumber))
    } else {
        //  Throw an error if neither an email nor a phone number was provided

        throw new Error("Unable to get an ID: no email or phone number provided", { cause: { input } })
    }

    return result[0]?.id
}

export const usersRouter = createTRPCRouter({
    //  Creates a user

    create: publicProcedure
        .input(
            z.object({
                //  A user requires either an email or a phone number for identification

                email: z.string().email().max(255).optional(),
                phoneNumber: z.string().max(15).optional()
            })
        )
        .mutation(async ({ ctx, input }) => {
            //  Inserts a new user into the database

            await ctx.db.insert(schema.users).values({
                email: input.email ?? null,
                phoneNumber: input.phoneNumber ?? null,
                emailVerified: null
            })

            //  Return the ID of the newly created user

            return (await getUserId({ db: ctx.db, input }))!
        }),

    //  Gets a user's ID by either by matching an email or a phone number

    getId: publicProcedure
        .input(
            z.object({
                email: z.string().email().max(255).optional(),
                phoneNumber: z.string().max(15).optional()
            })
        )
        .query(async ({ ctx, input }) => await getUserId({ db: ctx.db, input })),

    //  Modifies a user

    modify: publicProcedure
        .input(
            z.object({
                //  The ID of the user to modify

                id: z.string().max(255),

                //  The new values for the user

                name: z.string().max(255).optional(),
                email: z.string().email().max(255).optional(),
                phoneNumber: z.string().max(15).optional()
            })
        )
        .mutation(async ({ ctx, input }) => {
            //  Update the user's name, email, and phone number if they were provided

            if (input.name) await ctx.db.update(schema.users).set({ name: input.name }).where(eq(schema.users.id, input.id))
            if (input.email) await ctx.db.update(schema.users).set({ email: input.email }).where(eq(schema.users.id, input.id))
            if (input.phoneNumber) await ctx.db.update(schema.users).set({ phoneNumber: input.phoneNumber }).where(eq(schema.users.id, input.id))
        })
})
