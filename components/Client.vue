<<script setup lang="ts">
import type { Cursor } from '~/utils/pusher'

const { data: session, status: sessionStatus } = useFetch('/api/join', { method: 'post', credentials: 'include' })
const { $discordSdk } = useNuxtApp()

const { participants } = useInstanceStore()

const selfCursor = ref<Cursor>({
    x: 0,
    y: 0,
    style: 'default',
    active: false,
})
const cursors = ref<Record<string, {
    t: number,
    cursor: Cursor,
}>>({})
const cursorTargets = ref<Record<string, Cursor[]>>({})

const cursorColorRefs = ref<Record<string, string | Promise<string>>>({})
const userColors = computed(() => {
    const colors: Record<string, string> = {}

    for (const user of participants.value) {
        const savedColor = cursorColorRefs.value[user.id]

        if (typeof savedColor === 'string') {
            colors[user.id] = savedColor
            continue
        }
        if (!savedColor) {
            cursorColorRefs.value[user.id] = getColorFromId(user.id).then((color) => {
                return cursorColorRefs.value[user.id] = color
            })
        }

        colors[user.id] = '#333'
    }

    return colors
})

const channel = usePusherChannel(`presence-instance-${$discordSdk.instanceId}`)
usePusherEvent(channel, 'client-cursor', ({ frames }, { user_id }) => {
    const targets = cursorTargets.value[user_id] ??= []
    targets.push(...frames)
})

const { clear: flushSelfFramesBuffer, history: selfFramesBuffer } = useRefHistory(selfCursor)
watchDebounced(selfCursor, () => {
    if (!selfFramesBuffer.value.length) return
    channel.trigger('client-cursor', {
        frames: selfFramesBuffer.value.map(({ snapshot }) => snapshot),
    })
    flushSelfFramesBuffer()
}, {
    deep: true,
    debounce: 100,
    maxWait: 100,
})

const CURSOR_SPEED = 10 / 1000
useRafFn(({ delta }) => {
    for (const [userId, targets] of Object.entries(cursorTargets.value)) {
        const current = cursors.value[userId] ??= { t: 0, cursor: targets[0] }

        current.t += (targets.length - 1 - current.t) * (1 - Math.exp(-delta * CURSOR_SPEED))
        current.t = Math.max(0, Math.min(targets.length - 1, current.t))
        const i = ~~current.t

        if (i + 1 === targets.length) {
            current.cursor.x = targets[i].x
            current.cursor.y = targets[i].y
        } else {
            current.cursor.x = lerp(targets[i].x, targets[i + 1].x, current.t - i)
            current.cursor.y = lerp(targets[i].y, targets[i + 1].y, current.t - i)
        }
        current.cursor.style = targets[i].style
        current.cursor.active = targets[i].active

        // Prune old frames
        targets.splice(0, i)
        current.t -= i
    }
})
</script>

<template>
    <div
        v-if="session"
        class="relative overflow-clip h-screen"
        @mousemove="({ x, y }) => (selfCursor.x = x, selfCursor.y = y)"
        @mousedown="selfCursor.active = true"
        @mouseup="selfCursor.active = false"
        @mouseleave="selfCursor.active = false"
    >
        <Hyperbeam
            :embed="session.embed"
            :adminToken="session.adminToken"
            @cursor="newType => selfCursor.style = newType"
        />
        <div
            v-for="[userId, { cursor }] in Object.entries(cursors)"
            :key="userId"
            :style="{
                color: userColors[userId],
                top: cursor.y + 'px',
                left: cursor.x + 'px',
                stroke: 'rgba(0, 0, 0, 0.2)',
                strokeWidth: '1px',
            }"
            class="flex absolute pointer-events-none text-xl"
        >
            <Icon v-if="cursor.style === 'text'" name="mdi:cursor-text" style="transform: translate(calc(-50% + 0.15em), -50%)" />
            <Icon v-else-if="cursor.style === 'pointer'" name="mdi:cursor-pointer" style="transform: translate(-0.4em, -0.1em)" />
            <Icon v-else name="mdi:cursor-default" style="transform: translate(-0.2em, -0.1em)" />
        </div>
        <div class="flex flex-col absolute left-2 bottom-2 pointer-events-none">
            <div v-for="user in participants" :key="user.id">
                <img
                    :src="getAvatarUrl(user)"
                    :alt="user.username"
                    class="rounded-full w-8 h-8 border-2"
                    :style="{ borderColor: userColors[user.id] }"
                />
            </div>
        </div>
    </div>
</template>
