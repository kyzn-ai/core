/**
 * @file Sets up a tRPC provider component with React Query.
 * @author Riley Barabash <riley@rileybarabash.com>
 */

"use client"

import { type AppRouter } from "~/server/api/root"
import { trpcEndpoint, transformer } from "~/trpc/shared"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { loggerLink, unstable_httpBatchStreamLink } from "@trpc/client"
import { createTRPCReact } from "@trpc/react-query"
import { useState } from "react"

//  Initializes a tRPC client

export const api = createTRPCReact<AppRouter>()

//  The provider component that wraps the application

export function TRPCReactProvider(props: { children: React.ReactNode; cookies: string }) {
    //  Create some state for the query

    const [queryClient] = useState(() => new QueryClient())

    //  Configures the tRPC client

    const [trpcClient] = useState(() =>
        api.createClient({
            //  Passes a transformer to serialize/deserialize data between the client and server

            transformer,

            //  A chain of middleware that handles the processing of requests and responses

            links: [
                //  Logs requests and responses to the console in dev mode

                loggerLink({
                    //  Checks if in dev mode, otherwise if the operation is a response and an error instance

                    enabled: op => process.env.NODE_ENV === "development" || (op.direction === "down" && op.result instanceof Error)
                }),

                //  Makes batched HTTP requests to the server

                unstable_httpBatchStreamLink({
                    // The URL to send the requests to

                    url: trpcEndpoint(),

                    headers() {
                        return {
                            //  Sets the headers with cookies and the source of the request

                            cookie: props.cookies,
                            "x-trpc-source": "react"
                        }
                    }
                })
            ]
        })
    )

    //  Structures the component to include the query client and tRPC client

    return (
        <>
            {/* React Query client */}

            <QueryClientProvider client={queryClient}>
                {/* tRPC client */}

                <api.Provider client={trpcClient} queryClient={queryClient}>
                    {/* The application */}

                    {props.children}
                </api.Provider>
            </QueryClientProvider>
        </>
    )
}
