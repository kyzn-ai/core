/**
 * @file Creates an authentication configuration for Auth.js.
 * @author Riley Barabash <riley@rileybarabash.com>
 */

import { DrizzleAdapter } from "@auth/drizzle-adapter"
import { preferences } from "~/preferences"
import { db } from "~/server/db"
import { mysqlTable } from "~/utils"
import { createSenderIdentity, sendVerificationRequest } from "~/utils"
import { type DefaultSession, getServerSession, type NextAuthOptions } from "next-auth"

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
            from: createSenderIdentity({
                senderEmail: preferences.brand.emails.auth
            }),
            server: {},

            //  Expires after 30 minutes

            maxAge: 30 * 60,

            name: "Email",
            options: {},
            sendVerificationRequest
        }
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

    //  Contains the core functionality needed for interfacing Auth.js with a database

    adapter: DrizzleAdapter(db, mysqlTable)
}

/**
 * Wraps `getServerSession` so that you don't need to import `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = () => getServerSession(authOptions)
