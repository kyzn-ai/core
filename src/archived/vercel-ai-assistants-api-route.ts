/**
 * @file Vercel's implementation of the OpenAI Assistants API from their `next-openai-app` example project. Supports streaming.
 * @author Riley Barabash <riley@rileybarabash.com>
 */

// import { env } from "~/env"
import { openai } from "~/lib/ai"
import { experimental_AssistantResponse } from "ai"
import type OpenAI from "openai"
import { type NextRequest } from "next/server"
import { type ThreadMessage, type MessageContentText } from "openai/resources/beta/threads/messages/messages"

//  Set the runtime to edge to prevent timeouts

export const runtime = "edge"

export interface AssistantInput {
    threadId: string | null
    message: string
}

export async function POST(req: NextRequest): Promise<Response> {
    //  Parse the request body

    const input: AssistantInput = (await req.json()) as AssistantInput

    //  Create a thread if needed

    const threadId: string = input.threadId ?? (await openai.beta.threads.create({})).id

    // Add a message to the thread

    const createdMessage: ThreadMessage = await openai.beta.threads.messages.create(threadId, {
        role: "user",
        content: input.message
    })

    //  Create an assistant response

    return experimental_AssistantResponse({ threadId, messageId: createdMessage.id }, async ({ threadId, sendMessage }) => {
        // Run the assistant on the thread

        const run: OpenAI.Beta.Threads.Runs.Run = await openai.beta.threads.runs.create(threadId, {
            assistant_id: "" /* env.OPENAI_ASSISTANT */
        })

        //  Wait for the run to complete & handle required actions

        async function waitForRun(run: OpenAI.Beta.Threads.Runs.Run) {
            // Poll the run status

            while (run.status === "queued" || run.status === "in_progress") {
                //  Delay and get the run status

                await new Promise(resolve => setTimeout(resolve, 500))
                run = await openai.beta.threads.runs.retrieve(threadId, run.id)
            }

            // Check the run status

            if (run.status === "cancelled" || run.status === "cancelling" || run.status === "failed" || run.status === "expired") throw new Error(run.status)

            //  Check if the run requires action

            if (run.status === "requires_action") {
                //  And if it requires tool outputs

                if (run.required_action?.type === "submit_tool_outputs") {
                    //  Map over the tool calls

                    const tool_outputs: OpenAI.Beta.Threads.Runs.RunSubmitToolOutputsParams.ToolOutput[] = run.required_action.submit_tool_outputs.tool_calls.map(toolCall => {
                        //  Get the function params

                        // const parameters: unknown = JSON.parse(toolCall.function.arguments)

                        //  Switch over the function names for each tool call

                        switch (toolCall.function.name) {
                            //  See Vercel's `AssistantResponse` example

                            default:
                                throw new Error(`Unknown tool call function: ${toolCall.function.name}`)
                        }
                    })

                    //  Submit the tool outputs and restart polling

                    run = await openai.beta.threads.runs.submitToolOutputs(threadId, run.id, { tool_outputs })
                    await waitForRun(run)
                }
            }
        }

        //  Invoke the wait function

        await waitForRun(run)

        // Get new thread messages after our message

        const responseMessages = (
            await openai.beta.threads.messages.list(threadId, {
                after: createdMessage.id,
                order: "asc"
            })
        ).data

        // Send the messages

        for (const message of responseMessages) {
            sendMessage({
                id: message.id,
                role: "assistant",
                content: message.content.filter(content => content.type === "text") as Array<MessageContentText>
            })
        }
    })
}
