/**
 * @file ??
 * @author Riley Barabash <riley@rileybarabash.com>
 *
 * @todo
 */

// import { env } from "~/env"
import { and, asc, eq } from "drizzle-orm"
import type { ChatCompletionMessageParam } from "openai/resources/index.mjs"
import createCompletion from "~/background/defer/create-completion"
import { env } from "~/env"
import { db, schema } from "~/server/db"
import { type Message } from "~/server/db/schemas"

//  The props for the `mirror` flow

export interface TempParams {
    //  The user ID

    userId: string

    //  The content of the message

    content: string

    number: string
}

//  The flow that interfaces the user with a mirror

export async function temp({ userId, content, number }: TempParams): Promise<string | null> {
    //  Store the user's message in the database in the default thread

    console.log("Strategy:", process.env.TEST_DATABASE_STRATEGY)
    console.log("DatabaseEnv:", process.env.DATABASE_ENV)
    console.log("NodeEnv:", process.env.NODE_ENV)
    console.log("DatabaseURL:", process.env.DATABASE_URL)

    console.log("Strategy:", env.TEST_DATABASE_STRATEGY)
    console.log("DatabaseEnv:", env.DATABASE_ENV)
    console.log("NodeEnv:", env.NODE_ENV)
    console.log("DatabaseURL:", env.DATABASE_URL)

    await db.insert(schema.messages).values({
        userId,
        llmConfigurationId: "replace",
        role: "user",
        threadId: "replace",
        content
    })

    const messages = await db.query.messages.findMany({
        where: and(eq(schema.messages.userId, userId), eq(schema.messages.threadId, "replace")),
        orderBy: [asc(schema.messages.createdAt)]
    })

    await db.insert(schema.usageMetrics).values({
        userId,
        event: "sms",
        eventId: messages[messages.length - 1]!.id,
        unit: "count",
        value: 1
    })

    // function formatMessages

    function convertToOpenAIMessages(messages: Message[]): ChatCompletionMessageParam[] {
        return messages.map(messages => {
            const openaiMessage = {
                role: messages.role,
                content: messages.content
            }

            return openaiMessage as ChatCompletionMessageParam
        })
    }

    const openaiMessages = convertToOpenAIMessages(messages as unknown as Message[])

    // const { messages } = await api.users.messages.create.mutate({ userId, content })

    //  Check if the user has a default LLM configuration, else create it

    //  Create a chat completion on a deferred endpoint, with a callback URL to thex "/api/defer" route with the result

    console.log(openaiMessages)

    await createCompletion(openaiMessages, { provider: "openai", model: "gpt-3.5-turbo-1106", number, userId, messageId: messages[messages.length - 1]!.id })

    //  Store the result in the database, and in the RFLKT thread with the "assistant" role

    //  Send a response to the user

    return null
}

export interface LLMConfiguration {
    model: string
    provider: string
}

// export interface Message {
//     role: string
//     content: string | null
//     metadata: JSON
// }

// import { aliases } from "~/config"

export interface CreateCompletionOptions {
    messages: Message[]
    config: LLMConfiguration
}

// import { openai } from "~/lib/ai/openai"

export interface CreateCompletionResult {
    messages: Message[]
}
