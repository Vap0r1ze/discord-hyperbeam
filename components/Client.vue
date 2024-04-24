<<script setup lang="ts">
const { $discord } = useNuxtApp()
const instanceStore = useInstanceStore()

const { data: session, status: sessionStatus } = useFetch('/api/join', {
    method: 'post',
    body: {
        accessToken: instanceStore.auth?.access_token,
        instanceId: $discord.instanceId,
        channelId: $discord.channelId,
    },
})

const embedUrl = computed(() => {
    if (session.value == null) return null
    const url = new URL(session.value.embed_url)
    const [id1] = url.hostname.split('.')
    const id2 = url.pathname.slice(1)
    return `/vm/${id1}/${id2}${url.search}`
})

const { hb, container, cursors } = useHyperbeam(embedUrl)
</script>

<template>
    <div class="relative overflow-clip" v-if="session">
        <div class="h-screen w-screen" ref="container" />
        <div
            v-for="[userId, pos] in Object.entries(cursors)"
            :key="userId"
            :style="{ top: pos.y * 100 + '%', left: pos.x * 100 + '%' }"
            class="absolute pointer-events-none"
        >
            <Icon name="tabler:pointer-filled" />
        </div>
    </div>
</template>
