/**
 * @file ??
 * @author Riley Barabash <riley@rileybarabash.com>
 *
 * @todo
 */

import { env } from "~/env"
import { createCompletion } from "~/background"

//  The props for the `mirror` flow

export interface TempParams {
    //  The user ID

    userId: string

    //  The content of the message

    content: string
}

//  The flow that interfaces the user with a mirror

export async function temp({ userId, content }: TempParams): Promise<string | null> {
    //  Store the user's message in the database in the default thread

    const { messages } = await api.users.theads.append.mutate({ userId, content })

    //  Check if the user has a default LLM configuration, else create it

    //  Create a chat completion on a deferred endpoint, with a callback URL to the "/api/defer" route with the result

    await createCompletion({ messages, model })

    //  Store the result in the database, and in the RFLKT thread with the "assistant" role

    //  Send a response to the user

    return null
}

export interface LLMConfiguration {
    model: string
    provider: string
}

export interface Message {
    role: string
    content: string | null
    metadata: JSON
}

import { aliases } from "~/config"

export interface CreateCompletionOptions {
    messages: Message[]
    config: LLMConfiguration
}

import { openai } from "~/lib/ai/openai"

export interface CreateCompletionResult {
    messages: Message[]

}




