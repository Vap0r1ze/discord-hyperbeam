import { defineNuxtModule, createResolver, addPlugin, addImports, addServerImports } from 'nuxt/kit'

type ProxyMapping = { prefix: string, target: string }
export default defineNuxtModule({
    meta: {
        name: 'discord-sdk-nuxt',
        configKey: 'discordSdk',
    },
    defaults: {
        clientId: '',
        publicKey: '',
        clientSecret: '',
        token: '',
        redirectUri: '',
        apiBase: '/api/discord',
        instanceTokenCookie: 'instance_token',
        proxyMappings: [] as ProxyMapping[],
    },
    async setup(options, nuxt) {
        nuxt.options.runtimeConfig.public.discord = {
            clientId: options.clientId,
            publicKey: options.publicKey,
            apiBase: options.apiBase,
            redirectUri: options.redirectUri,
            proxyMappings: options.proxyMappings,
        }
        nuxt.options.runtimeConfig.discord = {
            clientSecret: options.clientSecret,
            token: options.token,
            instanceTokenCookie: options.instanceTokenCookie,
        }

        const { resolve } = createResolver(import.meta.url)
        addPlugin(resolve('./runtime/plugin'))
        addImports([{
            from: resolve('./runtime/connect'),
            name: 'useDiscordConnect',
        }, {
            from: resolve('./runtime/store'),
            name: 'useInstanceStore',
        }])
        addServerImports([{
            from: resolve('./runtime/server/handler'),
            name: 'defineTokenHandler',
        }, {
            from: resolve('./runtime/server/handler'),
            name: 'useInstanceToken',
        }])
    },
})
