/**
 * @file Provides shared utilities and types for tRPC.
 * @author Riley Barabash <riley@rileybarabash.com>
 */

import { env } from "~/env"
import { type AppRouter } from "~/server/api/root"
import { type inferRouterInputs, type inferRouterOutputs } from "@trpc/server"
import superjson from "superjson"

//  Create an alias for Superjson

export const transformer = superjson

//  Generate the tRPC URL, specifying the base URL for server-side requests

export const trpcEndpoint = (): string => (typeof window !== "undefined" ? "" : env.NEXT_PUBLIC_BASE_URL) + "/api/trpc"

/**
 * @description Helper for inferring the input types of specific tRPC routes.
 *
 * @example type HelloInput = RouterInputs["example"]["hello"]
 */
export type RouterInputs = inferRouterInputs<AppRouter>

/**
 * @description Helper for inferring the output types of specific tRPC routes.
 *
 * @example type HelloOutput = RouterOutputs["example"]["hello"]
 */
export type RouterOutputs = inferRouterOutputs<AppRouter>
