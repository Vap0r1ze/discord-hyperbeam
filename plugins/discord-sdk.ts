import { DiscordSDK } from '@discord/embedded-app-sdk'

export default defineNuxtPlugin(nuxtApp => ({
    provide: {
        discord: new DiscordSDK(nuxtApp.$config.public.discordClientId),
    },
}))
