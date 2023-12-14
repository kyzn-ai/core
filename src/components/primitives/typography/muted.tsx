/**
 * @file Muted body text.
 * @author Riley Barabash <riley@rileybarabash.com>
 */

import { cn } from "~/utils"

export function TypographyMuted({ className, children, ...props }: React.HTMLAttributes<HTMLParagraphElement> & { children: React.ReactNode }) {
    return (
        <p className={cn("text-sm text-muted-foreground", className)} {...props}>
            {children}
        </p>
    )
}
