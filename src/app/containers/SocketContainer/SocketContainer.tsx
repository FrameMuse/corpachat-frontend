import LoaderCover from "app/ui/Loader/LoaderCover"
import { SocketError } from "infrastructure/persistence/socket/client.errors"
import useClientSocket from "infrastructure/persistence/socket/useClientSocket"
import { ReactNode, useEffect, useState } from "react"

interface SocketContainerProps {
  params?: Record<string, string | number>
  children: ReactNode
}

function SocketContainer(props: SocketContainerProps) {
  const [, setFlag] = useState(false)
  const clientSocket = useClientSocket()

  useEffect(() => {
    clientSocket
      .connect(props.params)
      .then(() => setFlag(flag => !flag))
  }, [clientSocket])

  if (clientSocket.state === "disconnected" && clientSocket.error) throw new SocketError("Error during connecting to socket.")
  if (clientSocket.state === "disconnected") throw new SocketError("Failed to connect to socket.")
  if (clientSocket.state === "connecting") return <LoaderCover />

  return <>{props.children}</>
}

export default SocketContainer