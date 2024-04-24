<script setup lang="ts">
import { Events } from '@discord/embedded-app-sdk';

const { $discord, $config } = useNuxtApp()
const instanceStore = useInstanceStore()

const initSdkRoutine = createRoutine()
    .add('connect', () => $discord.ready())
    .add('authorize', async () => {
        const { code } = await $discord.commands.authorize({
            client_id: $config.public.discordClientId,
            response_type: 'code',
            prompt: 'none',
            scope: ['identify'],
        })
        return { code }
    })
    .add('authenticate', async ({ code }) => {
        const { accessToken } = await $fetch('/api/token', {
            method: 'post' ,
            body: { code },
        })
        const auth = await $discord.commands.authenticate({ access_token: accessToken })
        if (auth == null) throw new Error('Authenticate command failed')
        return { auth }
    })
    .add('initialize', async ({ auth }) => {
        instanceStore.auth = auth
        instanceStore.participants = (await $discord.commands.getInstanceConnectedParticipants()).participants

        $discord.subscribe(Events.ACTIVITY_INSTANCE_PARTICIPANTS_UPDATE, ({ participants }) => {
            instanceStore.participants = participants
        })
    })

const { status, progress, done, retry } = initSdkRoutine.use()

const failureMessage = computed(() => {
    if (status.value !== 'error') return null
    if (progress.value === 'connect') return 'Failed to load Discord SDK'
    if (progress.value === 'authorize') return 'Failed to authorize with Discord'
    if (progress.value === 'authenticate') return 'Failed to authenticate with Discord'
    if (progress.value === 'initialize') return 'Failed to initialize instance'
    return 'An unknown error has occurred'
})
</script>

<template>
    <div>
        <div v-if="done">
            <Client />
        </div>
        <div v-else-if="status === 'pending'">Loading... ({{ progress }})</div>
        <div v-else-if="failureMessage">{{ failureMessage }}</div>
    </div>
</template>
