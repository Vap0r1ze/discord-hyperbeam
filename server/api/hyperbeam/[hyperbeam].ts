
import { z } from 'zod'

const userDataSchema = z.object({
    discord_id: z.string(),
})

export default defineHyperbeamHandler({
    onTimeout(event, sessionId) {
        validateBearer(event, process.env.HYPERBEAM_TOKEN!)
        if (import.meta.dev) console.log('Session timed out: %s', sessionId)
    },
    authorize(event, userId, userData) {
        validateBearer(event, process.env.HYPERBEAM_TOKEN!)

        const userdataResult = userDataSchema.safeParse(userData)
        if (import.meta.dev) console.log('User trying to authorize:', userId, userData)
        if (!userdataResult.success) return { authorized: false }

        const { discord_id: discordId } = userdataResult.data

        return {
            authorized: true,
        }
    },
})
