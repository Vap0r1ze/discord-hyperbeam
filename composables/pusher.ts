import type { PusherSchema } from '~/utils/pusher'

export const { usePusherChannel, usePusherEvent } = createPusherClient<PusherSchema>()
