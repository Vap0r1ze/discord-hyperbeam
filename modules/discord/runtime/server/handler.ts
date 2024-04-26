import { Discord as DiscordOAuth2 } from 'arctic'
import { type InstanceToken, useCreateInstanceToken, useVerifyInstanceToken } from './auth'
import { getInstances, verifyInstance } from './api'
import type { H3Event } from 'h3'

function isTokenBody(body: unknown): body is {
    code: string
    instanceId: string
    channelId: string
} {
    return typeof body === 'object' && body !== null
        && 'code' in body && typeof body['code'] === 'string'
        && 'instanceId' in body && typeof body['instanceId'] === 'string'
        && 'channelId' in body && typeof body['channelId'] === 'string'
}

export function defineTokenHandler() {
    return defineEventHandler(async (event) => {
        const $config = useRuntimeConfig()

        const action = getRouterParam(event, 'discord')
        if (event.method !== 'POST') throw createError({ status: 405 })
        if (action !== 'token') throw createError({ status: 404 })

        const body = await readBody(event)
        if (!isTokenBody(body)) throw createError({ status: 400 })

        const discordOauth2 = new DiscordOAuth2(
            $config.public.discord.clientId,
            $config.discord.clientSecret,
            $config.public.discord.redirectUri,
        )

        const { accessToken } = await discordOauth2.validateAuthorizationCode(body.code)
            .catch(() => { throw createError({ status: 401 }) })

        const verification = await verifyInstance(event, accessToken, body.channelId, body.instanceId)
        if (verification == null) throw createError({ status: 403 })

        const instanceToken = await useCreateInstanceToken({
            channelId: body.channelId,
            instanceId: body.instanceId,
            userId: verification.user.id,
            accessToken,
        })

        setCookie(event, 'instance_token', instanceToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
        })

        return { accessToken }
    })
}

export async function useInstanceToken(event: H3Event, checkFreshness: boolean): Promise<InstanceToken | null> {
    const $config = useRuntimeConfig(event)

    const token = getCookie(event, $config.discord.instanceTokenCookie)
    if (token == null) return null

    const tokenData = await useVerifyInstanceToken(token).catch(() => null)
    if (tokenData == null) return null

    if (checkFreshness) {
        const instances = await getInstances(event, tokenData.channelId).catch(() => null)
        if (instances == null) return null
        if (!instances.some(i => i.instance_id === tokenData.instanceId)) return null
    }

    return tokenData
}
