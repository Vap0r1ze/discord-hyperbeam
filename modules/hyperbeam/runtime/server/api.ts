const API_BASE = 'https://engine.hyperbeam.com/v0'

function request(method: string, path: string, body?: object) {
    return fetch(API_BASE + path, {
        method,
        headers: {
            authorization: `Bearer ${process.env.HYPERBEAM_TOKEN!}`,
            ...(body && { 'content-type': 'application/json' }),
        },
        body: body && JSON.stringify(body),
    })
}

interface SessionApiOptions {
    start_url?: string
    kiosk?: boolean
    timeout?: {
        absolute?: number
        inactive?: number
        offline?: number
        warning?: number
        webhook?: {
            url: string
            bearer: string
        }
    }
    auth?: {
        type: 'webhook'
        value: {
            url: string
            bearer: string
        }
    }
    default_roles?: string[]
    control_disable_default?: boolean
    region?: 'NA' | 'EU' | 'AS'
    profile?: {
        load?: string
        save?: string
    }
    ublock?: boolean
    // extension?: {}
    webgl?: boolean
    width?: number
    height?: number
    fps?: number
    hide_cursor?: boolean
    search_engine?: 'duckduckgo' | 'ecosia' | 'google' | 'startpage' | 'brave'
    dark?: boolean
    tag?: string
    quality?: {
        mode?: 'sharp' | 'smooth'
    }
}
type SessionOptions = Omit<SessionApiOptions, 'auth' | 'timeout'> & {
    timeout?: Omit<SessionApiOptions['timeout'] & {}, 'webhook'> & {
        webhook?: boolean
    }
    auth?: boolean
}

interface Session {
    session_id: string
    embed_url: string
    admin_token: string
}

export async function createHyperbeamSession(options: SessionOptions) {
    const response = await request('POST', '/vm', {
        ...options,
        auth: options.auth ? {
            type: 'webhook',
            value: {
                // TODO: make this configurable
                url: `https://${process.env.NUXT_PUBLIC_DOMAIN}/api/hyperbeam/auth`,
                bearer: process.env.HYPERBEAM_TOKEN!,
            },
        } : undefined,
        timeout: options.timeout && {
            // TODO: make this configurable
            ...options.timeout,
            webhook: options.timeout.webhook ? {
                url: `https://${process.env.NUXT_PUBLIC_DOMAIN}/api/hyperbeam/timeout`,
                bearer: process.env.HYPERBEAM_TOKEN!,
            }: undefined,
        },
    } satisfies SessionApiOptions)
    return await response.json() as Session
}
