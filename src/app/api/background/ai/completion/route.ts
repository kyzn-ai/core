//  This endpoint will be hit when the deferred function completes, and this will ultimately call another endpoint which will (for now) just respond to the user, ideally it would call a task sorting route of some sort, which would get the defer task from the db, get the continuation id, and continue the flow. Skipping through code could be done with if (!continueID || continueID != "xxx")

/**
 * @file The webhook endpoint that recieves inbound SMS message requests from Twilio.
 * @author Riley Barabash <riley@rileybarabash.com>
 */
import { and, desc, eq } from "drizzle-orm"
import { NextResponse, type NextRequest } from "next/server"
import { sendMessage } from "~/lib/sms"
import { db, schema } from "~/server/db"

export async function POST(req: NextRequest): Promise<NextResponse> {
    //  Decode the request

    console.log("HIT!")

    const { userId, number, message, tokens } = ((await req.json()) as { result: { message: string; number: string; userId: string; tokens: number | undefined } }).result

    // console.log(request)

    await db.insert(schema.messages).values({
        userId,
        llmConfigurationId: "replace",
        role: "assistant",
        threadId: "replace",
        content: message
    })

    const completion = await db.query.messages.findFirst({
        where: and(eq(schema.messages.userId, userId), eq(schema.messages.threadId, "replace")),
        orderBy: [desc(schema.messages.createdAt)]
    })

    console.log(completion)

    await db.insert(schema.usageMetrics).values({
        userId,
        event: "completion",
        eventId: completion?.id,
        unit: "tokens",
        value: tokens ?? 0
    })

    await sendMessage({ content: message, to: number })

    await db.insert(schema.usageMetrics).values({
        userId,
        event: "sms",
        eventId: completion?.id,
        unit: "count",
        value: 1
    })
    return new NextResponse(null, {
        status: 200
    })
}
