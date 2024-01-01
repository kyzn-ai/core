import { defer } from "@defer/client"
import { withCallback } from "~/utils"
import { config } from "~/config"
import { env } from "~/env"
import { openai } from "~/lib/ai"
import type { ChatCompletionMessageParam } from "openai/resources/chat/index.mjs"

interface CreateCompletionOptions {
    provider: string
    model: string
    number: string
    userId: string
    messageId: string
}

async function createCompletion(messages: unknown[], opts: CreateCompletionOptions) {
    await withCallback(
        async (messages: unknown[], { model, number, userId, messageId }: CreateCompletionOptions) => {
            // switch (provider) {
            //     case "openai":

            //         return {
            //             role:

            //         }

            //     default:
            //         throw Error("WHat")
            // }

            const response = await openai.chat.completions.create({
                messages: messages as unknown as ChatCompletionMessageParam[],
                model
            })

            console.log(config.aliases.urls.functions.background.ai.completion)
            console.log(process.env.NODE_ENV)

            console.log(response.choices[0]?.message.content)

            return { message: response.choices[0]?.message.content, number, userId, tokens: response.usage?.total_tokens, messageId }
        },
        {
            url: config.aliases.urls.functions.background.ai.completion,
            authToken: env.INTERNAL_SECRET
        }
    )(messages, opts)
}

export default defer(createCompletion)
