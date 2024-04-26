import { Events, patchUrlMappings } from '@discord/embedded-app-sdk'
import { createRoutine } from './_routine'
import { useInstanceStore } from './store'

export function useDiscordConnect() {
    const { $discordSdk, $config } = useNuxtApp()
    const instanceStore = useInstanceStore()

    // patchUrlMappings($config.public.discord.proxyMappings)

    const initSdkRoutine = createRoutine()
    .add('connect', () => $discordSdk.ready())
    .add('authorize', async () => {
        const { code } = await $discordSdk.commands.authorize({
            client_id: $config.public.discord.clientId,
            response_type: 'code',
            prompt: 'none',
            scope: ['identify'],
        })
        return { code }
    })
    .add('authenticate', async ({ code }) => {
        const result = await fetch('/api/discord/token', {
            credentials: 'same-origin',
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                code,
                channelId: $discordSdk.channelId,
                instanceId: $discordSdk.instanceId,
            }),
        })
        if (result.status !== 200) throw new Error('Failed to fetch access token')

        const { accessToken } = await result.json()
        const auth = await $discordSdk.commands.authenticate({ access_token: accessToken })
        if (auth == null) throw new Error('Authenticate command failed')

        return { auth }
    })
    .add('initialize', async ({ auth }) => {
        instanceStore.auth.value = auth
        instanceStore.participants.value = (await $discordSdk.commands.getInstanceConnectedParticipants()).participants

        $discordSdk.subscribe(Events.ACTIVITY_INSTANCE_PARTICIPANTS_UPDATE, ({ participants }) => {
            instanceStore.participants.value = participants
        })
    })

    return initSdkRoutine.use()
}
