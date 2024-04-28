<script setup lang="ts">
import type { CSSProperties } from 'vue';
import { useHyperbeam } from '../hyperbeam'

const { embed, adminToken } = defineProps<{
    embed: string
    adminToken?: string | null
}>()

const { hb, container } = useHyperbeam(embed, {
    adminToken,
})

const emit = defineEmits<{
    'cursor': [string]
}>()

const cachedCursor = ref('default')

const shadowRoot = computed(() => container.value?.shadowRoot)
// @ts-expect-error
useMutationObserver(shadowRoot, (mutations) => {
    mutations.forEach(mutation => {
        if (mutation.type !== 'attributes') return
        if ((mutation.target as Element).id !== 'vid') return

        const { cursor } = (mutation.target as HTMLVideoElement).style
        if (!cursor || cursor === cachedCursor.value) return

        cachedCursor.value = cursor
        emit('cursor', cursor)
    })
}, {
    attributes: true,
    attributeFilter: ['style'],
    subtree: true,
})
</script>

<template>
    <div style="width:100%;height:100%" ref="container" />
</template>
