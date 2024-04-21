import { z } from 'zod'
import { Discord } from 'arctic'

const discord = new Discord(process.env.NUXT_PUBLIC_DISCORD_CLIENT_ID!, process.env.DISCORD_CLIENT_SECRET!, process.env.NUXT_PUBLIC_DISCORD_REDIRECT_URI!)
const bodySchema = z.object({
    code: z.string(),
})

export default defineEventHandler(async (event) => {
    const result = await readValidatedBody(event, body => bodySchema.safeParse(body))

    if (!result.success) throw result.error.issues

    const { accessToken } = await discord.validateAuthorizationCode(result.data.code)
    return { accessToken }
})
