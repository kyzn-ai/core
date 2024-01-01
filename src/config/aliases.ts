import { env } from "~/env"

export interface Aliases {
    urls: {
        functions: {
            background: {
                ai: {
                    completion: string
                }
            }
        }
    }
}

export const aliases: Aliases = {
    urls: {
        functions: {
            background: {
                ai: {
                    completion: env.BASE_URL + "/api/background/ai/completion"
                }
            }
        }
    }
}
