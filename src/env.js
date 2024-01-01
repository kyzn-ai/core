/**
 * @file Uses Zod to create an ENV schema, and exports environment variables validated against the schema.
 * @author Riley Barabash <riley@rileybarabash.com>
 *
 * @todo: Convert the errors to a custom error class & rework error messages to follow convention.
 */

import { createEnv } from "@t3-oss/env-nextjs"
import { z } from "zod"

//  Defines a schema for the environment variables

export const env = createEnv({
    //  Values available server-side only

    server: {
        //  Defaults to development if not set

        NODE_ENV: z.enum(["development", "test", "production"]).optional(),
        ENV: z.enum(["development", "test", "production"]).default("development"),

        BASE_URL: z.preprocess(
            value => {
                //  Throw an error in prod if a production URL isn't provided & the app is being run outside of Vercel

                if ((process.env.NODE_ENV ?? process.env.ENV) === "production" && !process.env.BASE_URL && !process.env.VERCEL) throw new Error("You forgot to configure the `BASE_URL` environment variable")

                //  If in production, use the `BASE_URL` or the `VERCEL_URL` if building on Vercel, otherwise use the `DEV_BASE_URL`

                return (process.env.NODE_ENV ?? process.env.ENV) === "production" ? value ?? `https://${process.env.VERCEL_URL}` : process.env.DEV_BASE_URL
            },

            z.string().url()
        ),

        DEV_BASE_URL: z.preprocess(
            //  Passes the original value if it exists, otherwise passes the localhost

            value => value ?? `http://localhost:${process.env.PORT ?? 3000}`,
            z.string().url()
        ),

        DATABASE_URL: z
            .preprocess(value => {
                //  If the database test strategy is set to "branch" and the app is not running in production, return the `TEST_DATABASE_URL`, otherwise return the original value

                // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
                return process.env.TEST_DATABASE_STRATEGY === "branch" && (process.env.DATABASE_ENV || (process.env.NODE_ENV ?? process.env.ENV)) !== "production" ? process.env.TEST_DATABASE_URL : value
            }, z.string().url())
            .refine(
                value => {
                    //  Checks for template values in the URL

                    return !value.includes("USERNAME") && !value.includes("PASSWORD") && !value.includes("DATABASENAME")
                },

                //  If the check fails, throw an error

                "You forgot to configure the `DATABASE_URL` environment variable"
            ),

        TEST_DATABASE_URL: z.preprocess(
            value => {
                //  Throw an error in development if the database test strategy is set to "branch" and the `TEST_DATABASE_URL` is missing

                if ((process.env.NODE_ENV ?? process.env.ENV) !== "production" && process.env.TEST_DATABASE_STRATEGY === "branch" && !process.env.TEST_DATABASE_URL) throw new Error('You need a test database connection URL for the "branch" database strategy')

                //  Checks for template values in the URL

                if (typeof value === "string" && (value?.includes("USERNAME") || value?.includes("PASSWORD") || value?.includes("DATABASENAME"))) throw new Error("You forgot to configure the `TEST_DATABASE_URL` environment variable")

                return value
            },

            z.string().url().optional()
        ),

        DATABASE_ENV: z.enum(["production", "development", "test"]).optional(),
        DATABASE_TABLE_PREFIX: z.string().optional(),

        //  Defaults to "mps" if not set

        TEST_DATABASE_STRATEGY: z.enum(["mps", "branch"]).default("mps"),

        INTERNAL_SECRET: z.string(),

        //  Requires a value in production

        NEXTAUTH_SECRET: (process.env.NODE_ENV ?? process.env.ENV) === "production" ? z.string() : z.string().optional(),

        RESEND_SECRET: z.string(),

        OPENAI_SECRET: z.string(),
        OPENAI_ORGANIZATION: z.string(),

        TWILIO_SID: z.string(),
        TWILIO_SECRET: z.string(),
        TWILIO_NUMBER: z.string(),
        TWILIO_TEST_NUMBER: z.string()
    },

    //  Values exposed to the client — prefix each with `NEXT_PUBLIC_`

    client: {},

    //  You can't access `process.env` as a regular object in the Next.js edge runtimes (e.g., middlewares) or client-side, so we need to destructure manually for use cases that require the original environment variable values

    runtimeEnv: {
        NODE_ENV: process.env.NODE_ENV,
        ENV: process.env.ENV,
        BASE_URL: process.env.BASE_URL,
        DEV_BASE_URL: process.env.DEV_BASE_URL,

        DATABASE_URL: process.env.DATABASE_URL,
        TEST_DATABASE_URL: process.env.TEST_DATABASE_URL,
        DATABASE_ENV: process.env.DATABASE_ENV,
        DATABASE_TABLE_PREFIX: process.env.DATABASE_TABLE_PREFIX,
        TEST_DATABASE_STRATEGY: process.env.TEST_DATABASE_STRATEGY,

        INTERNAL_SECRET: process.env.INTERNAL_SECRET,

        NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,

        RESEND_SECRET: process.env.RESEND_SECRET,

        OPENAI_SECRET: process.env.OPENAI_SECRET,
        OPENAI_ORGANIZATION: process.env.OPENAI_ORGANIZATION,

        TWILIO_SID: process.env.TWILIO_SID,
        TWILIO_SECRET: process.env.TWILIO_SECRET,
        TWILIO_NUMBER: process.env.TWILIO_NUMBER,
        TWILIO_TEST_NUMBER: process.env.TWILIO_TEST_NUMBER
    },

    //  Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation — this is especially useful for Docker builds

    skipValidation: !!process.env.SKIP_ENV_VALIDATION,

    //  Makes it so that empty strings validated with `z.string` are treated as undefined, and will throw an error

    emptyStringAsUndefined: true
})
