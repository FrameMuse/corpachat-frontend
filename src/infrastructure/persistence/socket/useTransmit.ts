import SocketSendActions from "./data/send-actions"
import useClientSocket from "./useClientSocket"

function useTransmit<A extends SocketSendActions>(type: A["type"]) {
  const clientSocket = useClientSocket()
  function transmit(payload: A["payload"]) {
    clientSocket.transmit(type, payload)
  }
  return transmit
}

export default useTransmit