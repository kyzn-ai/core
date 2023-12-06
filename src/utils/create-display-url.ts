/**
 * @file A simplistic abstraction of the `URL` object for display purposes.
 * @author Riley Barabash <riley@rileybarabash.com>
 *
 * @remarks Keep the complexity out, or develop into a full URL wrapper?
 */

interface DisplayUrlParams {
    //  The URL to initialize

    from: string
}

interface DisplayUrlResult {
    absolute: string

    // protocol: string
    // username: string
    // password: string
    host: string
    // hostname: string
    // port: string
    path: string
    // search: string
    // hash: string
    subdomain: string | undefined
    // tld: string | undefined

    // withProtocol: string
    // withHttp: string
    // withHttps: string
    // withPath: string
    // withQuery: string
    // withFragment: string

    // getHostnameComponent: ({ atIndex }: { atIndex: number }) => string | undefined
    // getParam: ({ named }: { named: string }) => string | null
}

export function createDisplayUrl({ from: source }: DisplayUrlParams): DisplayUrlResult {
    let url: URL

    // Initialize a new URL object

    try {
        url = new URL(source)
    } catch (_) {
        //  If the input does not include a protocol, assume HTTPS

        try {
            url = new URL(`https://${source}`)
        } catch (error) {
            //  If the input is still invalid, throw an error

            throw new Error(`Invalid URL: ${source}`, { cause: error })
        }
    }

    // Extract the components of the URL

    // const protocol: string = url.protocol
    // const username: string = url.username
    // const password: string = url.password
    const host: string = url.host
    const hostname: string = url.hostname
    // const port: string = url.port
    const path: string = url.pathname
    // const search: string = url.search
    // const hash: string = url.hash

    //  Splits the hostname into an array of components

    const hostnameComponents: string[] = hostname.split(".")

    //  Retrieves the subdomain

    const subdomain: string | undefined = hostnameComponents.length > 2 ? hostnameComponents[0] : undefined

    //  Retrieves the TLD

    // const tld: string | undefined = hostnameComponents.length > 1 ? hostnameComponents[hostnameComponents.length - 1] : undefined

    //  Get a component of the hostname

    // const getHostnameComponent = ({ atIndex: index }: { atIndex: number }): string | undefined => hostnameComponents[index]

    //  Get a query parameter

    // const getParam = ({ named: param }: { named: string }): string | null => url.searchParams.get(param)

    return {
        //  The original URL

        absolute: url.toString(),

        // protocol,
        // username,
        // password,
        host,
        // hostname,
        // port,
        path,
        // search,
        // hash,
        subdomain
        // tld,
        // withProtocol: `${protocol}//${hostname}`,
        // withHttp: `http://${host}`,
        // withHttps: `https://${host}`,
        // withPath: `${protocol}//${hostname}${path}`,
        // withQuery: `${protocol}//${hostname}${path}${search}`,
        // withFragment: `${protocol}//${hostname}${path}${search}${hash}`,
        // getHostnameComponent,
        // getParam
    } satisfies DisplayUrlResult
}
