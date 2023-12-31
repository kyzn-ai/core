/**
 * @file Creates an authentication configuration for Auth.js.
 * @author Riley Barabash <riley@rileybarabash.com>
 *
 * @todo Implement the pages that are commented out.
 * @todo Add a custom provider for SMS.
 */

import { preferences } from "~/preferences"
import { db } from "~/server/db"
import { createSenderIdentity, mysqlTable } from "~/utils"
import { sendVerificationRequest } from "~/utils/send-verification-request"
import { DrizzleAdapter } from "@auth/drizzle-adapter"
import { type DefaultSession, getServerSession, type NextAuthOptions } from "next-auth"
import { type EmailConfig } from "next-auth/providers/email"

/**
 * Adds types to `next-auth` via module augmentation.
 *
 * Allows for custom properties on the `session` object.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
    interface Session extends DefaultSession {
        //  Add custom session properties

        user: { id: string } & DefaultSession["user"]
    }
}

/**
 * Configures Auth.js providers, adapters, and callbacks.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
    //  Contains a single email provider for magic links

    providers: [
        {
            id: "email",
            type: "email",
            from: createSenderIdentity({ email: preferences.brand.emails.noReply }),
            server: {},

            //  Expires after 30 minutes

            maxAge: 30 * 60,

            name: "Email",
            options: {},
            sendVerificationRequest
        } satisfies EmailConfig
    ],

    callbacks: {
        //  Updates the session to include the user ID

        session: ({ session, user }) => ({
            ...session,
            user: {
                ...session.user,
                id: user.id
            }
        })
    },

    //  Custom pages

    pages: {
        signIn: "/signin",
        signOut: "/signout",
        verifyRequest: "/signin/verification/token"

        // Error code passed in query string as ?error=

        // error: "/error",

        // New users will be directed here on first sign in (leave the property out if not of interest)

        // newUser: "/auth/new-user"
    },

    //  Contains the core functionality needed for interfacing Auth.js with a database

    adapter: DrizzleAdapter(db, mysqlTable)
}

/**
 * Wraps `getServerSession` so that you don't need to import `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = () => getServerSession(authOptions)
