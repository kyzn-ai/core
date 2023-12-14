/**
 * @file Creates a responsive pattern by repeating the child element in a grid. Can can be aligned to the center, or any side or corner of the container.
 * @author Riley Barabash <riley@rileybarabash.com>
 */

"use client"

import { cn } from "~/utils"
import React, { useEffect, useRef, useState, type ReactNode, type RefObject } from "react"

//  Aligns the pattern inside the component

type PatternAlignment = "center" | "t" | "b" | "r" | "l" | "tr" | "tl" | "br" | "bl"

//  Combines the intrinsic div props with the alignment props

interface PatternProps extends React.HTMLAttributes<HTMLDivElement> {
    //  The element to repeat

    children: ReactNode

    //  The alignment of the pattern

    align?: PatternAlignment
}

export function Pattern({ children, align: alignment = "tl", className, ...props }: PatternProps): JSX.Element {
    //  Stores the elements to repeat

    const [instances, setInstances] = useState<JSX.Element[]>([])
    const [columns, setColumns] = useState<number>(1)

    //  Access to the container and child DOM elements

    const containerRef: RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null)
    const childRef: RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null)

    //  Runs after the component renders/mounts, and when the children prop changes

    useEffect(() => {
        //  Observes the bounding box of an element for changes in size

        const observer: ResizeObserver = new ResizeObserver(entries => {
            //  If the container or child elements don't exist, return

            if (!containerRef.current || !childRef.current) return

            //  Iterates over the observed elements

            for (const entry of entries) {
                //  Gets the dimensions of the container and child

                const { width: containerWidth, height: containerHeight } = entry.contentRect
                const childWidth: number = childRef.current?.offsetWidth ?? 0
                const childHeight: number = childRef.current?.offsetHeight ?? 0

                //  Calculates the number of columns and rows, and assign them to state

                const columns = Math.ceil(containerWidth / childWidth)
                const rows = Math.ceil(containerHeight / childHeight)

                setColumns(columns)

                //  Creates an array to store the pattern elements, initialized to the size of the grid

                let instances = Array<JSX.Element>(columns * rows).fill(<></>)

                //  Clones the child element and adds it to the array with a unique key

                instances = instances.map((_, index) => React.cloneElement(children as React.ReactElement, { key: index }))

                //  Updates the state with the new elements

                setInstances(instances)
            }
        })

        //  Monitors the container

        if (containerRef.current) observer.observe(containerRef.current)

        //  Cleans up the observer

        return () => observer.disconnect()
    }, [
        //  Observes the children prop

        children
    ])

    //  Maps the alignment options to tailwind classes

    const alignmentClassNames = {
        center: "items-center justify-center",
        t: "items-start justify-center",
        b: "items-end justify-center",
        r: "items-center justify-end",
        l: "items-center justify-start",
        tr: "items-start justify-end",
        tl: "items-start justify-start",
        br: "items-end justify-end",
        bl: "items-end justify-start"
    } as const satisfies Record<PatternAlignment, string>

    return (
        <>
            {/* The pattern container */}

            <div ref={containerRef} className={cn(`w-[${childRef.current?.offsetWidth ?? 0}px] relative flex ${alignmentClassNames[alignment]} overflow-hidden`, className)} {...props}>
                {/* Offscreen render */}

                <div ref={childRef} className="pointer-events-none invisible relative opacity-0">
                    {
                        //  If there are multiple children, `react.cloneElement` will throw an error

                        React.cloneElement(children as React.ReactElement)
                    }
                </div>

                {/* The pattern */}

                <div className="absolute grid" style={{ gridTemplateColumns: `repeat(${columns}, ${childRef.current?.offsetWidth ?? 0}px)` }}>
                    {
                        //  Dumps the pattern elements into the grid

                        instances.map(element => element)
                    }
                </div>
            </div>
        </>
    )
}
