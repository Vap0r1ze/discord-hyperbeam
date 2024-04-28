import { DiscordSDK, patchUrlMappings } from '@discord/embedded-app-sdk'

export default defineNuxtPlugin(nuxtApp => {
    const discordSdk = new DiscordSDK(nuxtApp.$config.public.discord.clientId)

    // @ts-ignore
    patchUrlMappings(nuxtApp.$config.public.discord.proxyMappings)

    return {
        provide: { discordSdk },
    }
})
