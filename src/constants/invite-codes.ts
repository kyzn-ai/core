export interface Aliases {
    production: Record<string, string>
    development: Record<string, string>
}

export const inviteCodes: Aliases = {
    production: {
        kicsy: "price_1Ob2SmKqrtkGWsyjmJhA3t3D"
        // Other production configurations
    },
    development: {
        kicsy: "price_1Ob2wOKqrtkGWsyj4cGSNrw7"
        // Other development configurations
    }
}
