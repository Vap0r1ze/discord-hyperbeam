import type { H3Event, EventHandlerRequest } from 'h3'
import { ZodSchema } from 'zod'

export async function validateBody<Body>(
    event: H3Event<EventHandlerRequest>,
    schema: ZodSchema<Body>,
) {
    const result = await readValidatedBody(event, body => schema.safeParse(body))

    if (!result.success) throw createError({
        status: 400,
        message: result.error.toString(),
    })

    return result.data
}

export function validateBearer(event: H3Event<EventHandlerRequest>, token: string) {
    if (event.headers.get('authorization') !== `Bearer ${token}`)
        throw createError({ status: 401, message: 'Unauthorized' })
}
