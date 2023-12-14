/**
 * @file A primary heading.
 * @author Riley Barabash <riley@rileybarabash.com>
 */

import { cn } from "~/utils"

export function TypographyH1({ className, children, ...props }: React.HTMLAttributes<HTMLHeadingElement> & { children: React.ReactNode }) {
    return (
        <h1 className={cn("scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl", className)} {...props}>
            {children}
        </h1>
    )
}
