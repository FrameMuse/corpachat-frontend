import { useEffect } from "react"

import useClientSocket from "./useClientSocket"

function useEvent<T extends keyof WebSocketEventMap>(type: T, listener: (event: WebSocketEventMap[T]) => void) {
  const clientSocket = useClientSocket()

  useEffect(() => {
    clientSocket.on(type, listener)
    return () => {
      clientSocket.off(type, listener)
    }
  }, [type])
}

export default useEvent