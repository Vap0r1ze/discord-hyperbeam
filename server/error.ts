import { H3Error, H3Event } from 'h3'

export default defineNitroErrorHandler((error: H3Error, event: H3Event) => {
    setResponseHeader(event, 'Content-Type', 'text/plain')
    return send(event, `[${error.statusCode}] ${error.message ?? ''}`)
})
