/**
 * @file A secondary heading.
 * @author Riley Barabash <riley@rileybarabash.com>
 */

import { cn } from "~/utils"

export function TypographyH2({ className, children, ...props }: React.HTMLAttributes<HTMLHeadingElement> & { children: React.ReactNode }) {
    return (
        <h2 className={cn("scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0", className)} {...props}>
            {children}
        </h2>
    )
}
