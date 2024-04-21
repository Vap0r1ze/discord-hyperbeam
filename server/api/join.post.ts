import { z } from "zod"
import { createSession } from "../hyperbeam"
import { discordHttp } from "../utils/discord"

const joinBodySchema = z.object({
    accessToken: z.string(),
    instanceId: z.string().uuid(),
    channelId: z.string().regex(/^\d{1,20}$/, 'Invalid snowflake'),
})

export default defineEventHandler(async (event) => {
    const result = await readValidatedBody(event, body => joinBodySchema.safeParse(body))

    if (!result.success) throw createError({
        status: 400,
        message: result.error.toString(),
    })

    const { accessToken, instanceId, channelId } = result.data
    const verified = await discordHttp.verifyInstance(accessToken, channelId, instanceId)

    if (!verified) throw createError({
        status: 403,
        message: 'You are not a part of this instance',
    })

    const session = createSession({
        tag: channelId,
    })

    return session
})
