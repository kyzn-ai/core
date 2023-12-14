/**
 * @file A button component.
 * @author Riley Barabash <riley@rileybarabash.com>
 */

import { Slot } from "@radix-ui/react-slot"
import { cn } from "~/utils"
import { cva, type VariantProps } from "class-variance-authority"
import * as React from "react"

//  Generates CSS class names based on the provided variant and size

export const buttonVariants = cva(
    //  Base styles

    "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",

    //  Additional styles

    {
        variants: {
            variant: {
                default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
                destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
                outline: "border border-input bg-transparent shadow-sm hover:bg-accent hover:text-accent-foreground",
                secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
                ghost: "hover:bg-accent hover:text-accent-foreground",
                link: "text-primary underline-offset-4 hover:underline"
            },

            size: {
                default: "h-9 px-4 py-2",
                sm: "h-8 rounded-md px-3 text-xs",
                lg: "h-10 rounded-md px-8",
                icon: "h-9 w-9"
            }
        },

        defaultVariants: {
            variant: "default",
            size: "default"
        }
    }
)

//  Extracts the variant types from the CVA object

export type ButtonVariant = VariantProps<typeof buttonVariants>["variant"]
export type ButtonSize = VariantProps<typeof buttonVariants>["size"]
export type ButtonVariants = VariantProps<typeof buttonVariants>

//  Combines the intrinsic button props with the variant props, as well as some additional options

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
    //  Renders a Slot component from Radix UI, which applies the styles and props of the button to its children without wrapping them in a button element (e.g, for when you want to use a Next.js Link component for server-side navigation)

    asChild?: boolean
}

//  Using forwardRef allows the parent to directly access the button's DOM element

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant, size, asChild = false, ...props }, ref) => {
    //  Conditionally render the child elements as Slot components or a button element

    const Comp = asChild ? Slot : "button"

    //  Return the component, applying the generated class names, and passing the ref and props

    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
})

//  Set the display name for the component

Button.displayName = "Button"

export { Button }
