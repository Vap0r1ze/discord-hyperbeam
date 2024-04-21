<<script setup lang="ts">
import Hyperbeam from '@hyperbeam/web'

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

const containerRef = ref<HTMLDivElement | null>(null)
const { data: hb, status: hbStatus } = useAsyncData(async () => {
    if (embedUrl.value == null || containerRef.value == null) return
    // @ts-ignore
    window.RTCPeerConnection = window.RTCPeerConnection || window.webkitRTCPeerConnection || window.mozRTCPeerConnection
    return await Hyperbeam(containerRef.value, location.origin + embedUrl.value)
}, {
    watch: [embedUrl, containerRef],
})

onBeforeUnmount(() => {
    hb.value?.destroy()
})
</script>

<template>
    <div v-if="session">
        <div class="h-screen w-screen" ref="containerRef" />
    </div>
</template>
