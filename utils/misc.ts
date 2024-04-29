export async function getColorFromId(id: string) {
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', new TextEncoder().encode(id))
    const hashBytes = new Uint8Array(hashBuffer)
    return `oklch(0.7 0.17 ${hashBytes[0] / 0xFF * 360})`
}

export function getAvatarUrl(user: { id: string, avatar?: string | null }) {
    if (!user.avatar) {
        const defaultAvatarIndex = Math.abs(Number(user.id) >> 22) % 6
        return `https://cdn.discordapp.com/embed/avatars/${defaultAvatarIndex}.png`
    }
    return `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`
}
