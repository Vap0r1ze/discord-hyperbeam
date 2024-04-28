export default defineNuxtPlugin(() => {
    // This is needed until Discord gives clipboard-read to their activity iframes
    navigator.clipboard.writeText = (text) => {
            return new Promise((resolve, reject) => {
            let success = false
            document.addEventListener('copy', (event) => {
                event.clipboardData?.setData('text/plain', text)
                event.preventDefault()
                success = true
            }, { once: true })
            document.execCommand('copy')
            success ? resolve() : reject()
        })
    }

    // This is needed until Hyperbeam supports WebTransport, or until I make a Hyperbeam alternative
    // @ts-expect-error
    window.RTCPeerConnection = window.RTCPeerConnection || window.webkitRTCPeerConnection || window.mozRTCPeerConnection
})
