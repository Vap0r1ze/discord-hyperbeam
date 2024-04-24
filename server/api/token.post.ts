import { z } from 'zod'
import { Discord } from 'arctic'

const discord = new Discord(process.env.NUXT_PUBLIC_DISCORD_CLIENT_ID!, process.env.DISCORD_CLIENT_SECRET!, process.env.NUXT_PUBLIC_DISCORD_REDIRECT_URI!)
const bodySchema = z.object({
    code: z.string(),
})

export default defineEventHandler(async (event) => {
    const { code } = await validateBody(event, bodySchema)
    const { accessToken } = await discord.validateAuthorizationCode(code)

    return { accessToken }
})
