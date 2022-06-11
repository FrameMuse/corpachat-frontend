class Socket {
  private socket: WebSocket | null = null
  private callbacks: Map<Function, string> = new Map
  constructor(readonly url: string) {
    // this.socket = new WebSocket(url)

    // this.socket.addEventListener("close", () => {
    //   const interval = setInterval(() => {
    //     if ()
    //     this.socket = new WebSocket(url)
    //   }, 1000)
    // })
  }

  open() {
    return new Promise<void>(resolve => {
      this.socket = new WebSocket(this.url)
      this.socket.addEventListener("open", () => {
        resolve()
      }, { once: true })

      for (const [callback, type] of this.callbacks) {
        this.socket.addEventListener(type, callback as EventListener)
      }
    })
  }

  transmit<P extends Record<keyof never, unknown>, T extends string = string>(type: T, payload: P) {
    this.socket?.send(JSON.stringify({ type, payload }))
  }

  on<K extends keyof WebSocketEventMap>(type: K, listener: (this: WebSocket, ev: WebSocketEventMap[K]) => unknown) {
    this.socket?.addEventListener(type, listener)
    this.callbacks.set(listener, type)
  }
  //! Needs refactoring
  off<K extends keyof WebSocketEventMap>(type: K, listener: (this: WebSocket, ev: WebSocketEventMap[K]) => unknown) {
    this.socket?.removeEventListener(type, listener)
    this.callbacks.delete(listener)
  }
}

const clientSocket = new Socket("ws://134.0.115.105:8998")
export default clientSocket