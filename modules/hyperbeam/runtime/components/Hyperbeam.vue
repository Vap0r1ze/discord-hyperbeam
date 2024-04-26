<script setup lang="ts">
import { useHyperbeam } from '../hyperbeam'

const { embed, adminToken } = defineProps<{
    embed: string
    adminToken?: string | null
}>()

const { hb, container } = useHyperbeam(embed, {
    adminToken,
})
</script>

<template>
    <div style="width:100%;height:100%" ref="container" />
</template>
