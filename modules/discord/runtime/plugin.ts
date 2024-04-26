import { DiscordSDK, patchUrlMappings } from '@discord/embedded-app-sdk'

export default defineNuxtPlugin(nuxtApp => {
    const discordSdk = new DiscordSDK(nuxtApp.$config.public.discord.clientId)

    return {
        provide: { discordSdk },
    }
})
