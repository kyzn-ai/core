/**
 * @file Initializes and exports a shared `OpenAI` instance.
 * @author Riley Barabash <riley@rileybarabash.com>
 */

import { env } from "~/env"
import OpenAI from "openai"

export const openai = new OpenAI({
    apiKey: env.OPENAI_SECRET,
    organization: env.OPENAI_ORGANIZATION
})