import { z } from 'zod'

const timeoutBodySchema = z.object({
    session_id: z.string().uuid(),
})

export default defineEventHandler(async (event) => {
    if (event.headers.get('authorization') !== `Bearer ${process.env.HYPERBEAM_TOKEN}`)
        throw createError({ status: 401, message: 'Unauthorized' })

    const result = await readValidatedBody(event, body => timeoutBodySchema.safeParse(body))
    if (!result.success) throw createError({
        status: 400,
        message: result.error.toString(),
    })

    if (import.meta.dev) {
        console.log('Session timed out: %s', result.data.session_id)
    }

    return null
})
