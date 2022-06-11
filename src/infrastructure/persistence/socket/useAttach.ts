import { Dispatch, useEffect } from "react"

import clientSocket from "./client"
import { SocketAction } from "./client.types"

type AttachTypes = ("disconnect") | (string & {})

function useAttach<P, T extends AttachTypes = AttachTypes>(type: T, callback: Dispatch<P>) {
  useEffect(() => {
    const event = () => callback(undefined as never)
    if (type === "disconnect") {
      clientSocket.on("close", event)
      return () => {
        clientSocket.off("close", event)
      }
    }

    function listener(event: MessageEvent) {
      try {
        const response = event.data
        const responseJson = JSON.parse(response) as SocketAction<T, P>

        if (!("type" in responseJson)) throw new Error("Socket response does not contain `type` field.")
        if (!("payload" in responseJson)) throw new Error("Socket response does not contain `payload` field.")

        if (responseJson.type === type) callback(responseJson.payload)
      } catch (error) {
        console.error(error)
      }
    }
    clientSocket.on("message", listener)
    return () => {
      clientSocket.off("message", listener)
    }
  }, [type])
}

export default useAttach