import type { RESTGetAPIUserResult } from 'discord.js'
import type { H3Event } from 'h3'

const API_BASE = 'https://discord.com/api/v10'

export async function getInstances(event: H3Event, channelId: string) {
    const $config = useRuntimeConfig(event)

    type Instance = {
        application_id: string
        channel_id: string
        users: string[]
        instance_id: string
        guild_id: string | null
    }

    const data: { instances: Instance[] } = await fetch(`${API_BASE}/activities/${$config.public.discord.clientId}/instances/${channelId}`, {
        headers: {
            authorization: $config.discord.token,
        },
    }).then(res => res.json())

    return data.instances
}
export async function getMe(accessToken: string) {
    const data: RESTGetAPIUserResult = await fetch(`${API_BASE}/users/@me`, {
        headers: {
            authorization: `Bearer ${accessToken}`,
        },
    }).then(res => res.json())

    return data
}

export async function verifyInstance(event: H3Event, accessToken: string, channelId: string, instanceId: string) {
    const [instances, user] = await Promise.all([getInstances(event, channelId), getMe(accessToken)])

    const instance = instances.find(i => i.instance_id === instanceId)
    if (!instance) return null

    return { instance, user }
}
