import { createSession } from "../hyperbeam"

export default defineEventHandler(async (event) => {
    const token = await useInstanceToken(event, true)

    if (!token) throw createError({
        status: 403,
        message: 'You are not a part of this instance',
    })

    const session = await createSession({
        tag: `${import.meta.dev ? 'dev' : 'prod'}:${token.channelId}`,
        ublock: true,
        default_roles: ['control', 'clipboard_copy', 'cursor_data'],
        hide_cursor: true,
        timeout: {
            offline: 0,
            webhook: {
                url: `https://${process.env.NUXT_PUBLIC_DOMAIN}/api/hyperbeam/timeout`,
                bearer: process.env.HYPERBEAM_TOKEN!,
            },
        },
        auth: {
            type: 'webhook',
            value: {
                url: `https://${process.env.NUXT_PUBLIC_DOMAIN}/api/hyperbeam/auth`,
                bearer: process.env.HYPERBEAM_TOKEN!,
            },
        },
    })

    if (import.meta.dev) console.log('Session created: %s', session.session_id)

    return {
        id: session.session_id,
        embed: session.embed_url,
        adminToken: session.admin_token,
    }
})
