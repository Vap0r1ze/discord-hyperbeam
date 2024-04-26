<<script setup lang="ts">
const { data: session, status: sessionStatus } = useFetch('/api/join', { method: 'post', credentials: 'include' })
</script>

<template>
    <div class="relative overflow-clip h-screen" v-if="session">
        <Hyperbeam :embed="session.embed" />
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
