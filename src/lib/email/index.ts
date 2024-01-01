/**
 * @file Initializes and exports a shared `Resend` instance.
 * @author Riley Barabash <riley@rileybarabash.com>
 */

import { env } from "~/env"
import { Resend } from "resend"

export const resend: Resend = new Resend(env.RESEND_SECRET)
