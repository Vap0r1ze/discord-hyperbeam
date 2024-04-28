export default defineNuxtConfig({
    // devtools: { enabled: true },
    devtools: { enabled: false },
    ssr: false,

    nitro: {
        errorHandler: '~/error',
    },

    modules: ['@nuxtjs/tailwindcss', '@vueuse/nuxt', 'nuxt-icon', 'radix-vue/nuxt'],
    pusher: {
        appId: process.env.PUSHER_APP_ID,
        key: process.env.PUSHER_KEY,
        secret: process.env.PUSHER_SECRET,
        host: process.env.PUSHER_HOST,
    },
    discordSdk: {
        clientId: process.env.VITE_DISCORD_CLIENT_ID,
        clientSecret: process.env.DISCORD_CLIENT_SECRET,
        publicKey: process.env.DISCORD_PUBLIC_KEY,
        token: process.env.DISCORD_TOKEN,
        redirectUri: process.env.DISCORD_REDIRECT_URI,
        proxyMappings: [{
            prefix: '/vm/{projectid}',
            target: '{projectid}.hyperbeam.com',
        }, {
            prefix: '/pusher',
            target: process.env.PUSHER_HOST || 'ws-us2.pusher.com',
        }],
    },
    hyperbeam: {
        token: process.env.HYPERBEAM_TOKEN,
    },
})
