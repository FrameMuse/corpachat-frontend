import { createQuery } from "utils/common"

import { SocketError } from "./client.errors"
import { SocketSettings, SocketState } from "./client.types"
import SocketReceiveActions from "./data/receive-actions"
import SocketSendActions from "./data/send-actions"

class Socket {
  private socket: WebSocket | null = null
  private callbacks: Map<Function, string> = new Map
  public state: SocketState = null
  public error = false
  public settings: SocketSettings = {
    reconnection: {
      delay: 2500,
      attempts: 10
    }
  }
  constructor(readonly url: string, settings?: Partial<SocketSettings>) {
    this.settings = {
      ...this.settings,
      ...settings
    }
  }

  // async tryOpen(tries = 15, timeout = 2500) {
  //   for (let i = 0; i < tries; i++) {
  //     try {
  //       await this.open()
  //       return
  //     } catch (error) {
  //       await new Promise(resolve => setTimeout(resolve, timeout))
  //     }
  //   }
  //   throw new Error("Socket connection failed.")
  // }

  /**
   * Tries to reconnect back to the socket.
   * 
   * @returns if the socket is reconnected
   */
  async reconnect(): Promise<boolean> {
    if (this.error === false) return false

    if (this.socket == null) {
      throw new SocketError("Socket is not initialized.")
    }

    const reconnection = this.settings.reconnection
    for (let i = 0; i < reconnection.attempts; i++) {
      try {
        await this.new(this.socket.url)
        if (!this.error) return false
        return true
      } catch (error) {
        await new Promise(resolve => setTimeout(resolve, reconnection.delay))
      }
    }

    return false
  }

  new(url: string | URL, protocols?: string | string[] | undefined) {
    return new Promise<void>((resolve, reject) => {
      this.state = "connecting"

      const openEvent = () => {
        this.state = "connected"
        resolve()
      }
      const closeEvent = () => {
        this.state = "disconnected"
        reject()
      }
      const errorEvent = (event: Event) => {
        console.log(event)
        this.error = true
        closeEvent()
      }

      this.socket = new WebSocket(url, protocols)
      this.socket.addEventListener("open", openEvent, { once: true })
      this.socket.addEventListener("error", closeEvent, { once: true })
      this.socket.addEventListener("close", errorEvent, { once: true })

      for (const [callback, type] of this.callbacks) {
        this.socket.addEventListener(type, callback as EventListener)
      }
    })
  }

  /**
   * Create a socket connect with extra parameters.
   * 
   * @param params - query params
   * @returns @returns if the socket is connected
   */
  async connect(params?: Record<string, string | number>): Promise<boolean> {
    this.socket?.close()

    const searchQuery = createQuery({ ...this.settings.defaultParams, ...params })
    try {
      await this.new(`${this.url}?${searchQuery}`)
    } catch (error) {
      console.log(6)
      return this.reconnect()
    }

    return true
  }

  transmit<A extends SocketSendActions>(type: A["type"], payload: A["payload"]) {
    this.socket?.send(JSON.stringify({ type, payload }))
  }

  // receive<A extends SocketReceiveActions>(type: A["type"], callback: (payload: A["payload"]) => void) {
  //   this.on("message", event => {
  //     const payload = JSON.parse(event.data) as A["payload"]
  //     callback(payload)
  //   })
  // }

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

const ClientSocket = new Socket(process.env.REACT_APP_SOCKET_HOST, {
  defaultParams: {
    auth_key: localStorage.getItem("auth-key") ?? ""
  }
})

// ClientSocket.receive("ERROR", () => {
//   if (process.env.NODE_ENV === "development") {
//     console.log("Socket error.")
//   }

//   ClientSocket.reconnect()
// })

export default ClientSocket
