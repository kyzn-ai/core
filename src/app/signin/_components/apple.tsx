/**
 * @file A button for signing in with Apple.
 * @author Riley Barabash <riley@rileybarabash.com>
 *
 * @todo Implement the Apple auth flow.
 */

import { type AuthenticationOptionsProviderId } from "."
import { Button, type ButtonVariants, Icon } from "~/components"
import { cn } from "~/utils"

//  The options for the Apple authentication button

export interface AuthenticateWithAppleOptions extends React.ButtonHTMLAttributes<HTMLButtonElement>, ButtonVariants {
    //  Replaces the default button text

    buttonText?: string

    //  The current loading state

    loading?: AuthenticationOptionsProviderId | null

    //  The loading state setter

    onLoadingChange?: (provider: AuthenticationOptionsProviderId | null) => void
}

export function AuthenticateWithApple({ className, disabled, buttonText = "Sign in with Apple", loading, onLoadingChange: setLoading, ...props }: AuthenticateWithAppleOptions): JSX.Element {
    //  The sign-in handler

    const authenticate = async (): Promise<void> => {
        //  Trigger the loading state

        setLoading?.("Apple")

        //  Start the Apple auth flow here (`setTimeout` is just for demonstration purposes)

        await new Promise(resolve => setTimeout(resolve, 3000))

        //  Revert the loading state

        setLoading?.(null)
    }

    return (
        <>
            {/* Sign-in button */}

            <Button className={cn("w-full", className)} type="button" name="Apple" onClick={authenticate} disabled={disabled ?? !!loading} {...props}>
                {/* Loading spinner */}
                {loading === "Apple" ? <Icon.Spinner className="mr-2 h-4 w-4 animate-spin" /> : <Icon.Apple className="mr-2 h-4 w-4" />}
                {` ${buttonText}`}
            </Button>
        </>
    )
}
