import { URLDataBase64 } from "types"

export interface ChatMessageType {
  user_id: number
  message: string
  attachments?: URLDataBase64[]
}