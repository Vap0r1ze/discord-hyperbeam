<<script setup lang="ts">
import type { Cursor } from '~/utils/pusher'

const { data: session, status: sessionStatus } = useFetch('/api/join', { method: 'post', credentials: 'include' })
const { $discordSdk } = useNuxtApp()

const instance = useInstanceStore()

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

function colorFromHash(hashBytes: Uint8Array) {
    return `oklch(76.11% 0.1477 ${hashBytes[0] / 0xFF * 360})`
}
const cursorColorRefs = ref<Record<string, string | Promise<string>>>({})
const cursorColors = computed(() => {
    const colors: Record<string, string> = {}

    for (const userId of Object.keys(cursors.value)) {
        const savedColor = cursorColorRefs.value[userId]

        if (typeof savedColor === 'string') {
            colors[userId] = savedColor
            continue
        }
        if (!savedColor) {
            cursorColorRefs.value[userId] = window.crypto.subtle.digest('SHA-256', new TextEncoder().encode(userId)).then((hashBuffer) => {
                return cursorColorRefs.value[userId] = colorFromHash(new Uint8Array(hashBuffer))
            })
        }

        colors[userId] = '#333'
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
        if (~~current.t + 1 === targets.length) {
            current.cursor.x = targets[~~current.t].x
            current.cursor.y = targets[~~current.t].y
        } else {
            current.cursor.x = lerp(targets[~~current.t].x, targets[~~current.t + 1].x, current.t - ~~current.t)
            current.cursor.y = lerp(targets[~~current.t].y, targets[~~current.t + 1].y, current.t - ~~current.t)
        }
        current.cursor.style = targets[~~current.t].style
        current.cursor.active = targets[~~current.t].active
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
                color: cursorColors[userId],
                top: cursor.y + 'px',
                left: cursor.x + 'px',
            }"
            class="flex absolute pointer-events-none text-xl"
        >
            <Icon v-if="cursor.style === 'text'" name="mdi:cursor-text" style="transform: translate(calc(-50% + 0.15em), -50%)" />
            <Icon v-else-if="cursor.style === 'pointer'" name="mdi:cursor-pointer" style="transform: translate(-0.4em, -0.1em)" />
            <Icon v-else name="mdi:cursor-default" style="transform: translate(-0.2em, -0.1em)" />
        </div>
    </div>
</template>
