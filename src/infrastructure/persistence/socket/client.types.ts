export type SocketState = "connecting" | "connected" | "disconnected" | null

export interface SocketAction<T extends string, P> {
  type: T
  payload: P
}

export type SocketActionAny = SocketAction<string, unknown>

export interface SocketSettings {
  defaultParams?: Record<string, string | number>
  reconnection: {
    delay: number // ms to wait before reconnecting
    attempts: number // max number of reconnection attempts before giving up (0 = infinity) (default: 10) 
  }
}
