import type { Channel } from 'pusher-js'

export function createPusherClient<Schema extends [string, [string, unknown]]>() {
    function usePusherChannel<const C extends Schema[0]>(channelName: C) {
        const { $pusher } = useNuxtApp()
        const channel = $pusher.subscribe(channelName)

        return {
            _channel: channel,
            name: channelName,
            trigger<E extends SchemaGet<Schema, C>[0]>(eventName: E, data: SchemaGet<SchemaGet<Schema, C>, E>) {
                return channel.trigger(eventName, data)
            }
        }
    }

    function usePusherEvent<
        const C extends { _channel: Channel, name: string },
        const E extends SchemaGet<Schema, C['name']>[0],
    >(
        { _channel }: C,
        eventName: E,
        callback: (data: SchemaGet<SchemaGet<Schema, C['name']>, E>, metadata: { user_id: string }) => void,
    ) {
        _channel.bind(eventName, callback)
        onBeforeUnmount(() => {
            _channel.unbind(eventName, callback)
        })
    }

    return {
        usePusherChannel,
        usePusherEvent,
    }
}

type SchemaGet<Schema, C extends string> = Schema extends infer T ? T extends [infer K extends string, infer S] ? C extends K ? S : never : never : never
