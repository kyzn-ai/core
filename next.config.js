/**
 * @file Configuration for Next.js.
 * @author Riley Barabash <riley@rileybarabash.com>
 */

const { env } = await import("./src/env.js")

/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful for Docker builds.
 *
 * @type { import ( "next" ) .NextConfig }
 */
const config = {
    experimental: {
        /**
         * Required to use defer.run.
         */
        serverMinification: false
    },

    assetPrefix: (env.NODE_ENV ?? env.ENV) === "production" ? "https://kyzn.app" : undefined,

    async rewrites() {
        return {
            beforeFiles: [
                // Existing rule for try.kyzn.app
                {
                    source: "/:path*",
                    has: [
                        {
                            type: "host",
                            value: "try.kyzn.app"
                        }
                    ],
                    destination: "/try/:path*"
                },
                // Additional rule to block access from kyzn.app to any /subdomains path
                // {
                //     source: "/try/:path*",

                //     has: [
                //         {
                //             type: "host",
                //             value: "kyzn.app"
                //         }
                //     ],
                //     destination: "/404"
                // }

                {
                    source: "/:path*",
                    has: [
                        {
                            type: "host",
                            value: "revyse.kyzn.app"
                        }
                    ],
                    destination: "/revyse/:path*"
                }
            ],
            afterFiles: [],
            fallback: []
        }
    }
}

export default config
