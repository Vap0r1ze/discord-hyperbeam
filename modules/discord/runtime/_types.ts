import type { DiscordSDK, EventPayloadData, Events } from '@discord/embedded-app-sdk'

export type Participant = EventPayloadData<Events.ACTIVITY_INSTANCE_PARTICIPANTS_UPDATE>['participants'][number]
export type AuthenticatedUser = Awaited<ReturnType<DiscordSDK['commands']['authenticate']>>
