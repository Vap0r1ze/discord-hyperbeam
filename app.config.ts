declare global {
    interface ImportMeta {
        env: NodeJS.ProcessEnv
    }
}

export default defineAppConfig({
    nuxtIcon: {
        iconifyApiOptions: {
            url: `https://${import.meta.env.VITE_DISCORD_CLIENT_ID}/_icons`,
            publicApiFallback: false,
        },
    },
})
