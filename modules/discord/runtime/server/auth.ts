import { subtle } from 'crypto'

export interface InstanceToken {
    channelId: string
    instanceId: string
    userId: string
    accessToken: string
}
export async function useCreateInstanceToken(data: InstanceToken) {
    const $config = useRuntimeConfig()
    const encoder = new TextEncoder()

    const secretBytes = new TextEncoder().encode($config.discord.clientSecret)
    const secretKey = await subtle.importKey('raw', secretBytes, {
        name: 'HMAC',
        hash: 'SHA-256',
    }, false,  ['sign'])

    const dataBytes = encoder.encode(JSON.stringify(data))
    const signature = await subtle.sign({ name: 'HMAC' }, secretKey, dataBytes)

    const tokenRaw = String.fromCharCode(...dataBytes, ...new Uint8Array(signature))
    return btoa(tokenRaw).replaceAll('=', '').replaceAll('+', '-').replaceAll('/', '_')
}

export async function useVerifyInstanceToken(token: string) {
    const $config = useRuntimeConfig()
    const decoder = new TextDecoder()
    const encoder = new TextEncoder()

    const tokenRaw = atob(token.replaceAll('-', '+').replaceAll('_', '/'))
    const tokenBytes = new Uint8Array(tokenRaw.split('').map(c => c.charCodeAt(0)))

    const dataBytes = tokenBytes.slice(0, tokenBytes.length - 32)
    const signature = tokenBytes.slice(tokenBytes.length - 32)

    const secretBytes = encoder.encode($config.discord.clientSecret)
    const secretKey = await subtle.importKey('raw', secretBytes, {
        name: 'HMAC',
        hash: 'SHA-256',
    }, false, ['verify'])

    const isValid = await subtle.verify({ name: 'HMAC' }, secretKey, signature, dataBytes)
    if (!isValid) return null

    const data = JSON.parse(decoder.decode(dataBytes))
    return data as InstanceToken
}
