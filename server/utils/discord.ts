import { RESTGetAPIUserResult } from 'discord.js'

const API_BASE = 'https://discord.com/api/v10'

async function getInstances(channelId: string) {
    type Instance = {
        application_id: string
        channel_id: string
        users: string[]
        instance_id: string
        guild_id: string | null
    }

    const data: { instances: Instance[] } = await fetch(`${API_BASE}/activities/${process.env.NUXT_PUBLIC_DISCORD_CLIENT_ID}/instances/${channelId}`, {
        headers: {
            authorization: `Bot ${process.env.DISCORD_TOKEN}`,
        },
    }).then(res => res.json())

    return data.instances
}
async function getMe(accessToken: string) {
    const data: RESTGetAPIUserResult = await fetch(`${API_BASE}/users/@me`, {
        headers: {
            authorization: `Bearer ${accessToken}`,
        },
    }).then(res => res.json())

    return data
}

async function verifyInstance(accessToken: string, channelId: string, instanceId: string) {
    const [instances, user] = await Promise.all([getInstances(channelId), getMe(accessToken)])

    const instance = instances.find(i => i.instance_id === instanceId)
    if (!instance) return false

    return instance.users.includes(user.id)
}

export const discordHttp = { getInstances, getMe, verifyInstance }
