/**
 * @file Utilities for creating, exporting, and implementing static and dynamic SVGs.
 * @author Riley Barabash <riley@rileybarabash.com>
 */

import { useTheme } from "next-themes"

//  Types for the SVG props

export type SVGAspectRatio = "none" | "xMidYMid meet"
export type SVGTheme = "light" | "dark" | "auto"

//  Props to manipulate the SVG

export interface SVGProps extends React.HTMLAttributes<SVGElement> {
    width?: number
    height?: number
    preserveAspectRatio?: SVGAspectRatio
    theme?: SVGTheme
    squareBounds?: boolean
    viewBox?: string
}

//  A type for exporting both static and dynamic SVGs

export type SVG = (props: SVGProps) => JSX.Element

//  A higher-order component (HOC) that takes in a component, updates the props, and returns it as an `SVG`

export function createSVG(Comp: SVG): SVG {
    return (props: SVGProps): JSX.Element => {
        // Gets the theme using the `useTheme` hook, and determines the appropriate theme to use

        const { resolvedTheme } = useTheme()
        const theme: SVGTheme = !!props.theme && props.theme !== "auto" ? props.theme : (resolvedTheme as SVGTheme) ?? "light"

        // Passes the existing props to the provided component, overwriting the theme prop

        return <Comp {...props} theme={theme} />
    }
}
