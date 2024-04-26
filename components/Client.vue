<<script setup lang="ts">
const { data: session, status: sessionStatus } = useFetch('/api/join', { method: 'post', credentials: 'include' })

function patchEmbedUrl(embed: string) {
    const url = new URL(embed)
    const [id1] = url.hostname.split('.')
    const id2 = url.pathname.slice(1)
    return window.location.origin + `/vm/${id1}/${id2}${url.search}`
}
</script>

<template>
    <div class="relative overflow-clip h-screen" v-if="session">
        <Hyperbeam :embed="patchEmbedUrl(session.embed)" />
        <!-- <div
            v-for="[userId, pos] in Object.entries(cursors)"
            :key="userId"
            :style="{ top: pos.y * 100 + '%', left: pos.x * 100 + '%' }"
            class="absolute pointer-events-none"
        >
            <Icon name="tabler:pointer-filled" />
        </div> -->
    </div>
</template>
