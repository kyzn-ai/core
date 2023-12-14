/**
 * @file A malleable loading state that indicates content being streamed in.
 * @author Riley Barabash <riley@rileybarabash.com>
 */

import { cn } from "~/utils"

export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>): JSX.Element {
    return <div className={cn("animate-pulse rounded-md bg-primary/10", className)} {...props} />
}
