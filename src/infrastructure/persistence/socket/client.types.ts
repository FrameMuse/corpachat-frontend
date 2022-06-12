export interface SocketAction<T extends string, P> {
  type: T
  payload: P
}

export type SocketActionAny = SocketAction<string, unknown>