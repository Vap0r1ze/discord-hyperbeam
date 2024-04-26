import type { AuthenticatedUser, Participant } from './_types'

const instanceStore = {
    participants: ref<Participant[]>([]),
    auth: ref<AuthenticatedUser | null>(null),
}

export function useInstanceStore() {
    return instanceStore
}
