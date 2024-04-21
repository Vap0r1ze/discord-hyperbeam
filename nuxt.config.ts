// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    devtools: { enabled: false },
    ssr: false,

    runtimeConfig: {
        public: {
            discordClientId: '',
            discordPublicKey: '',
        },
    },

    modules: ['radix-vue/nuxt', '@nuxtjs/tailwindcss', '@pinia/nuxt'],
})
