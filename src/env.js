/**
 * @file Uses Zod to create an ENV schema, and exports environment variables validated against the schema.
 * @author Riley Barabash <riley@rileybarabash.com>
 */

import { createEnv } from "@t3-oss/env-nextjs"
import { z } from "zod"

//  Defines a schema for the environment variables

export const env = createEnv({
    //  Values available server-side only

    server: {
        //  Defaults to development if not set

        NODE_ENV: z.enum(["development", "test", "production"]).default("development"),

        BASE_URL: z.preprocess(
            //  Passes the original value if it exists, otherwise passes the `VERCEL_URL` if building on Vercel to ensure successful deployments, otherwise passes the localhost, then validates it as a URL

            value => (value ?? !!process.env.VERCEL ? `https://${process.env.VERCEL_URL}` : `http://localhost:${process.env.PORT ?? 3000}`),
            z.string().url()
        ),

        DATABASE_URL: z
            .string()
            .url()
            .refine(
                value => {
                    //  Checks for template values in the URL

                    return !value.includes("USERNAME") && !value.includes("PASSWORD") && !value.includes("DATABASENAME")
                },

                //  If the check fails, throw an error

                "You forgot to configure the `DATABASE_URL` environment variable."
            ),

        //  Requires a value in production

        NEXTAUTH_SECRET: process.env.NODE_ENV === "production" ? z.string() : z.string().optional(),

        RESEND_SECRET: z.string(),
        OPENAI_SECRET: z.string()
    },

    //  Values exposed to the client — prefix each with `NEXT_PUBLIC_`

    client: {
        NEXT_PUBLIC_BASE_URL: z.preprocess(
            //  Passes the original value if it exists, otherwise passes the `VERCEL_URL` if building on Vercel to ensure successful deployments, otherwise passes the localhost, then validates it as a URL

            value => (value ?? !!process.env.VERCEL ? `https://${process.env.VERCEL_URL}` : `http://localhost:${process.env.PORT ?? 3000}`),
            z.string().url()
        )
    },

    //  You can't access `process.env` as a regular object in the Next.js edge runtimes (e.g., middlewares) or client-side, so we need to destructure manually for use cases that require the original environment variable values

    runtimeEnv: {
        NODE_ENV: process.env.NODE_ENV,
        BASE_URL: process.env.BASE_URL,
        DATABASE_URL: process.env.DATABASE_URL,
        NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
        RESEND_SECRET: process.env.RESEND_SECRET,
        OPENAI_SECRET: process.env.OPENAI_SECRET,

        NEXT_PUBLIC_BASE_URL: process.env.BASE_URL
    },

    //  Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation — this is especially useful for Docker builds

    skipValidation: !!process.env.SKIP_ENV_VALIDATION,

    //  Makes it so that empty strings validated with `z.string` are treated as undefined, and will throw an error

    emptyStringAsUndefined: true
})
