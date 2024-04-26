import type { PermissionData } from '@hyperbeam/web'
import type { H3Event } from 'h3'

type AuthorizeResponse = {
    authorized: boolean
    permissions?: PermissionData
}

interface HyperbeamHandler {
    onTimeout?(event: H3Event, sessionId: string): void | Promise<void>
    authorize?(event: H3Event, userId: string, userData: unknown): AuthorizeResponse | Promise<AuthorizeResponse>
}

function isTimeoutBody(body: unknown): body is {
    session_id: string
} {
    return typeof body === 'object' && body !== null
        && 'session_id' in body && typeof body['session_id'] === 'string'
}

function isAuthorizeBody(body: unknown): body is {
    user_id: string
    userdata: unknown
} {
    return typeof body === 'object' && body !== null
        && 'user_id' in body && typeof body['user_id'] === 'string'
        && 'userdata' in body
}

export function defineHyperbeamHandler(handler: HyperbeamHandler) {
    return defineEventHandler(async (event) => {
        const action = getRouterParam(event, 'pusher')
        if (event.method !== 'POST') throw createError({ status: 405 })
        if (action !== 'timeout' && action !== 'authorize') throw createError({ status: 404 })

        const body = await readBody(event)

        if (action === 'timeout') {
            if (!isTimeoutBody(body)) throw createError({ status: 400 })
            await handler.onTimeout?.(event, body.session_id)
        }

        if (action === 'authorize') {
            if (!isAuthorizeBody(body)) throw createError({ status: 400 })
            return await handler.authorize?.(event, body.user_id, body.userdata) ?? { authorized: false }
        }
    })
}
