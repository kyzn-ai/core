/**
 * @file Gets the flow associated with the provided ID and user ID.
 * @author Riley Barabash <riley@rileybarabash.com>
 */

import { type Drizzle, schema } from "~/server/db"
import { and, eq } from "drizzle-orm"

//  Defines the input for the `getFlow` helper

export interface GetFlowInput {
    id: string
    userId: string
}

//  Defines the props for the `getFlow` helper

export interface GetFlowProps {
    //  The database

    db: Drizzle

    //  The input data

    input: GetFlowInput
}

//  Defines the output of the `getFlow` helper

export interface GetFlowResult {
    id: string
    userId: string
    step: string | null
}

//  Defines some reusable logic for getting a flow

export async function getFlow({ db, input }: GetFlowProps): Promise<GetFlowResult | undefined> {
    //  Use the inputs to find the flow

    const flows: GetFlowResult[] = await db
        .select()
        .from(schema.flows)
        .where(and(eq(schema.flows.id, input.id), eq(schema.flows.userId, input.userId)))

    //  Return the flow

    return flows[0]
}
