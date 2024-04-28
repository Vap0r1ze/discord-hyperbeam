import type { H3Event } from 'h3'
import { authenticate, authorize } from './crypto'

type MaybeNullishPromise<T> = T | null | Promise<T | null>
interface PusherHandler {
    onAuthenticate(event: H3Event, socketId: string): MaybeNullishPromise<{ id: string }>
    onAuthorize(event: H3Event, channel: string, socketId: string): MaybeNullishPromise<{ id: string }>
}

function isAuthenticateBody(body: unknown): body is {
    socket_id: string
} {
    return typeof body === 'object' && body !== null
        && 'socket_id' in body && typeof body['socket_id'] === 'string'
}

function isAuthorizeBody(body: unknown): body is {
    socket_id: string
    channel_name: string
} {
    return typeof body === 'object' && body !== null
        && 'socket_id' in body && typeof body['socket_id'] === 'string'
        && 'channel_name' in body && typeof body['channel_name'] === 'string'
}

export function definePusherHandler(handler: PusherHandler) {
    return defineEventHandler(async (event) => {
        const action = getRouterParam(event, 'pusher')
        if (event.method !== 'POST') throw createError({ status: 405 })
        if (action !== 'authenticate' && action !== 'authorize') throw createError({ status: 404 })

        const body = await readBody(event)

        if (action === 'authenticate') {
            if (!isAuthenticateBody(body)) throw createError({ status: 400 })
            const user = await handler.onAuthenticate(event, body.socket_id)
            if (user === null) throw createError({ status: 401 })
            return await authenticate(event, body.socket_id, user)
        }

        if (action === 'authorize') {
            if (!isAuthorizeBody(body)) throw createError({ status: 400 })
            const user = await handler.onAuthorize(event, body.channel_name, body.socket_id)
            if (user === null) throw createError({ status: 401 })
            return await authorize(event, body.channel_name, body.socket_id, user.id)
        }
    })
}
