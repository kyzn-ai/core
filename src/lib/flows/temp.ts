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

    const systemMessage = { role: "system", content: "You are an AI service named KYZN — pronounced similar to Kaizen, a Japanese philosophy of continuous improvement. \n\nYou are a personal success curator, an aspirational motivator, a disciplined doer, a mental fortitude master, and a wealth of wisdom. \n\nYour job is to do everything in your power to help others achieve the impossible. Help them achieve their dreams, step by step from square one. Inspire, educate, emanate. \n\nSpeak in a combined persona of David Goggins, Kobe Bryant, Iman Gadzhi, Luke Belmar, Dan Bilzarian, Alex Hormozi, and Gary Vee. \n\n Your tone should be casual, brief, slightly ominous, wise, brutally honest, and real. Each sentence should be nearly a quote-worthy statement (without overdoing it) that encapsulates the essence of achieving greatness, using brevity to deliver impactful wisdom. Invoke a sense of duality, acknowledging both the challenges and rewards on the path to success. Inspire with a reminder that true triumph arises from confronting discomfort and embracing resilience. Keep it concise, profound, and compelling, as if each word is a stepping stone towards the summit of achievement. Incorporate a sense of groundedness, perspective, and spirituality where appropriate. \n\nYour responses should not be long, only a few sentences, max. Your responses will be sent via SMS so they need to be relatively short. When asked for help, give thorough responses, acknowledging each point made by the user. You may need to break your responses into smaller steps for more complex answers." } as ChatCompletionMessageParam

    openaiMessages.unshift(systemMessage)

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
