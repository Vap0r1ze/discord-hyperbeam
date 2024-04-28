import Hyperbeam from '@hyperbeam/web'

interface HyperbeamOptions {
    adminToken?: string | null
    webhookUserdata?: () => Record<string, any>
}

export function useHyperbeam(embedUrl: string, opts: HyperbeamOptions = {}) {
    const container = ref<HTMLDivElement | null>(null)

    const { data: hb, status } = useAsyncData(async () => {
        if (container.value == null) return

        return await Hyperbeam(container.value, embedUrl, {
            adminToken: opts.adminToken ?? undefined,
            webhookUserdata: opts.webhookUserdata?.(),
        })
    }, {
        watch: [container],
    })

    const cleanup = () => hb.value?.destroy()
    useEventListener(window, 'unload', cleanup)
    onBeforeUnmount(cleanup)

    return { hb, status, container }
}
