import { ChatMessageType } from "app/containers/Chat/Chat.types"

import { SocketActionAny } from "../client.types"

interface ERROR extends SocketActionAny {
  type: "ERROR",
  payload: {
    REASON: string | number
  }
}

interface CHAT_RECEIVE_MESSAGE extends SocketActionAny {
  type: "CHAT_RECEIVE_MESSAGE",
  payload: ChatMessageType
}

type SocketReceiveActions =
  // | ERROR
  | CHAT_RECEIVE_MESSAGE

export default SocketReceiveActions