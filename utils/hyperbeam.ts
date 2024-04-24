import Hyperbeam from '@hyperbeam/web'

interface HyperbeamOptions {
    adminToken?: string
}

type NullishWatchable<T> = Ref<T | null> | ComputedRef<T | null>

export function useHyperbeam(embedUrl: NullishWatchable<string>, opts: HyperbeamOptions = {}) {
    const container = ref<HTMLDivElement | null>(null)
    const cursors = ref<Record<string, { x: number, y: number }>>({})
    const instanceStore = useInstanceStore()

    const { data: hb, status } = useAsyncData(async () => {
        if (embedUrl.value == null || container.value == null) return
        if (!instanceStore.auth) return void console.error('Tried to connect to Hyperbeam before Discord SDK authenticated')

        // @ts-ignore
        window.RTCPeerConnection = window.RTCPeerConnection || window.webkitRTCPeerConnection || window.mozRTCPeerConnection

        return await Hyperbeam(container.value, location.origin + embedUrl.value, {
            adminToken: opts.adminToken,
            webhookUserdata: {
                discord_id: instanceStore.auth.user.id,
            },
        })
    }, {
        watch: [embedUrl, container],
    })

    function cleanup() {
        hb.value?.destroy()
    }
    useEventListener(window, 'unload', cleanup)
    onBeforeUnmount(cleanup)

    return { hb, status, container, cursors }
}
