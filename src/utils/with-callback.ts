export interface WithCallbackOptions {
    url: string
    returnResult?: boolean
    authToken?: string
}

export function withCallback<WithCallbackFunctionParams extends unknown[], WithCallbackFunctionResult extends Record<string, unknown>>(
    action: (...params: WithCallbackFunctionParams) => Promise<WithCallbackFunctionResult>,

    { url, returnResult = false, authToken }: WithCallbackOptions
): (...params: WithCallbackFunctionParams) => Promise<WithCallbackFunctionResult | undefined> {
    return async (...params: WithCallbackFunctionParams): Promise<WithCallbackFunctionResult | undefined> => {
        const result: WithCallbackFunctionResult = await action(...params)

        try {
            JSON.stringify(result)
        } catch (error) {
            throw new Error("Result is not serializable")
        }

        const headers: Record<string, string> = { "Content-Type": "application/json" }
        if (authToken) headers.Authorization = `Bearer ${authToken}`

        try {
            await fetch(url, {
                method: "POST",
                headers,
                body: JSON.stringify({ result })
            })
        } catch (error) {
            throw new Error("unable to send result")
        }

        if (returnResult) return result
        else return undefined
    }
}
