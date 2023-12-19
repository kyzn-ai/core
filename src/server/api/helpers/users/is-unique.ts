/**
 * @file Checks if the inputs provided are unique, ignoring the subject user if an ID is provided.
 * @author Riley Barabash <riley@rileybarabash.com>
 *
 * @todo DEPRIORITIZED: Implement an error system that specifies the exact input that is a duplicate.
 */

import { type Drizzle, schema } from "~/server/db"
import { and, eq, ne, or } from "drizzle-orm"

//  Defines the input for the `userIsUnique` helper

export interface UserIsUniqueInput {
    id?: string
    email?: string | null
    phone?: string | null
}

//  Defines the props for the `userIsUnique` helper

export interface UserIsUniqueProps {
    //  The database

    db: Drizzle

    //  The input data

    input: UserIsUniqueInput
}

//  Defines some reusable logic for checking the uniqueness of a user

export async function userIsUnique({ db, input }: UserIsUniqueProps): Promise<boolean> {
    //  If none of the inputs provided are required to be unique, return true

    if (!input.email && !input.phone) return true

    //  Use the inputs try and match a user

    const users: unknown[] = await db
        .select({ id: schema.users.id })
        .from(schema.users)
        .where(and(or(input.email ? eq(schema.users.email, input.email) : undefined, input.phone ? eq(schema.users.phone, input.phone) : undefined), input.id ? ne(schema.users.id, input.id) : undefined))

    //  Returns true if no other users share the same email or phone

    return users.length === 0
}
