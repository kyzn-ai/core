/**
 * @file Gets the relationship associated with the provided user ID and campaign ID.
 * @author Riley Barabash <riley@rileybarabash.com>
 */

import { type Drizzle, schema } from "~/server/db"
import { and, eq } from "drizzle-orm"

//  Defines the input for the `getUserToCampaign` helper

export interface GetUserToCampaignInput {
    userId: string
    campaignId: string
}

//  Defines the props for the `getUserToCampaign` helper

export interface GetUserToCampaignProps {
    //  The database

    db: Drizzle

    //  The input data

    input: GetUserToCampaignInput
}

//  Defines the output of the `getUserToCampaign` helper

export interface GetUserToCampaignResult {
    userId: string
    campaignId: string
    subscribed: boolean
}

//  Defines some reusable logic for getting a relationship

export async function getUserToCampaign({ db, input }: GetUserToCampaignProps): Promise<GetUserToCampaignResult | undefined> {
    //  Use the inputs to find the relationship

    const usersToCampaigns: GetUserToCampaignResult[] = await db
        .select()
        .from(schema.usersToCampaigns)
        .where(and(eq(schema.usersToCampaigns.userId, input.userId), eq(schema.usersToCampaigns.campaignId, input.campaignId)))

    //  Return the relationship

    return usersToCampaigns[0]
}
