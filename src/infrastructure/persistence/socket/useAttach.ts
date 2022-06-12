import { Dispatch } from "react"

import SocketReceiveActions from "./data/receive-actions"
import useEvent from "./useEvent"

function useAttach<A extends SocketReceiveActions>(type: A["type"], callback: Dispatch<A["payload"]>) {
  useEvent("message", listener)
  function listener(event: MessageEvent) {
    try {
      const response = event.data
      const responseJson = JSON.parse(response) as A

      if (!("type" in responseJson)) throw new Error("Socket response does not contain `type` field.")
      if (!("payload" in responseJson)) throw new Error("Socket response does not contain `payload` field.")

      if (responseJson.type === type) callback(responseJson.payload)
    } catch (error) {
      console.error(error)
    }
  }
}

export default useAttach