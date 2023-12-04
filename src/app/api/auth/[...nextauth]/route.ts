/**
 * @file Sets up the authentication routes for Auth.js.
 * @author Riley Barabash <riley@rileybarabash.com>
 */

import { authOptions } from "~/server/auth"
import NextAuth from "next-auth"

//  Initializes a `NextAuth` handler from the auth options object

//  eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
