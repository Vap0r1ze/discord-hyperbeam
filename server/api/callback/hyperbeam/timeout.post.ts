import { z } from 'zod'

const timeoutBodySchema = z.object({
    session_id: z.string().uuid(),
})

export default defineEventHandler(async (event) => {
    validateBearer(event, process.env.HYPERBEAM_TOKEN!)
    const { session_id: sessionId } = await validateBody(event, timeoutBodySchema)

    if (import.meta.dev) console.log('Session timed out: %s', sessionId)

    return null
})
