<script setup lang="ts">
const { status, progress, done, retry } = useDiscordConnect()

const failureMessage = computed(() => {
    if (status.value !== 'error') return null
    if (progress.value === 'connect') return 'Failed to load Discord SDK'
    if (progress.value === 'authorize') return 'Failed to authorize with Discord'
    if (progress.value === 'authenticate') return 'Failed to authenticate with Discord'
    if (progress.value === 'initialize') return 'Failed to initialize instance'
    return 'An unknown error has occurred'
})
</script>

<template>
    <div>
        <div v-if="done">
            <Client />
        </div>
        <div v-else-if="status === 'pending'">Loading... ({{ progress }})</div>
        <div v-else-if="failureMessage">{{ failureMessage }}</div>
    </div>
</template>
