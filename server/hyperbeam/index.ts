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

interface SessionOptions {
    start_url?: string
    kiosk?: boolean
    timeout?: {
        absolute?: number
        inactive?: number
        offline?: number
        warning?: number
        webhook?: {
            url?: string
            bearer?: string
        }
    }
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

interface Session {
    session_id: string
    embed_url: string
    admin_token: string
}

export async function createSession(options: SessionOptions) {
    const response = await request('POST', '/vm', options)
    return await response.json() as Session
}
