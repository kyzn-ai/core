/**
 * @file Initializes and exports a shared `Stripe` instance.
 * @author Riley Barabash <riley@rileybarabash.com>
 */

import { env } from "~/env"
import Stripe from "stripe"

export const stripe = new Stripe((env.NODE_ENV ?? env.ENV) !== "production" ? env.STRIPE_TEST_SK : env.STRIPE_SK, {
    apiVersion: "2023-10-16"
})
