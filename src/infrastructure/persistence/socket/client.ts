import SocketSendActions from "./data/send-actions"

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

  async tryOpen(tries = 15, timeout = 2500) {
    for (let i = 0; i < tries; i++) {
      try {
        await this.open()
        return
      } catch (error) {
        await new Promise(resolve => setTimeout(resolve, timeout))
      }
    }
    throw new Error("Socket connection failed.")
  }

  open() {
    if (this.socket?.OPEN) return Promise.resolve()

    return new Promise<void>((resolve, reject) => {
      const authKey = localStorage.getItem("auth-key")
      const url = new URL(this.url + "/" + authKey)

      this.socket = new WebSocket(url)
      this.socket.addEventListener("open", () => resolve(), { once: true })
      this.socket.addEventListener("error", reject, { once: true })

      for (const [callback, type] of this.callbacks) {
        this.socket.addEventListener(type, callback as EventListener)
      }
    })
  }

  transmit<A extends SocketSendActions>(type: A["type"], payload: A["payload"]) {
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

const ClientSocket = new Socket(process.env.REACT_APP_SOCKET_HOST)
export default ClientSocket

export function setAndTryOpenSocket(authKey: string) {
  localStorage.setItem("auth-key", authKey)
  return ClientSocket.tryOpen()
}