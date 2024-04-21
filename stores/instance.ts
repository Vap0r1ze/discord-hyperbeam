import type { AuthenticatedUser, Participant } from "~/types/discord"

export const useInstanceStore = defineStore('instance', () => {
    const participants = ref<Participant[]>([])
    const auth = ref<AuthenticatedUser | null>(null)

    return {
        participants,
        auth,
    }
})
