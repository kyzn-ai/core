/**
 * @file A form for signing in with email.
 * @author Riley Barabash <riley@rileybarabash.com>
 */

import { type AuthenticationOptionsProviderId } from "."
import { Button, Icon, Input, Label } from "~/components"
import { useAppendQueryString } from "~/hooks"
import { cn } from "~/utils"
import { signIn } from "next-auth/react"
import { type AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime"
import { useRouter } from "next/navigation"

//  The options for the Email authentication modal

export interface AuthenticateWithEmailOptions extends React.ButtonHTMLAttributes<HTMLFormElement> {
    //  Replaces the default button text

    buttonText?: string

    //  The current loading state

    loading?: AuthenticationOptionsProviderId | null

    //  The loading state setter

    onLoadingChange?: (provider: AuthenticationOptionsProviderId | null) => void

    //  The URL to redirect to after authentication is complete

    callbackUrl: string
}

export function AuthenticateWithEmail({ className, disabled, buttonText = "Proceed with Email", loading, onLoadingChange: setLoading, callbackUrl, ...props }: AuthenticateWithEmailOptions): JSX.Element {
    //  Get the router for redirecting and the query string helper

    const router: AppRouterInstance = useRouter()
    const appendQueryString: (name: string, value: string) => string = useAppendQueryString()

    //  The sign-in handler

    const authenticate = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
        //  Trigger the loading state

        setLoading?.("email")

        //  Prevent a page reload

        event.preventDefault()

        //  Get the email from the form data

        const email: string = new FormData(event.currentTarget).get("email")?.toString() ?? ""

        try {
            //  Throw an error if no email is provided

            if (!email) throw new Error("No email submitted")

            //  Try and sign in with the email

            const signInResponse = await signIn("email", { redirect: false, email, callbackUrl })

            //  Throw an error if the sign in failed

            if (!signInResponse!.ok) throw new Error(signInResponse!.error!)

            //  Redirect to the verification URL with the callback in the search params

            router.push("signin/verification/token" + "?" + appendQueryString("callback-url", callbackUrl))
        } catch (error) {
            //  Log the error

            console.error(`Unable to sign in with email: "${email}"`, { cause: error })
        }

        //  Revert the loading state

        setLoading?.(null)
    }

    return (
        <>
            {/* Form */}

            <form className={cn("flex w-full flex-col items-center justify-center gap-2", className)} onSubmit={authenticate} {...props}>
                {/* label & input */}

                <div className="flex w-full flex-col items-center justify-center gap-1">
                    {/* Label */}

                    <Label className="sr-only" htmlFor="email">
                        Email
                    </Label>

                    {/* Input */}

                    <Input className="w-full" name="email" id="email" placeholder="name@example.com" type="email" autoCapitalize="none" autoComplete="email" autoCorrect="on" disabled={disabled ?? !!loading} required />
                </div>

                {/* Submit */}

                <Button name="email" className="w-full" disabled={disabled ?? !!loading}>
                    {/* Spinner */}

                    {loading === "email" && <Icon.Spinner className="mr-2 h-4 w-4 animate-spin" />}

                    {` ${buttonText}`}
                </Button>
            </form>
        </>
    )
}
