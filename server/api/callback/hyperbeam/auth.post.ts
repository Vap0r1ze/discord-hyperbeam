import { z } from 'zod'

const authBodySchema = z.object({
    user_id: z.string().uuid(),
    userdata: z.any(),
})
const userdataSchema = z.object({
    discord_id: z.string(),
})

export default defineEventHandler(async (event) => {
    validateBearer(event, process.env.HYPERBEAM_TOKEN!)
    const { user_id: userId, userdata } = await validateBody(event, authBodySchema)

    const userdataResult = userdataSchema.safeParse(userdata)
    if (import.meta.dev) console.log('User trying to authorize:', userId, userdata)
    if (!userdataResult.success) return { authorized: false }

    const { discord_id: discordId } = userdataResult.data

    return {
        authorized: true,
    }
})
