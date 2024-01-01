/**
 * @file The KYZN logo.
 * @author Riley Barabash <riley@rileybarabash.com>
 */

"use client"

import { createSVG, type SVG } from "~/components/svgs/create-svg"

export const Logo: SVG = createSVG(({ squareBounds = false, viewBox, ...props }) => (
    <svg viewBox={viewBox ?? squareBounds ? "0 0 4096 4096" : "0 1742.64885 4096 610.7023"} fill="currentColor" {...props}>
        {/* Logotype */}
        <polygon points="2076.4,1803.72 2076.4,1925.86 1806.36,1925.86 1745.31,1986.93 1954.25,1986.93 2076.4,2109.07 2076.4,2292.28 1954.25,2292.28 1954.25,2159.66 1903.67,2109.07 1587.83,2109.07 1587.83,2292.28 1465.69,2292.28 1465.69,1803.72 1587.83,1803.72 1587.83,1986.93 1734.18,1986.93 1653.38,1906.11 1755.78,1803.72" />
        <polygon points="2748.17,1803.72 2748.17,2002.2 2641.3,2002.2 2748.17,2109.07 2748.17,2292.28 2137.47,2292.28 2137.47,2170.14 2626.03,2170.14 2626.03,2159.66 2575.44,2109.07 2259.61,2109.07 2137.47,1986.93 2137.47,1803.72 2259.61,1803.72 2259.61,1936.34 2310.2,1986.93 2626.03,1986.93 2626.03,1803.72" />
        <polygon points="2933.52,2170.14 3422.08,2170.14 3422.08,2292.28 2811.38,2292.28 2811.38,2109.07 2933.52,1986.93 3249.36,1986.93 3299.94,1936.34 3299.94,1925.86 2811.38,1925.86 2811.38,1803.72 3422.08,1803.72 3422.08,1986.93 3299.94,2109.07 2984.11,2109.07 2933.52,2159.66" />
        <polygon points="4096,1803.72 4096,2292.28 3851.72,2292.28 3729.58,2170.14 3729.58,1976.45 3678.99,1925.86 3607.44,1925.86 3607.44,2292.28 3485.3,2292.28 3485.3,1803.72 3729.58,1803.72 3851.72,1925.86 3851.72,2119.55 3902.31,2170.14 3973.86,2170.14 3973.86,1803.72" />

        {/* Divider with opacity */}
        <rect x="1099.28" y="1742.65" width="122.14" height="610.7" opacity="0.125" />

        {/* Brandmark */}
        <polygon points="366.42,2292.28 244.28,2292.28 244.28,2195.45 5.22,1956.39 0,1951.17 0,1803.72 122.14,1803.72 122.14,1900.55 361.2,2139.61 366.42,2144.83" />
        <polygon points="610.71,2292.28 488.57,2292.28 488.57,2195.45 249.51,1956.39 244.29,1951.17 244.29,1803.72 366.43,1803.72 366.43,1900.55 605.49,2139.61 610.71,2144.83" />
        <polygon points="855,2292.28 732.86,2292.28 732.86,2195.45 493.8,1956.39 488.58,1951.17 488.58,1803.72 610.72,1803.72 610.72,1900.55 849.78,2139.61 855,2144.83" />
    </svg>
))
