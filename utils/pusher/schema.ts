import { z } from "zod"

export const cursorSchema = z.object({
    x: z.number(),
    y: z.number(),
    style: z.string(),
    active: z.boolean(),
})
export const cursorPacketSchema = z.object({
    frames: z.array(cursorSchema),
})

export type Cursor = z.infer<typeof cursorSchema>
export type CursorPacket = z.infer<typeof cursorPacketSchema>

export type PusherSchema =
    | [`presence-instance-${string}`,
        | ['client-cursor', z.infer<typeof cursorPacketSchema>]
    ]
