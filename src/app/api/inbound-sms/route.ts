import { type NextRequest } from "next/server"
import recieveAndReply from "./recieve-and-reply"

//  Handle incoming Twilio requests

export async function POST(req: NextRequest) {

    //  Reply to the sender

    return await recieveAndReply(req, ({ Body: content, From: sender }) => {

        //  Template response

        return `Message received: "${content}" from ${sender}`

    }, true)

}