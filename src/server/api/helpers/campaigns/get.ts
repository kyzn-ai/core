/**
 * @file Gets the campaign associated with the provided ID.
 * @author Riley Barabash <riley@rileybarabash.com>
 */

import { type Drizzle, schema } from "~/server/db"
import { eq } from "drizzle-orm"

//  Defines the input for the `getCampaign` helper

export interface GetCampaignInput {
    id: string
}

//  Defines the props for the `getCampaign` helper

export interface GetCampaignProps {
    //  The database

    db: Drizzle

    //  The input data

    input: GetCampaignInput
}

//  Defines the output of the `getCampaign` helper

export interface GetCampaignResult {
    id: string
    active: boolean
}

//  Defines some reusable logic for getting a campaign

export async function getCampaign({ db, input }: GetCampaignProps): Promise<GetCampaignResult | undefined> {
    //  Use the inputs to find the campaign

    const campaigns: GetCampaignResult[] = await db.select().from(schema.campaigns).where(eq(schema.campaigns.id, input.id))

    //  Return the campaign

    return campaigns[0]
}
