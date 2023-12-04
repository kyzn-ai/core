/**
 * @file Sets up a tRPC proxy client for a React Server Component (RSC) environment.
 * @author Riley Barabash <riley@rileybarabash.com>
 */

import "server-only"

import { appRouter } from "~/server/api/root"
import { createTRPCContext } from "~/server/api/trpc"
import { transformer } from "~/trpc/shared"
import { createTRPCProxyClient, loggerLink, TRPCClientError } from "@trpc/client"
import { callProcedure } from "@trpc/server"
import { observable } from "@trpc/server/observable"
import { type TRPCErrorResponse } from "@trpc/server/rpc"
import { cookies } from "next/headers"
import { cache } from "react"

/**
 * @description Wraps the `createTRPCContext` helper and provides the required context for the tRPC API when handling a tRPC call from a React Server Component.
 */
const createContext = cache(() => {
    return createTRPCContext({
        headers: new Headers({
            cookie: cookies().toString(),
            "x-trpc-source": "rsc"
        })
    })
})

/**
 * @description Uses a custom RSC link that lets us invoke procedures without using HTTP requests. Server Components always run on the server, so we can just call the procedure as a function.
 */
export const api = createTRPCProxyClient<typeof appRouter>({
    //  Passes a transformer to serialize/deserialize data between the client and server

    transformer,

    //  A chain of middleware that handles the processing of requests and responses

    links: [
        //  Logs requests and responses to the console in dev mode

        loggerLink({
            //  Checks if in dev mode, otherwise if the operation is a response and an error instance

            enabled: op => process.env.NODE_ENV === "development" || (op.direction === "down" && op.result instanceof Error)
        }),

        //  Custom RSC-enabled link

        () =>
            //  Receives an operation object
            ({ op }) =>
                // The link function returns an observable
                observable(observer => {
                    // Create the tRPC context

                    createContext()
                        .then(ctx => {
                            // Call the procedure with the provided context and operation details

                            return callProcedure({
                                // The procedures defined in the app router

                                procedures: appRouter._def.procedures,

                                // The path of the operation

                                path: op.path,

                                // The raw input of the operation

                                rawInput: op.input,

                                // The context created above

                                ctx,

                                // The type of the operation

                                type: op.type
                            })
                        })

                        .then(data => {
                            // If the procedure call is successful, send the result to the observer

                            observer.next({ result: { data } })

                            // Complete the observable

                            observer.complete()
                        })
                        .catch((cause: TRPCErrorResponse) => {
                            // If the procedure call results in an error, send the error to the observer

                            observer.error(TRPCClientError.from(cause))
                        })
                })
    ]
})
