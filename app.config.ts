export default defineAppConfig({
    nuxtIcon: {
        iconifyApiOptions: {
            url: `https://${process.env.NUXT_PUBLIC_DISCORD_CLIENT_ID}.discordsays.com/_icons`,
            publicApiFallback: false,
        },
    },
})
