export default defineEventHandler(async (event) => {
    const token = await useInstanceToken(event, true)

    if (!token) throw createError({
        status: 403,
        message: 'You are not a part of this instance',
    })

    const session = await createHyperbeamSession({
        tag: `${import.meta.dev ? 'dev' : 'prod'}:${token.channelId}`,
        ublock: true,
        // default_roles: ['control', 'clipboard_copy', 'cursor_data'],
        hide_cursor: true,
        timeout: {
            offline: 1,
            webhook: true,
        },
        // auth: true,
    })

    if (import.meta.dev) console.log('Session joined: %s', session.session_id)

    return {
        id: session.session_id,
        embed: session.embed_url,
        adminToken: session.admin_token,
    }
})
