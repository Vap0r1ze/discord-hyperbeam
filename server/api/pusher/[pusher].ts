export default definePusherHandler({
    async onAuthenticate(event, socketId) {
        const token = await useInstanceToken(event)
        if (token == null) return null

        return { id: token.userId }
    },
    async onAuthorize(event, channel, socketId) {
        const token = await useInstanceToken(event)
        if (token == null) return null

        // TODO: actually check to authorize the user

        return { id: token.userId }
    },
})
