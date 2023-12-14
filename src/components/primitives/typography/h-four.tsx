/**
 * @file A quaternary heading.
 * @author Riley Barabash <riley@rileybarabash.com>
 */

import { cn } from "~/utils"

export function TypographyH4({ className, children, ...props }: React.HTMLAttributes<HTMLHeadingElement> & { children: React.ReactNode }) {
    return (
        <h4 className={cn("scroll-m-20 text-xl font-semibold tracking-tight", className)} {...props}>
            {children}
        </h4>
    )
}
