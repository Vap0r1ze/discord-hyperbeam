import { z } from 'zod'

const authBodySchema = z.object({
    user_id: z.string().uuid(),
    userdata: z.any(),
})
const userdataSchema = z.object({
    discordId: z.string(),
})

export default defineEventHandler(async (event) => {
    if (event.headers.get('authorization') !== `Bearer ${process.env.HYPERBEAM_TOKEN}`)
        throw createError({ status: 401, message: 'Unauthorized' })

    const result = await readValidatedBody(event, body => authBodySchema.safeParse(body))
    if (!result.success) throw createError({
        status: 400,
        message: result.error.toString(),
    })

    const { user_id: userId, userdata } = result.data
    const userdataResult = userdataSchema.safeParse(userdata)
    if (import.meta.dev) console.log('User trying to authorize:', userId, userdata)
    if (!userdataResult.success) return { authorized: false }

    const { discordId } = userdataResult.data

    return {
        authorized: true,
    }
})
