import { subtle } from 'crypto'
import type { H3Event } from 'h3'

function getKey(secret: string) {
    const encoder = new TextEncoder()
    return subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256', }, false, ['sign', 'verify'])
}

async function sign(secret: string, data: string): Promise<string> {
    const encoder = new TextEncoder()
    const key = await getKey(secret)
    const signature = await subtle.sign('HMAC', key, encoder.encode(data))
    return Array.from(new Uint8Array(signature)).map(b => b.toString(16).padStart(2, '0')).join('')
}

export async function authenticate<U extends { id: string }>(event: H3Event, socketId: string, user: U) {
    const $config = useRuntimeConfig(event)
    const signature = await sign($config.pusher.secret, `${socketId}::user::${JSON.stringify(user)}`)

    return {
        auth: `${$config.public.pusher.key}:${signature}`,
        user_data: JSON.stringify(user),
    }
}

export async function authorize(event: H3Event, channel: string, socketId: string, userId: string) {
    const $config = useRuntimeConfig(event)
    const userJson = JSON.stringify({ user_id: userId })
    let toSign = `${socketId}:${channel}`
    if (channel.startsWith('presence-')) toSign += `:${userJson}`

    const signature = await sign($config.pusher.secret, toSign)
    const auth = `${$config.public.pusher.key}:${signature}`

    if (channel.startsWith('private-encrypted-')) return null // Not implemented
    if (channel.startsWith('private-')) return { auth }
    if (channel.startsWith('presence-')) return {
        auth,
        channel_data: userJson,
    }

    return null
}
