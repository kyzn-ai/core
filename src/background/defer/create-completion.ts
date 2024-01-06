
import { defer } from "@defer/client"
import { withCallback} from "~/utils"
import { config } from "~/config"
import { env } from "~/env"
import { openai } from "~/lib/ai"


async function createCompletion({ messages, config }: CreateCompletionOptions) {
    switch (config.provider) {
        case "openai":
            const response = await openai.chat.completions.create({
                messages,
                model
            })

            return {
                role: 

            }

        default:
            throw Error("WHat")
    }
}

export default defer(
    withCallback(
        createCompletion,
        {
            url: config.aliases.urls.functions.background.ai.completion,
            authToken: env.INTERNAL_SECRET
        }
        )
    )