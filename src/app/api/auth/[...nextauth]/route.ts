/**
 * @file Sets up the authentication routes for Auth.js.
 * @author Riley Barabash <riley@rileybarabash.com>
 */

import { env } from "~/env"
import { authOptions } from "~/server/auth"
import NextAuth from "next-auth"

/**
 * @remarks Dynamically sets the `AUTH_TRUST_HOST` variable to "true" during runtime in development instead of adding it to the ".env" file to reduce pollution. This is a workaround for using a custom callback URL host, which automatically assumes the host of the server instead of having to manually specify the `NEXTAUTH_URL`.
 */
process.env.AUTH_TRUST_HOST = env.NODE_ENV !== "production" ? "true" : "false"

//  Initializes a `NextAuth` handler from the auth options object

//  eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
