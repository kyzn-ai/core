/**
 * @file Gets the user associated with the provided ID, email, or phone number.
 * @author Riley Barabash <riley@rileybarabash.com>
 */

import { TRPCError } from "@trpc/server"
import { type Drizzle, schema } from "~/server/db"
import { eq } from "drizzle-orm"

//  Defines the input for the `getUser` helper

export interface GetUserInput {
    id?: string | null
    email?: string | null
    phone?: string | null
}

//  Defines the props for the `getUser` helper

export interface GetUserProps {
    //  The database

    db: Drizzle

    //  The input data

    input: GetUserInput
}

//  Defines the output of the `getUser` helper

export interface GetUserResult {
    id: string
    name: string | null
    email: string | null
    phone: string | null
}

//  Defines some reusable logic for getting a user

export async function getUser({ db, input }: GetUserProps): Promise<GetUserResult[]> {
    //  Throw an error if no inputs are provided

    if (!input.id && !input.email && !input.phone) throw new TRPCError({ message: "At least one valid input property is required to fetch a user", code: "PRECONDITION_FAILED" })

    //  Use the inputs to find the user

    const users: GetUserResult[] = await db
        .select({
            id: schema.users.id,
            name: schema.users.name,
            email: schema.users.email,
            phone: schema.users.phone
        })
        .from(schema.users)
        .where(input.id ? eq(schema.users.id, input.id) : input.email ? eq(schema.users.email, input.email) : eq(schema.users.phone, input.phone!))

    //  Return the array of users (should only be one unless the user's phone or email is used by multiple accounts)

    return users
}
