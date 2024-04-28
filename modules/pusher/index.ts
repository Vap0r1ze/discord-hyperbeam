import { defineNuxtModule, createResolver, addPlugin, addImports, addServerImports } from 'nuxt/kit'
import type { Options } from 'pusher-js'

export default defineNuxtModule({
    meta: {
        name: 'pusher-nuxt',
        configKey: 'pusher',
    },
    defaults: {
        appId: '',
        key: '',
        secret: '',
        host: 'ws-us2.pusher.com',
        transports: ['ws', 'wss'] as Options['enabledTransports'] & {},
        forceTLS: true,
        apiBase: '/api/pusher',
    },
    setup(options, nuxt) {
        nuxt.options.runtimeConfig.public.pusher = {
            host: options.host,
            key: options.key,
            forceTLS: options.forceTLS,
            transports: options.transports,
            apiBase: options.apiBase,
        }
        nuxt.options.runtimeConfig.pusher = {
            appId: options.appId,
            secret: options.secret,
        }

        const { resolve } = createResolver(import.meta.url)
        addPlugin(resolve('./runtime/plugin'))
        addImports([{
            from: resolve('./runtime/client'),
            name: 'createPusherClient',
        }])
        addServerImports([{
            from: resolve('./runtime/server/handler'),
            name: 'definePusherHandler',
        }])
    },
})
