export class SocketError extends Error {
  constructor(message: string, public event?: WebSocketEventMap["error"]) {
    super(message)
    this.name = "SocketError"
  }
}
