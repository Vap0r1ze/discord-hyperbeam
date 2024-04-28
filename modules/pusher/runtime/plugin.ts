import Pusher, { type Options } from 'pusher-js'

export default defineNuxtPlugin(({ $config }) => {
    const pusher = new Pusher($config.public.pusher.key, {
        wsHost: $config.public.pusher.host,
        cluster: '',
        forceTLS: $config.public.pusher.forceTLS,
        enabledTransports: $config.public.pusher.transports as Options['enabledTransports'],
        channelAuthorization: {
            transport: 'ajax',
            endpoint: $config.public.pusher.apiBase + '/authorize',
        },
        userAuthentication: {
            transport: 'ajax',
            endpoint: $config.public.pusher.apiBase + '/authenticate',
        },
    })

    return {
        provide: { pusher },
    }
})
