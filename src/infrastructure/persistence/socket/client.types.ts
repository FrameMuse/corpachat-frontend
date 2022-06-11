export interface SocketAction<T extends string, P> {
  type: T
  payload: P
}