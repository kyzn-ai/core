/**
 * @file Opts the user in to recieve growth updates for AMNESIA.
 * @author Riley Barabash <riley@rileybarabash.com>
 *
 * @todo DEPRIORITIZED: Move the campaign status check to the `responseCoordinator`, and create the campaigns somewhere else such as the admin dashboard.
 */

import { en } from "~/i18n/locales"
import { api } from "~/trpc/server"
import { resolveTRPCError, toTitleCase } from "~/utils"
import { z } from "zod"
import { DatabaseError } from "~/errors"

//  The ID of the `growthUpdates` flow and campaign

export const growthUpdatesFlowId = "growth-updates-opt-in"
export const growthUpdatesCampaignId = "growth-updates"

//  The steps of the `growthUpdates` flow

enum GrowthUpdatesFlowStep {
    Confirmation = "confirmation",
    Name = "name",
    Email = "email",
    Complete = "complete"
}

//  The props for the `growthUpdates` flow

export interface GrowthUpdatesParams {
    //  The user ID

    userId: string

    //  The content of the message

    content: string
}

//  The campaign flow for opting in to growth updates

export async function growthUpdates({ userId, content }: GrowthUpdatesParams): Promise<string> {
    //  Get the campaign, creating a new campaign if it don't exist and storing the campaign status

    const campaign = (await api.campaigns.get.query({ id: growthUpdatesCampaignId })) ?? (await api.campaigns.create.mutate({ id: growthUpdatesCampaignId, active: true }))

    //  Throw an error if the campaign is not active

    if (!campaign.active) throw new Error(`Campaign "${campaign.id}" is not currently active`)

    //  Get the flow step, creating a new flow if it don't exist and storing the step

    const { step: flowStep } = ((await api.users.flows.get.query({ id: growthUpdatesFlowId, userId })) ?? (await api.users.flows.create.mutate({ id: growthUpdatesFlowId, userId }))) as { step: GrowthUpdatesFlowStep | null }

    //  Get the user's campaign subscription status, creating a new user-campaign relationship if it don't exist and storing the subscription status

    const { subscribed: isSubscribed } = (await api.users.campaigns.get.query({ userId, campaignId: growthUpdatesCampaignId })) ?? (await api.users.campaigns.create.mutate({ userId, campaignId: growthUpdatesCampaignId }))

    //  If the user wants to opt out, update the campaign and return a confirmation

    if (content.toLowerCase().trim() === "unsubscribe") {
        await api.users.campaigns.update.mutate({ userId, campaignId: growthUpdatesCampaignId, subscribed: false })
        return en.optIn.growthUpdates.unsubscribe
    }

    //  If the user has opted out and has already completed the confirmation step, return the resubscribe message, or reactivate the campaign if the user confirms and continue

    if (!isSubscribed && flowStep && flowStep !== GrowthUpdatesFlowStep.Confirmation) {
        if (content.toLowerCase().trim() !== "yes") return en.optIn.growthUpdates.resubscribe
        else await api.users.campaigns.update.mutate({ userId, campaignId: growthUpdatesCampaignId, subscribed: true })
    }

    //  Determine the response based on the flow step

    switch (flowStep) {
        case null:
            //  Send the introduction, and update the flow step to "confirmation"

            await api.users.flows.update.mutate({ id: growthUpdatesFlowId, userId, step: GrowthUpdatesFlowStep.Confirmation })
            return en.optIn.growthUpdates.introduction

        case GrowthUpdatesFlowStep.Confirmation:
            //  If the the user opts in, send the `confirmation` response, turn the campaign on, and update the flow step to "name", otherwise send the failure response

            if (content.toLowerCase().trim() === "yes") {
                await api.users.flows.update.mutate({ id: growthUpdatesFlowId, userId, step: GrowthUpdatesFlowStep.Name })
                await api.users.campaigns.update.mutate({ userId, campaignId: growthUpdatesCampaignId, subscribed: true })
                return en.optIn.growthUpdates.confirmation.success
            } else return en.optIn.growthUpdates.confirmation.failure

        case GrowthUpdatesFlowStep.Name:
            //  If the response is greater than one character, update the user's name, send the `name` response, and update the flow step to "email", otherwise send the failure response

            if (content.toLowerCase().trim().length > 0) {
                await api.users.update.mutate({ id: userId, name: toTitleCase(content.trim()) })
                await api.users.flows.update.mutate({ id: growthUpdatesFlowId, userId, step: GrowthUpdatesFlowStep.Email })
                return en.optIn.growthUpdates.name.success({ firstName: toTitleCase(content.trim().split(" ")[0]!) })
            } else return en.optIn.growthUpdates.name.failure

        case GrowthUpdatesFlowStep.Email:
            //  Check the response is a valid email, otherwise send the generic failure response

            if (z.string().email().max(255).safeParse(content.toLowerCase().trim()).success) {
                try {
                    //  Try to update the user's email

                    await api.users.update.mutate({ id: userId, email: content.toLowerCase().trim() })
                } catch (error) {
                    //  Send the `duplicateData` error response if the mutation fails

                    if (resolveTRPCError(error, DatabaseError)?.name === "DUPLICATE_DATA") return en.optIn.growthUpdates.email.failure.duplicateData
                }
                //  Send the `email` response, and update the flow step to "complete"

                await api.users.flows.update.mutate({ id: growthUpdatesFlowId, userId, step: GrowthUpdatesFlowStep.Complete })
                return en.optIn.growthUpdates.email.success
            } else return en.optIn.growthUpdates.email.failure.generic

        case GrowthUpdatesFlowStep.Complete:
            //  Send the user the `complete` response

            return en.optIn.growthUpdates.complete
    }
}
