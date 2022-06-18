import { URLDataBase64 } from "types"

import { SocketActionAny } from "../client.types"

interface CHAT_SEND_MESSAGE extends SocketActionAny {
  type: "CHAT_SEND_MESSAGE",
  payload: {
    message: string
    attachments?: (URLDataBase64 | string)[]
  }
}

type SocketSendActions =
  | CHAT_SEND_MESSAGE

export default SocketSendActions