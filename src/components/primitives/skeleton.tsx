/**
 * @file A malleable loading state that indicates content being streamed in.
 * @author Riley Barabash <riley@rileybarabash.com>
 */

import { cn } from "~/utils/cn"

export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>): JSX.Element {
    //  Pulses the background color to signify dynamism

    return <div className={cn("bg-primary/10 animate-pulse rounded-md", className)} {...props} />
}
