// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    // devtools: { enabled: true },
    devtools: { enabled: false },
    ssr: false,

    runtimeConfig: {
        public: {
            discordClientId: '',
            discordPublicKey: '',
        },
    },

    modules: ['@nuxtjs/tailwindcss', '@pinia/nuxt', '@vueuse/nuxt', 'nuxt-icon', 'radix-vue/nuxt'],
})
