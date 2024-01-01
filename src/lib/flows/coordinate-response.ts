import { temp } from "~/lib/flows"
import { api } from "~/trpc/server"
import { type DecodeParamsResult } from "~/lib/sms"

//  Manages the use of response flows

export const coordinateResponse = async ({ Body: content, From: sender, ..._ }: DecodeParamsResult): Promise<string | null> => {
    //  Get the sender's user ID, creating a new user if they don't exist & storing the returned ID

    const { id: userId } = (await api.users.get.query({ phone: sender })) ?? (await api.users.create.mutate({ phone: sender }))

    //  TODO: Switch over the available flows, choosing the appropriate one based on the sender's response & the most recent flow (get the `name` column from the most recent row in the `flows` table that matches the `userId`)

    /*

    const flowName: string = await api.flows.getLatestName.query({ userId })

    switch (content.toLowerCase().trim()) {

        //  If the sender resonds with "ai", opt them in to growth updates

        case "ai": break

    }
    
    */

    //  Catch all (the default response)

    return await temp({ userId, content, number: sender })
    // return await optIn.growthUpdates({ userId, content })
}
