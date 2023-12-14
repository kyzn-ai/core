/**
 * @file A tertiary heading.
 * @author Riley Barabash <riley@rileybarabash.com>
 */

import { cn } from "~/utils"

export function TypographyH3({ className, children, ...props }: React.HTMLAttributes<HTMLHeadingElement> & { children: React.ReactNode }) {
    return (
        <h3 className={cn("scroll-m-20 text-2xl font-semibold tracking-tight", className)} {...props}>
            {children}
        </h3>
    )
}
