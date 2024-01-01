// /**
//  * @file A router for manipulating users.
//  * @author Riley Barabash <riley@rileybarabash.com>
//  */

// import { createTRPCRouter, publicProcedure } from "~/server/api/trpc"
// import { schema } from "~/server/db"
// import { z } from "zod"

// export const messagesRouter = createTRPCRouter({
//     //  Creates a user

//     create: publicProcedure
//         .input(
//             z.object({
//                 //
//             })
//         )
//         .mutation(async ({ ctx, input }) => {

//             //  Inserts a new user into the database

//             await ctx.db.insert(schema.users).values({
//                 email: input.email,
//                 name: input.name,
//                 phone: input.phone,
//                 emailVerified: null
//             })

//             //  Returns the newly created user

//             return ""
//         })

//     // //  Creates a user

//     // create: publicProcedure
//     //     .input(
//     //         z.object({
//     //             //  Requires either an email or a phone number at minimum

//     //             name: z.string().max(255).nullish(),
//     //             email: z.string().email().max(255).nullish(),
//     //             phone: z.string().max(15).nullish()
//     //         })
//     //     )
//     //     .mutation(async ({ ctx, input }) => {
//     //         //  Throw an error if neither an email nor a phone number was provided

//     //         if (!input.email && !input.phone) throw new TRPCError({ message: "An email or phone number is required to create a user", code: "PRECONDITION_FAILED" })

//     //         //  Check the inputs for uniqueness

//     //         const inputIsUnique: boolean = await userIsUnique({ db: ctx.db, input })

//     //         //  Throw an error if the input data is not unique

//     //         if (!inputIsUnique)
//     //             throw new DatabaseError({
//     //                 name: "DUPLICATE_DATA",
//     //                 message: "Cannot create user: the identifiers provided conflict with those of another user",
//     //                 cause: input
//     //             })

//     //         //  Inserts a new user into the database

//     //         await ctx.db.insert(schema.users).values({
//     //             email: input.email,
//     //             name: input.name,
//     //             phone: input.phone,
//     //             emailVerified: null
//     //         })

//     //         //  Returns the newly created user

//     //         return (await getUser({ db: ctx.db, input }))[0]!
//     //     })
// })
