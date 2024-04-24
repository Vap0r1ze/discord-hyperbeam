import Hyperbeam from '@hyperbeam/web'

interface HyperbeamOptions {
    adminToken?: string
}

type NullishWatchable<T> = Ref<T | null> | ComputedRef<T | null>

export function useHyperbeam(embedUrl: NullishWatchable<string>, opts: HyperbeamOptions = {}) {
    const container = ref<HTMLDivElement | null>(null)
    const cursors = ref<Record<string, { x: number, y: number }>>({})

    const { data: hb, status: hbStatus } = useAsyncData(async () => {
        if (embedUrl.value == null || container.value == null) return

        // @ts-ignore
        window.RTCPeerConnection = window.RTCPeerConnection || window.webkitRTCPeerConnection || window.mozRTCPeerConnection

        return await Hyperbeam(container.value, location.origin + embedUrl.value, {
            adminToken: opts.adminToken,
            onCursor: ({ x, y, userId }) => {
                cursors.value = { ...cursors.value, [userId]: { x, y } }
                console.log('onCursor', userId, x, y)
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

    return { hb, container, cursors }
}
