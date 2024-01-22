/**
 * @file Configuration for Next.js.
 * @author Riley Barabash <riley@rileybarabash.com>
 */

await import("./src/env.js")

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

    assetPrefix: "https://kyzn.app",

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
                    destination: "/subdomains/try/:path*"
                },
                // Additional rule to block access from kyzn.app to any /subdomains path
                {
                    source: "/subdomains/:path*",

                    has: [
                        {
                            type: "host",
                            value: "kyzn.app"
                        }
                    ],
                    destination: "/404"
                }
            ],
            afterFiles: [],
            fallback: []
        }
    }
}

export default config
