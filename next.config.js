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
    }

    // async rewrites() {
    //     return {
    //         beforeFiles: [
    //             // if the host is `app.acme.com`,
    //             // this rewrite will be applied
    //             // https://github.com/vercel/next.js/discussions/32294#discussioncomment-5472857
    //             {
    //                 source: "/:path*",
    //                 has: [
    //                     {
    //                         type: "host",
    //                         value: "get.kyzn.app"
    //                     }
    //                 ],
    //                 destination: "/app/:path*"
    //             }
    //         ],
    //         afterFiles: [],
    //         fallback: []
    //     }
    // }
}

export default config
